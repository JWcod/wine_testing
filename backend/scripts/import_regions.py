#!/usr/bin/env python3
"""
Import wine regions from data/regions_seed.json into SQLite.

- Skips duplicates (matched by name) — safe to re-run.
- Updates an existing region's fields if --update flag is passed.

Usage:
    cd backend/
    python scripts/import_regions.py          # insert-only
    python scripts/import_regions.py --update  # upsert (overwrite existing)
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal, init_db
from app.models.region import Region

SEED_FILE = Path(__file__).resolve().parent.parent / "data" / "regions_seed.json"


def import_regions(update: bool = False):
    init_db()  # ensure tables exist

    with open(SEED_FILE, encoding="utf-8") as f:
        records = json.load(f)

    db = SessionLocal()
    inserted = 0
    updated = 0
    skipped = 0

    try:
        for rec in records:
            existing = db.query(Region).filter(Region.name == rec["name"]).first()

            if existing and not update:
                print(f"  ⏭  Skipping (already exists): {rec['name']}")
                skipped += 1
                continue

            # Serialise list fields as JSON strings for SQLite TEXT storage
            characteristics = json.dumps(rec.get("characteristics") or [])
            famous_grapes = json.dumps(rec.get("famous_grapes") or [])

            if existing and update:
                existing.country = rec["country"]
                existing.latitude = rec["latitude"]
                existing.longitude = rec["longitude"]
                existing.description = rec.get("description")
                existing.history = rec.get("history")
                existing.climate = rec.get("climate")
                existing.soil = rec.get("soil")
                existing.characteristics = characteristics
                existing.famous_grapes = famous_grapes
                print(f"  🔄  Updated: {rec['name']}")
                updated += 1
            else:
                region = Region(
                    name=rec["name"],
                    country=rec["country"],
                    latitude=rec["latitude"],
                    longitude=rec["longitude"],
                    description=rec.get("description"),
                    history=rec.get("history"),
                    climate=rec.get("climate"),
                    soil=rec.get("soil"),
                    characteristics=characteristics,
                    famous_grapes=famous_grapes,
                )
                db.add(region)
                print(f"  ✅  Inserted: {rec['name']}")
                inserted += 1

        db.commit()
    except Exception as exc:
        db.rollback()
        print(f"\n❌  Error: {exc}")
        sys.exit(1)
    finally:
        db.close()

    print(f"\nDone — inserted: {inserted}, updated: {updated}, skipped: {skipped}")


if __name__ == "__main__":
    update_mode = "--update" in sys.argv
    import_regions(update=update_mode)
