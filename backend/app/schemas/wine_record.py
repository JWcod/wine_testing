"""Pydantic schemas for personal wine tasting records."""
from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, Field

WineType = Literal["red", "white", "sparkling", "rose"]


class WineRecordCreate(BaseModel):
    wine_name: str = Field(..., max_length=200)
    vintage: Optional[str] = Field(None, max_length=10)
    winery_id: Optional[int] = None
    region_id: Optional[int] = None
    country: Optional[str] = Field(None, max_length=80)
    wine_type: WineType = "red"
    grape_variety: Optional[str] = Field(None, max_length=200)
    tasting_date: Optional[str] = None  # YYYY-MM-DD
    rating: Optional[float] = Field(None, ge=0, le=5)
    notes: Optional[str] = None
    # latitude / longitude can be omitted — the service will fill them in
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class WineRecordUpdate(BaseModel):
    wine_name: Optional[str] = Field(None, max_length=200)
    vintage: Optional[str] = Field(None, max_length=10)
    winery_id: Optional[int] = None
    region_id: Optional[int] = None
    country: Optional[str] = Field(None, max_length=80)
    wine_type: Optional[WineType] = None
    grape_variety: Optional[str] = Field(None, max_length=200)
    tasting_date: Optional[str] = None
    rating: Optional[float] = Field(None, ge=0, le=5)
    notes: Optional[str] = None
    photo_path: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class WineRecordRead(BaseModel):
    id: int
    wine_name: str
    vintage: Optional[str] = None
    winery_id: Optional[int] = None
    region_id: Optional[int] = None
    country: Optional[str] = None
    wine_type: str
    grape_variety: Optional[str] = None
    tasting_date: Optional[str] = None
    rating: Optional[float] = None
    notes: Optional[str] = None
    photo_path: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
