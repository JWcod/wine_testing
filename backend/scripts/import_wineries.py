#!/usr/bin/env python3
"""
Import wineries from data/wineries_seed.json into SQLite.

Each winery record has a `region_name` field used to look up the region_id.
Regions must be imported first (run import_regions.py before this script).

- Skips duplicates (matched by name) — safe to re-run.
- Passes --update to overwrite existing records.

Usage:
    cd backend/
    python scripts/import_wineries.py
    python scripts/import_wineries.py --update
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import SessionLocal, init_db
from app.models.region import Region
from app.models.winery import Winery

SEED_FILE = Path(__file__).resolve().parent.parent / "data" / "wineries_seed.json"


def import_wineries(update: bool = False):
    init_db()

    with open(SEED_FILE, encoding="utf-8") as f:
        records = json.load(f)

    db = SessionLocal()

    # Build a name→id lookup for regions so we can resolve region_id
    region_map: dict[str, int] = {
        r.name: r.id for r in db.query(Region).all()
    }

    if not region_map:
        print("⚠️  No regions found in database. Run import_regions.py first.")
        db.close()
        sys.exit(1)

    inserted = 0
    updated = 0
    skipped = 0

    try:
        for rec in records:
            # Resolve region_id from region_name field in the JSON
            region_name = rec.get("region_name", "")
            region_id = region_map.get(region_name)
            if not region_id:
                print(f"  ⚠️  Region not found for winery '{rec['name']}': '{region_name}' — storing without region_id")

            specialties = json.dumps(rec.get("specialties") or [])

            existing = db.query(Winery).filter(Winery.name == rec["name"]).first()

            if existing and not update:
                print(f"  ⏭  Skipping (already exists): {rec['name']}")
                skipped += 1
                continue

            if existing and update:
                existing.region_id = region_id
                existing.country = rec["country"]
                existing.latitude = rec.get("latitude")
                existing.longitude = rec.get("longitude")
                existing.description = rec.get("description")
                existing.history = rec.get("history")
                existing.specialties = specialties
                existing.official_website = rec.get("official_website")
                print(f"  🔄  Updated: {rec['name']}")
                updated += 1
            else:
                winery = Winery(
                    name=rec["name"],
                    region_id=region_id,
                    country=rec["country"],
                    latitude=rec.get("latitude"),
                    longitude=rec.get("longitude"),
                    description=rec.get("description"),
                    history=rec.get("history"),
                    specialties=specialties,
                    official_website=rec.get("official_website"),
                )
                db.add(winery)
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
    import_wineries(update=update_mode)
