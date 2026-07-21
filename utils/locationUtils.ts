import { wineRegions } from '../data/regions';
import { famousWineries } from '../data/wineries';

interface Coords {
  latitude: number;
  longitude: number;
}

/**
 * Given a region name and/or winery name, attempt to infer lat/lng by
 * matching against mock data.  Adds a tiny random offset so multiple wines
 * from the same region don't perfectly overlap on the map.
 */
export function inferCoordinates(
  regionName: string,
  wineryName: string,
): Coords | null {
  const normWinery = wineryName.toLowerCase().trim();
  const normRegion = regionName.toLowerCase().trim();

  if (normWinery.length > 2) {
    const matchedWinery = famousWineries.find((w) => {
      const n = w.name.toLowerCase();
      return n.includes(normWinery) || normWinery.includes(n);
    });
    if (matchedWinery) return jitter({ latitude: matchedWinery.latitude, longitude: matchedWinery.longitude });
  }

  if (normRegion.length > 2) {
    const matchedRegion = wineRegions.find((r) => {
      const n = r.name.toLowerCase();
      return n.includes(normRegion) || normRegion.includes(n);
    });
    if (matchedRegion) return jitter({ latitude: matchedRegion.latitude, longitude: matchedRegion.longitude });
  }

  return null;
}

/** Add a small random offset (±0.15°) so markers don't stack perfectly. */
function jitter(coords: Coords): Coords {
  return {
    latitude: coords.latitude + (Math.random() - 0.5) * 0.3,
    longitude: coords.longitude + (Math.random() - 0.5) * 0.3,
  };
}
