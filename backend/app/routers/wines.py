"""REST endpoints for personal wine tasting records."""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.wine_record import WineRecord
from app.schemas.wine_record import WineRecordCreate, WineRecordUpdate, WineRecordRead
from app.services.coordinate_service import resolve_coordinates

router = APIRouter(prefix="/wines", tags=["wines"])


@router.get("", response_model=list[WineRecordRead])
def list_wines(db: Session = Depends(get_db)):
    """Return all wine records, newest first."""
    return db.query(WineRecord).order_by(WineRecord.created_at.desc()).all()


@router.get("/{wine_id}", response_model=WineRecordRead)
def get_wine(wine_id: int, db: Session = Depends(get_db)):
    """Return a single wine record by ID."""
    wine = db.get(WineRecord, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Wine record not found")
    return wine


@router.post("", response_model=WineRecordRead, status_code=201)
def create_wine(payload: WineRecordCreate, db: Session = Depends(get_db)):
    """
    Create a new wine record.
    Coordinates are resolved automatically when winery_id or region_id is provided
    and explicit lat/lng are not supplied.
    """
    lat, lng = resolve_coordinates(
        db,
        latitude=payload.latitude,
        longitude=payload.longitude,
        winery_id=payload.winery_id,
        region_id=payload.region_id,
    )

    wine = WineRecord(
        wine_name=payload.wine_name,
        vintage=payload.vintage,
        winery_id=payload.winery_id,
        region_id=payload.region_id,
        country=payload.country,
        wine_type=payload.wine_type,
        grape_variety=payload.grape_variety,
        tasting_date=payload.tasting_date,
        rating=payload.rating,
        notes=payload.notes,
        latitude=lat,
        longitude=lng,
    )
    db.add(wine)
    db.commit()
    db.refresh(wine)
    return wine


@router.put("/{wine_id}", response_model=WineRecordRead)
def update_wine(wine_id: int, payload: WineRecordUpdate, db: Session = Depends(get_db)):
    """Update an existing wine record. Only supplied fields are changed."""
    wine = db.get(WineRecord, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Wine record not found")

    update_data = payload.model_dump(exclude_unset=True)

    # Re-resolve coordinates if winery/region changed and no explicit coords given
    if ("winery_id" in update_data or "region_id" in update_data) and \
       "latitude" not in update_data and "longitude" not in update_data:
        winery_id = update_data.get("winery_id", wine.winery_id)
        region_id = update_data.get("region_id", wine.region_id)
        lat, lng = resolve_coordinates(
            db,
            latitude=None,
            longitude=None,
            winery_id=winery_id,
            region_id=region_id,
        )
        if lat is not None:
            update_data["latitude"] = lat
            update_data["longitude"] = lng

    for field, value in update_data.items():
        setattr(wine, field, value)

    db.commit()
    db.refresh(wine)
    return wine


@router.delete("/{wine_id}", status_code=204)
def delete_wine(wine_id: int, db: Session = Depends(get_db)):
    """Delete a wine record by ID."""
    wine = db.get(WineRecord, wine_id)
    if not wine:
        raise HTTPException(status_code=404, detail="Wine record not found")
    db.delete(wine)
    db.commit()
