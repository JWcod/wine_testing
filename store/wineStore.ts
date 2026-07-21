import { create } from 'zustand';
import { SQLiteDatabase } from 'expo-sqlite';
import { WineRecord, WineType } from '../types';
import { insertWine, fetchAllWines, deleteWineById, generateId } from '../db/database';
import { inferCoordinates } from '../utils/locationUtils';

export interface NewWineInput {
  name: string;
  vintage: string;
  winery: string;
  region: string;
  country: string;
  type: WineType;
  grapeVariety: string;
  tastingDate: string;
  photoUri?: string;
  rating?: number;
  notes?: string;
}

interface WineState {
  wines: WineRecord[];
  isLoading: boolean;
  error: string | null;

  loadWines: (db: SQLiteDatabase) => Promise<void>;
  addWine: (db: SQLiteDatabase, input: NewWineInput) => Promise<WineRecord>;
  removeWine: (db: SQLiteDatabase, id: string) => Promise<void>;
  getWineById: (id: string) => WineRecord | undefined;
}

export const useWineStore = create<WineState>((set, get) => ({
  wines: [],
  isLoading: false,
  error: null,

  loadWines: async (db) => {
    set({ isLoading: true, error: null });
    try {
      const wines = await fetchAllWines(db);
      set({ wines, isLoading: false });
    } catch (e) {
      set({ error: String(e), isLoading: false });
    }
  },

  addWine: async (db, input) => {
    const coords = inferCoordinates(input.region, input.winery);
    const now = new Date().toISOString();

    const wine: WineRecord = {
      id: generateId(),
      ...input,
      latitude: coords?.latitude,
      longitude: coords?.longitude,
      createdAt: now,
    };

    await insertWine(db, wine);
    set((state) => ({ wines: [wine, ...state.wines] }));
    return wine;
  },

  removeWine: async (db, id) => {
    await deleteWineById(db, id);
    set((state) => ({ wines: state.wines.filter((w) => w.id !== id) }));
  },

  getWineById: (id) => {
    return get().wines.find((w) => w.id === id);
  },
}));
