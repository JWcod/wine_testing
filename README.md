# 🍷 Wine Atlas

A personal wine-tasting journal, built as an iPhone app with a self-hosted backend. Log every wine you taste, watch your personal tasting history take shape on a map of the world's wine regions, and build a searchable record of everything you've had.

## Features

- **Map view** — every wine region and winery you've logged a tasting from is plotted on an interactive map, turning your tasting history into a personal wine atlas.
- **Add a wine in seconds** — snap a photo of the label, pick a type (red / white / sparkling / rosé), rate it on a 5-star scale, and jot down tasting notes. Region and winery names are matched against a built-in dataset to auto-place the wine on the map.
- **My Wines** — a searchable, filterable list of every wine you've logged, searchable by name, winery, region, country, or grape variety.
- **Winery & region pages** — drill into any winery or region to see everything you've tasted from there.
- **Label photos** — attach a photo of the label to each tasting record.
- **Self-hosted backend** — a small FastAPI + SQLite server that runs on your own Mac; the iPhone app talks to it over your home Wi-Fi. Your tasting data stays on hardware you own, not a third-party cloud.

## Tech stack

**Mobile app**
- [Expo](https://expo.dev/) / React Native, file-based routing via `expo-router`
- [Zustand](https://github.com/pmndrs/zustand) for state management
- `expo-sqlite` for on-device caching
- `react-native-maps` for the map view

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/) + SQLAlchemy + SQLite
- Seed dataset of wine regions and wineries
- REST endpoints for regions, wineries, wine records, and label photo uploads
- Interactive API docs (Swagger UI) at `/docs`

## Getting started

### Backend

```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/init_db.py
python scripts/import_regions.py
python scripts/import_wineries.py
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

See [`backend/README.md`](backend/README.md) for the full API reference, example requests, and instructions for connecting an iPhone over Wi-Fi.

### Mobile app

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go on an iPhone on the same Wi-Fi network as the Mac running the backend.

## Project structure

```
.
├── app/                    # Expo Router screens
│   ├── (tabs)/                # map, my-wines
│   ├── add-wine.tsx
│   ├── wine/[id].tsx
│   ├── winery/[id].tsx
│   └── region/[id].tsx
├── components/               # WineCard, RatingStars, MapLegend, InfoCard, WineTypeTag
├── store/                      # Zustand store
├── backend/
│   ├── app/                      # FastAPI app, models, schemas, routers, services
│   ├── data/                       # Seed data (regions, wineries)
│   └── scripts/                     # DB init + seed import scripts
└── data/, db/                         # Local reference data + on-device SQLite helpers
```

## Roadmap

See [`backend/README.md`](backend/README.md#todo-future-upgrades) for the full list. Highlights: multi-user support with authentication, migrating from SQLite to a hosted Postgres database, OCR-based label scanning to auto-fill wine details from a photo, and a tasting-trends analytics dashboard.

## Privacy

This repository ships with seed/reference data only (wine regions and wineries). Personal tasting records are meant to stay local to each user's device/server.
