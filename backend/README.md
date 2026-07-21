# Wine Atlas — Local Backend

FastAPI + SQLite backend for the Wine Atlas iPhone app.  
Runs on your Mac. iPhone connects over the same Wi-Fi network.

---

## Requirements

- **Python 3.11+** recommended (`python3 --version` to check)
- **pip** (comes with Python)

---

## Setup

### 1. Create a virtual environment

```bash
cd backend/
python3 -m venv .venv
source .venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Initialise the database

Creates `backend/wine_atlas.db` with all tables.

```bash
python scripts/init_db.py
```

### 4. Import seed data

**Regions first, then wineries (order matters):**

```bash
python scripts/import_regions.py
python scripts/import_wineries.py
```

Both scripts are safe to re-run (they skip existing records by default).  
Add `--update` to overwrite existing data:

```bash
python scripts/import_regions.py --update
python scripts/import_wineries.py --update
```

---

## Start the server

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

- `--host 0.0.0.0` makes the server reachable from your iPhone on the same Wi-Fi.
- `--reload` restarts the server automatically when you edit Python files.

**Interactive API docs:** open `http://localhost:8000/docs` in your browser.

---

## Connect iPhone to the server

### Find your Mac's local IP address

```bash
ipconfig getifaddr en0
```

Common output: `192.168.1.42` (your IP will differ).

If that returns nothing, try `en1`:

```bash
ipconfig getifaddr en1
```

Or check **System Settings → Wi-Fi → Details** for your current network.

### iPhone API base URL

```
http://192.168.x.x:8000
```

Replace `192.168.x.x` with your Mac's actual IP.

**Requirements:**
- iPhone and Mac must be on the **same Wi-Fi network**.
- Mac firewall must allow port 8000 (macOS usually prompts you the first time).

---

## API Endpoints

### Health check

```
GET /health
→ { "status": "ok", "service": "Wine Atlas API" }
```

### Regions

| Method | Path | Description |
|--------|------|-------------|
| GET | `/regions` | List all wine regions |
| GET | `/regions/{id}` | Get single region |

### Wineries

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wineries` | List all wineries |
| GET | `/wineries?region_id=1` | Filter by region |
| GET | `/wineries/{id}` | Get single winery |

### Wine Records

| Method | Path | Description |
|--------|------|-------------|
| GET | `/wines` | List all wine records (newest first) |
| GET | `/wines/{id}` | Get single wine record |
| POST | `/wines` | Create a new wine record |
| PUT | `/wines/{id}` | Update a wine record |
| DELETE | `/wines/{id}` | Delete a wine record |

### Images

| Method | Path | Description |
|--------|------|-------------|
| POST | `/images/upload` | Upload a wine label photo |
| GET | `/images/{filename}` | Serve a stored image |
| PATCH | `/images/attach/{wine_id}` | Attach uploaded photo to a wine record |

---

## Example Requests

### Create a wine record

```bash
curl -X POST http://192.168.x.x:8000/wines \
  -H "Content-Type: application/json" \
  -d '{
    "wine_name": "Château Margaux",
    "vintage": "2015",
    "winery_id": 1,
    "wine_type": "red",
    "grape_variety": "Cabernet Sauvignon blend",
    "tasting_date": "2026-04-15",
    "rating": 4.5,
    "notes": "Extraordinary depth and elegance. Cassis, cedar, violet. Very long finish."
  }'
```

When `winery_id` is provided and no `latitude`/`longitude` are given, the server
automatically copies the winery's coordinates into the wine record — so it appears
on the map immediately.

### Upload a photo, then attach it

```bash
# 1. Upload
curl -X POST http://192.168.x.x:8000/images/upload \
  -F "file=@/path/to/label.jpg"
# → { "photo_path": "storage/images/abc123.jpg", "photo_url": "http://192.168.x.x:8000/images/abc123.jpg" }

# 2. Attach to wine record id=7
curl -X PATCH "http://192.168.x.x:8000/images/attach/7?photo_path=storage/images/abc123.jpg"
```

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app + startup
│   ├── database.py          # SQLAlchemy engine, session, Base
│   ├── models/
│   │   ├── region.py
│   │   ├── winery.py
│   │   └── wine_record.py
│   ├── schemas/
│   │   ├── region.py
│   │   ├── winery.py
│   │   └── wine_record.py
│   ├── routers/
│   │   ├── regions.py
│   │   ├── wineries.py
│   │   ├── wines.py
│   │   └── images.py
│   └── services/
│       └── coordinate_service.py
├── data/
│   ├── regions_seed.json    # 5 starter regions
│   └── wineries_seed.json   # 14 famous wineries
├── scripts/
│   ├── init_db.py
│   ├── import_regions.py
│   └── import_wineries.py
├── storage/
│   └── images/              # uploaded wine label photos
├── wine_atlas.db            # created on first run
└── requirements.txt
```

---

## TODO (future upgrades)

- **Multi-user support** — add `users` table, JWT authentication, per-user records
- **Cloud sync** — migrate SQLite to PostgreSQL + deploy on Railway / Render / Fly.io
- **Admin panel** — simple web UI for managing seed data
- **OCR wine label scanning** — integrate Google Vision / Apple Vision to auto-fill wine fields from a photo
- **Analytics dashboard** — tasting statistics, favourite regions, rating trends
- **Full-text search** — SQLite FTS5 or PostgreSQL `pg_trgm` for fast wine search
- **Offline-first mobile** — cache API responses on device, sync when online
