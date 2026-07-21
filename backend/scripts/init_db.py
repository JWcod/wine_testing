#!/usr/bin/env python3
"""
Initialize the SQLite database by creating all tables.
Safe to run multiple times — existing tables are never dropped.

Usage:
    cd backend/
    python scripts/init_db.py
"""
import sys
from pathlib import Path

# Make sure 'backend/' is on the path so we can import 'app'
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.database import init_db, DB_PATH

if __name__ == "__main__":
    print(f"Initialising database at: {DB_PATH}")
    init_db()
    print("✅  All tables created (or already exist).")
