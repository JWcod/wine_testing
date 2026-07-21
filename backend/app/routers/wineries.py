"""REST endpoints for wineries."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.winery import Winery
from app.schemas.winery import WineryRead

router = APIRouter(prefix="/wineries", tags=["wineries"])


def _to_schema(w: Winery) -> WineryRead:
    return WineryRead(
        id=w.id,
        name=w.name,
        region_id=w.region_id,
        country=w.country,
        latitude=w.latitude,
        longitude=w.longitude,
        description=w.description,
        history=w.history,
        specialties=w.get_specialties(),
        official_website=w.official_website,
        created_at=w.created_at,
        updated_at=w.updated_at,
    )


@router.get("", response_model=list[WineryRead])
def list_wineries(
    region_id: int | None = None,
    db: Session = Depends(get_db),
):
    """Return all wineries, optionally filtered by region_id."""
    q = db.query(Winery)
    if region_id is not None:
        q = q.filter(Winery.region_id == region_id)
    return [_to_schema(w) for w in q.order_by(Winery.name).all()]


@router.get("/{winery_id}", response_model=WineryRead)
def get_winery(winery_id: int, db: Session = Depends(get_db)):
    """Return a single winery by ID."""
    winery = db.get(Winery, winery_id)
    if not winery:
        raise HTTPException(status_code=404, detail="Winery not found")
    return _to_schema(winery)
