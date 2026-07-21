"""SQLAlchemy model for wine regions."""
import json
from datetime import datetime, timezone
from typing import Optional

from sqlalchemy import String, Text, Float, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Region(Base):
    __tablename__ = "regions"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(120), nullable=False, unique=True, index=True)
    country: Mapped[str] = mapped_column(String(80), nullable=False)
    latitude: Mapped[float] = mapped_column(Float, nullable=False)
    longitude: Mapped[float] = mapped_column(Float, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    history: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    climate: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    soil: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # Stored as JSON strings in SQLite (e.g. '["Tannic","Full-bodied"]')
    # TODO: migrate to a proper join table if multi-user or complex queries are needed
    characteristics: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    famous_grapes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=func.now(), onupdate=func.now(), nullable=False
    )

    # --- helpers ---
    def get_characteristics(self) -> list[str]:
        return json.loads(self.characteristics) if self.characteristics else []

    def get_famous_grapes(self) -> list[str]:
        return json.loads(self.famous_grapes) if self.famous_grapes else []
