"""Pydantic schemas for wine regions."""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field


class RegionCreate(BaseModel):
    name: str = Field(..., max_length=120)
    country: str = Field(..., max_length=80)
    latitude: float
    longitude: float
    description: Optional[str] = None
    history: Optional[str] = None
    climate: Optional[str] = None
    soil: Optional[str] = None
    characteristics: Optional[list[str]] = None
    famous_grapes: Optional[list[str]] = None


class RegionRead(BaseModel):
    id: int
    name: str
    country: str
    latitude: float
    longitude: float
    description: Optional[str] = None
    history: Optional[str] = None
    climate: Optional[str] = None
    soil: Optional[str] = None
    characteristics: list[str] = []
    famous_grapes: list[str] = []
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
