"""SQLAlchemy model for wineries."""
import json
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Float, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class Winery(Base):
    __tablename__ = "wineries"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    region_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("regions.id", ondelete="SET NULL"), nullable=True, index=True
    )
    country: Mapped[str] = mapped_column(String(80), nullable=False)
    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    history: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    # Stored as JSON string: '["Cabernet Sauvignon","Merlot"]'
    specialties: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    official_website: Mapped[Optional[str]] = mapped_column(String(300), nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    region: Mapped[Optional["Region"]] = relationship("Region", lazy="select")  # noqa: F821

    def get_specialties(self) -> list[str]:
        return json.loads(self.specialties) if self.specialties else []
