"""Pydantic schemas for wineries."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class WineryCreate(BaseModel):
    name: str = Field(..., max_length=160)
    region_id: Optional[int] = None
    country: str = Field(..., max_length=80)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    history: Optional[str] = None
    specialties: Optional[list[str]] = None
    official_website: Optional[str] = None


class WineryRead(BaseModel):
    id: int
    name: str
    region_id: Optional[int] = None
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    description: Optional[str] = None
    history: Optional[str] = None
    specialties: list[str] = []
    official_website: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
