"""REST endpoints for wine regions."""
import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.region import Region
from app.schemas.region import RegionRead

router = APIRouter(prefix="/regions", tags=["regions"])


def _to_schema(region: Region) -> RegionRead:
    return RegionRead(
        id=region.id,
        name=region.name,
        country=region.country,
        latitude=region.latitude,
        longitude=region.longitude,
        description=region.description,
        history=region.history,
        climate=region.climate,
        soil=region.soil,
        characteristics=region.get_characteristics(),
        famous_grapes=region.get_famous_grapes(),
        created_at=region.created_at,
        updated_at=region.updated_at,
    )


@router.get("", response_model=list[RegionRead])
def list_regions(db: Session = Depends(get_db)):
    """Return all wine regions."""
    regions = db.query(Region).order_by(Region.name).all()
    return [_to_schema(r) for r in regions]


@router.get("/{region_id}", response_model=RegionRead)
def get_region(region_id: int, db: Session = Depends(get_db)):
    """Return a single region by ID."""
    region = db.get(Region, region_id)
    if not region:
        raise HTTPException(status_code=404, detail="Region not found")
    return _to_schema(region)
