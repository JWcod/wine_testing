"""
SQLite database connection and session management.
SQLAlchemy 2.0 style — uses mapped_column / Mapped throughout.
"""
from pathlib import Path
from sqlalchemy import create_engine, event
from sqlalchemy.orm import DeclarativeBase, sessionmaker

# SQLite file lives next to this package inside backend/
DB_PATH = Path(__file__).resolve().parent.parent / "wine_atlas.db"
DATABASE_URL = f"sqlite:///{DB_PATH}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False},  # required for SQLite + FastAPI threads
    echo=False,  # set True to log all SQL statements while debugging
)

# Enable WAL mode for better concurrent read performance
@event.listens_for(engine, "connect")
def set_wal_mode(dbapi_connection, _):
    dbapi_connection.execute("PRAGMA journal_mode=WAL")
    dbapi_connection.execute("PRAGMA foreign_keys=ON")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def get_db():
    """FastAPI dependency — yields a DB session and closes it when done."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Create all tables. Safe to call multiple times (no-op if tables exist)."""
    # Import models so SQLAlchemy registers them before creating tables.
    import app.models  # noqa: F401
    Base.metadata.create_all(bind=engine)
