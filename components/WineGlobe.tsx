import React, { useRef, useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, PanResponder } from 'react-native';
import Svg, {
  Path,
  Circle,
  Text as SvgText,
  Defs,
  ClipPath,
  RadialGradient,
  Stop,
  Rect,
} from 'react-native-svg';
import { Colors } from '../constants/colors';
import { LAND_RINGS } from '../data/landRings';

interface WineRegionPin {
  id: string;
  name: string;
  lat: number;
  lon: number;
  color: string;
}

// Real coordinates for every flagship region already written up in data/regions.ts —
// same rigor as the 2D country maps, just projected onto a sphere instead of a plane.
const REGIONS: WineRegionPin[] = [
  { id: 'bordeaux', name: 'Bordeaux', lat: 44.84, lon: -0.58, color: Colors.primary },
  { id: 'burgundy', name: 'Burgundy', lat: 47.05, lon: 4.83, color: '#A0533E' },
  { id: 'champagne', name: 'Champagne', lat: 49.05, lon: 3.96, color: Colors.gold },
  { id: 'alsace', name: 'Alsace', lat: 48.20, lon: 7.35, color: '#D9B88F' },
  { id: 'loire-valley', name: 'Loire Valley', lat: 47.39, lon: 0.68, color: '#8A9A6B' },
  { id: 'rhone-valley', name: 'Rhône Valley', lat: 44.93, lon: 4.89, color: '#B54B3A' },
  { id: 'napa-valley', name: 'Napa Valley', lat: 38.50, lon: -122.40, color: Colors.primary },
  { id: 'sonoma', name: 'Sonoma', lat: 38.45, lon: -122.70, color: '#8A9A6B' },
  { id: 'willamette-valley', name: 'Willamette Valley', lat: 45.20, lon: -123.05, color: '#A0533E' },
  { id: 'piedmont', name: 'Piedmont', lat: 44.70, lon: 7.90, color: '#B86251' },
  { id: 'trentino-alto-adige', name: 'Trentino-Alto Adige', lat: 46.50, lon: 11.35, color: '#B89E51' },
  { id: 'veneto', name: 'Veneto', lat: 45.55, lon: 11.90, color: '#A6B851' },
  { id: 'friuli-venezia-giulia', name: 'Friuli-Venezia Giulia', lat: 46.00, lon: 13.40, color: '#8FAF6E' },
  { id: 'tuscany', name: 'Tuscany', lat: 43.47, lon: 11.38, color: Colors.primary },
  { id: 'umbria', name: 'Umbria', lat: 42.90, lon: 12.60, color: '#95B851' },
  { id: 'campania', name: 'Campania', lat: 40.85, lon: 14.50, color: '#B85162' },
  { id: 'puglia', name: 'Puglia', lat: 40.80, lon: 17.00, color: '#B85184' },
  { id: 'sicily', name: 'Sicily', lat: 37.50, lon: 14.00, color: '#B8A651' },
  { id: 'sardinia', name: 'Sardinia', lat: 40.10, lon: 9.10, color: '#84B851' },
  { id: 'rioja', name: 'Rioja', lat: 42.46, lon: -2.45, color: '#B54B3A' },
  { id: 'ribera-del-duero', name: 'Ribera del Duero', lat: 41.66, lon: -3.69, color: Colors.primary },
  { id: 'priorat', name: 'Priorat', lat: 41.15, lon: 0.82, color: Colors.gold },
  { id: 'douro', name: 'Douro Valley', lat: 41.16, lon: -7.79, color: '#B54B3A' },
  { id: 'mosel', name: 'Mosel', lat: 49.95, lon: 7.00, color: '#8FAF6E' },
  { id: 'mendoza', name: 'Mendoza', lat: -32.89, lon: -68.85, color: Colors.primary },
  { id: 'stellenbosch', name: 'Stellenbosch', lat: -33.93, lon: 18.86, color: '#B89E51' },
  { id: 'barossa-valley', name: 'Barossa Valley', lat: -34.53, lon: 138.95, color: Colors.primary },
  { id: 'marlborough', name: 'Marlborough', lat: -41.51, lon: 173.95, color: Colors.primary },
];

const SIZE = 340;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 150;
const DEG = Math.PI / 180;

// Meridians/parallels for a subtle cartographic grid, same illustrated
// convention as the country maps' graticule cues.
const GRATICULE_LATS = [-60, -30, 0, 30, 60];
const GRATICULE_LONS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];

function project(lon: number, lat: number, lon0: number, lat0: number) {
  const λ = lon * DEG, φ = lat * DEG, λ0 = lon0 * DEG, φ0 = lat0 * DEG;
  const cosc = Math.sin(φ0) * Math.sin(φ) + Math.cos(φ0) * Math.cos(φ) * Math.cos(λ - λ0);
  const x = CX + R * Math.cos(φ) * Math.sin(λ - λ0);
  const y = CY - R * (Math.cos(φ0) * Math.sin(φ) - Math.sin(φ0) * Math.cos(φ) * Math.cos(λ - λ0));
  return { x, y, visible: cosc > 0.01 };
}

