export type WineType = 'red' | 'white' | 'sparkling' | 'rose';

export interface WineRecord {
  id: string;
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
  latitude?: number;
  longitude?: number;
  createdAt: string;
}

export interface WineRegion {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  history: string;
  characteristics: string[];
  famousGrapes: string[];
  famousWineries?: string[];
}

export interface Winery {
  id: string;
  name: string;
  region: string;
  country: string;
  latitude: number;
  longitude: number;
  description: string;
  history: string;
  specialties: string[];
  website?: string;
}

export type MapMarkerType = 'region' | 'winery' | 'userWine';
