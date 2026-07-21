import * as SQLite from 'expo-sqlite';
import { WineRecord } from '../types';

/**
 * Called by SQLiteProvider on first open to set up the schema.
 */
export async function initDatabase(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS wine_records (
      id           TEXT PRIMARY KEY NOT NULL,
      name         TEXT NOT NULL,
      vintage      TEXT NOT NULL DEFAULT '',
      winery       TEXT NOT NULL DEFAULT '',
      region       TEXT NOT NULL DEFAULT '',
      country      TEXT NOT NULL DEFAULT '',
      type         TEXT NOT NULL DEFAULT 'red',
      grape_variety TEXT NOT NULL DEFAULT '',
      tasting_date TEXT NOT NULL DEFAULT '',
      photo_uri    TEXT,
      rating       REAL,
      notes        TEXT,
      latitude     REAL,
      longitude    REAL,
      created_at   TEXT NOT NULL
    );
  `);
}

// ---------------------------------------------------------------------------
// CRUD helpers
// ---------------------------------------------------------------------------

export async function insertWine(
  db: SQLite.SQLiteDatabase,
  wine: WineRecord,
): Promise<void> {
  await db.runAsync(
    `INSERT INTO wine_records
       (id, name, vintage, winery, region, country, type, grape_variety,
        tasting_date, photo_uri, rating, notes, latitude, longitude, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      wine.id,
      wine.name,
      wine.vintage,
      wine.winery,
      wine.region,
      wine.country,
      wine.type,
      wine.grapeVariety,
      wine.tastingDate,
      wine.photoUri ?? null,
      wine.rating ?? null,
      wine.notes ?? null,
      wine.latitude ?? null,
      wine.longitude ?? null,
      wine.createdAt,
    ],
  );
}

export async function fetchAllWines(
  db: SQLite.SQLiteDatabase,
): Promise<WineRecord[]> {
  const rows = await db.getAllAsync<Record<string, unknown>>(
    'SELECT * FROM wine_records ORDER BY created_at DESC',
  );
  return rows.map(rowToWine);
}

export async function fetchWineById(
  db: SQLite.SQLiteDatabase,
  id: string,
): Promise<WineRecord | null> {
  const row = await db.getFirstAsync<Record<string, unknown>>(
    'SELECT * FROM wine_records WHERE id = ?',
    [id],
  );
  return row ? rowToWine(row) : null;
}

export async function deleteWineById(
  db: SQLite.SQLiteDatabase,
  id: string,
): Promise<void> {
  await db.runAsync('DELETE FROM wine_records WHERE id = ?', [id]);
}

// ---------------------------------------------------------------------------
// Row mapper
// ---------------------------------------------------------------------------

function rowToWine(row: Record<string, unknown>): WineRecord {
  return {
    id: row.id as string,
    name: row.name as string,
    vintage: row.vintage as string,
    winery: row.winery as string,
    region: row.region as string,
    country: row.country as string,
    type: row.type as WineRecord['type'],
    grapeVariety: row.grape_variety as string,
    tastingDate: row.tasting_date as string,
    photoUri: row.photo_uri ? (row.photo_uri as string) : undefined,
    rating: row.rating != null ? (row.rating as number) : undefined,
    notes: row.notes ? (row.notes as string) : undefined,
    latitude: row.latitude != null ? (row.latitude as number) : undefined,
    longitude: row.longitude != null ? (row.longitude as number) : undefined,
    createdAt: row.created_at as string,
  };
}

// ---------------------------------------------------------------------------
// Simple ID generator (no external dependency)
// ---------------------------------------------------------------------------

export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