// Splits a lon/lat polyline into visible screen-space runs (so shapes that dip
// below the horizon don't draw a spurious line straight across the globe).
function projectRunsPath(points: [number, number][], lon0: number, lat0: number, closed: boolean): string[] {
  const runs: string[] = [];
  let current: string[] = [];
  const flush = () => {
    if (current.length >= 2) {
      runs.push('M' + current.join('L') + (closed && current.length > 2 ? 'Z' : ''));
    }
    current = [];
  };
  for (const [lon, lat] of points) {
    const p = project(lon, lat, lon0, lat0);
    if (p.visible) {
      current.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    } else {
      flush();
    }
  }
  flush();
  return runs;
}

interface Props {
  onSelectRegion: (regionId: string) => void;
}

export default function WineGlobe({ onSelectRegion }: Props) {
  const [center, setCenter] = useState({ lon0: 10, lat0: 18 });
  const dragStart = useRef({ lon0: 10, lat0: 18 });
  const isDragging = useRef(false);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dx) > 2 || Math.abs(g.dy) > 2,
      onPanResponderGrant: () => {
        isDragging.current = false;
        dragStart.current = { ...center };
      },
      onPanResponderMove: (_, g) => {
        isDragging.current = true;
        const nextLon0 = dragStart.current.lon0 + g.dx * 0.35;
        const nextLat0 = Math.max(-80, Math.min(80, dragStart.current.lat0 - g.dy * 0.35));
        setCenter({ lon0: nextLon0, lat0: nextLat0 });
      },
      onPanResponderRelease: (evt) => {
        if (!isDragging.current) {
          const { locationX, locationY } = evt.nativeEvent;
          handleTap(locationX, locationY);
        }
      },
    })
  ).current;

  const handleTap = useCallback((x: number, y: number) => {
    let closest: { id: string; dist: number } | null = null;
    for (const region of REGIONS) {
      const p = project(region.lon, region.lat, center.lon0, center.lat0);
      if (!p.visible) continue;
      const dist = Math.hypot(p.x - x, p.y - y);
      if (dist < 14 && (!closest || dist < closest.dist)) {
        closest = { id: region.id, dist };
      }
    }
    if (closest) onSelectRegion(closest.id);
  }, [center, onSelectRegion]);

  const landPaths = useMemo(() => {
    const paths: string[] = [];
    for (const ring of LAND_RINGS) {
      paths.push(...projectRunsPath(ring, center.lon0, center.lat0, true));
    }
    return paths;
  }, [center]);

  const graticulePaths = useMemo(() => {
    const paths: string[] = [];
    for (const lat of GRATICULE_LATS) {
      const pts: [number, number][] = [];
      for (let lon = -180; lon <= 180; lon += 4) pts.push([lon, lat]);
      paths.push(...projectRunsPath(pts, center.lon0, center.lat0, false));
    }
    for (const lon of GRATICULE_LONS) {
      const pts: [number, number][] = [];
      for (let lat = -90; lat <= 90; lat += 4) pts.push([lon, lat]);
      paths.push(...projectRunsPath(pts, center.lon0, center.lat0, false));
    }
    return paths;
  }, [center]);

  const visibleMarkers = useMemo(() => {
    return REGIONS.map(region => ({
      region,
      p: project(region.lon, region.lat, center.lon0, center.lat0),
    })).filter(m => m.p.visible);
  }, [center]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Svg width="100%" height="100%" viewBox={`0 0 ${SIZE} ${SIZE}`} preserveAspectRatio="xMidYMid meet">
        <Defs>
          <ClipPath id="globeClip">
            <Circle cx={CX} cy={CY} r={R} />
          </ClipPath>
          <RadialGradient id="sphereShade" cx="38%" cy="32%" r="75%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity={0.35} />
            <Stop offset="55%" stopColor="#FFFFFF" stopOpacity={0} />
            <Stop offset="100%" stopColor={Colors.text} stopOpacity={0.22} />
          </RadialGradient>
        </Defs>

        <Rect x={0} y={0} width={SIZE} height={SIZE} fill={Colors.cream} />

        {/* Ocean */}
        <Circle cx={CX} cy={CY} r={R} fill={Colors.cream} stroke={Colors.textMuted} strokeWidth={1.5} />

        {/* Graticule */}
        {graticulePaths.map((d, i) => (
          <Path key={`grat-${i}`} d={d} fill="none" stroke={Colors.textMuted} strokeWidth={0.5} strokeOpacity={0.35} clipPath="url(#globeClip)" />
        ))}

        {/* Land */}
        {landPaths.map((d, i) => (
          <Path key={`land-${i}`} d={d} fill={Colors.parchment} stroke={Colors.textMuted} strokeWidth={0.8} strokeLinejoin="round" clipPath="url(#globeClip)" />
        ))}

        {/* Region markers */}
        {visibleMarkers.map(({ region, p }) => (
          <Circle
            key={region.id}
            cx={p.x}
            cy={p.y}
            r={5}
            fill={region.color}
            stroke={Colors.cream}
            strokeWidth={1.2}
            clipPath="url(#globeClip)"
          />
        ))}

        {/* Sphere shading for volume */}
        <Circle cx={CX} cy={CY} r={R} fill="url(#sphereShade)" pointerEvents="none" />

        {/* Crisp horizon rim */}
        <Circle cx={CX} cy={CY} r={R} fill="none" stroke={Colors.text} strokeWidth={1.5} strokeOpacity={0.35} pointerEvents="none" />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
