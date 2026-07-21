"""
Coordinate resolution service.

When creating a wine record without explicit lat/lng, we try to inherit
coordinates from the linked winery, then from the linked region.
"""
from sqlalchemy.orm import Session

from app.models.winery import Winery
from app.models.region import Region


def resolve_coordinates(
    db: Session,
    *,
    latitude: float | None,
    longitude: float | None,
    winery_id: int | None,
    region_id: int | None,
) -> tuple[float | None, float | None]:
    """
    Returns (latitude, longitude) for a wine record.

    Priority:
      1. Explicit coords from the request (kept as-is)
      2. Winery coords (if winery_id is given)
      3. Region coords (if region_id is given)
      4. None, None
    """
    if latitude is not None and longitude is not None:
        return latitude, longitude

    if winery_id is not None:
        winery = db.get(Winery, winery_id)
        if winery and winery.latitude is not None and winery.longitude is not None:
            return winery.latitude, winery.longitude

    if region_id is not None:
        region = db.get(Region, region_id)
        if region:
            return region.latitude, region.longitude

    return None, None
