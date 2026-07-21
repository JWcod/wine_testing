"""SQLAlchemy model for personal wine tasting records."""
from datetime import datetime
from typing import Optional

from sqlalchemy import String, Text, Float, Integer, DateTime, ForeignKey, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class WineRecord(Base):
    __tablename__ = "wine_records"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    wine_name: Mapped[str] = mapped_column(String(200), nullable=False, index=True)
    vintage: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)

    winery_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("wineries.id", ondelete="SET NULL"), nullable=True, index=True
    )
    region_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("regions.id", ondelete="SET NULL"), nullable=True, index=True
    )
    country: Mapped[Optional[str]] = mapped_column(String(80), nullable=True)
    wine_type: Mapped[str] = mapped_column(
        String(20), nullable=False, default="red"
    )  # red | white | sparkling | rose
    grape_variety: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    tasting_date: Mapped[Optional[str]] = mapped_column(String(12), nullable=True)  # ISO date string
    rating: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    photo_path: Mapped[Optional[str]] = mapped_column(String(400), nullable=True)

    latitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    longitude: Mapped[Optional[float]] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    winery: Mapped[Optional["Winery"]] = relationship("Winery", lazy="select")  # noqa: F821
    region: Mapped[Optional["Region"]] = relationship("Region", lazy="select")  # noqa: F821
