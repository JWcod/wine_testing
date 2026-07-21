"""
Wine Atlas — FastAPI backend entry point.

Run with:
    uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

Then open http://<your-mac-ip>:8000/docs for the interactive API docs.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import init_db
from app.routers import regions, wineries, wines, images

app = FastAPI(
    title="Wine Atlas API",
    description="Personal wine tasting journal — local backend for iPhone app",
    version="0.1.0",
)

# ---------------------------------------------------------------------------
# CORS — allow any origin during local Wi-Fi testing.
# TODO: lock this down to specific origins before any public deployment.
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Routers
# ---------------------------------------------------------------------------
app.include_router(regions.router)
app.include_router(wineries.router)
app.include_router(wines.router)
app.include_router(images.router)


# ---------------------------------------------------------------------------
# Startup
# ---------------------------------------------------------------------------
@app.on_event("startup")
def on_startup():
    """Create tables on first run (idempotent)."""
    init_db()


@app.get("/health", tags=["meta"])
def health_check():
    return {"status": "ok", "service": "Wine Atlas API"}
