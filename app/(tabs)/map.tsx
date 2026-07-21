import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import MapView, { Marker, Callout, Region } from 'react-native-maps';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useWineStore } from '../../store/wineStore';
import { wineRegions } from '../../data/regions';
import { famousWineries } from '../../data/wineries';
import { Colors, wineTypeColor } from '../../constants/colors';
import { WineRecord } from '../../types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const INITIAL_REGION: Region = {
  latitude: 20,
  longitude: 10,
  latitudeDelta: 120,
  longitudeDelta: 160,
};

export default function MapScreen() {
  const db = useSQLiteContext();
  const { wines, loadWines } = useWineStore();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);

  const [showRegions, setShowRegions] = useState(true);
  const [showWineries, setShowWineries] = useState(true);
  const [showUserWines, setShowUserWines] = useState(true);
  const [activeWineId, setActiveWineId] = useState<string | null>(null);

  useEffect(() => { loadWines(db); }, []);

  const winesWithCoords = useMemo(
    () => wines.filter(w => w.latitude != null && w.longitude != null),
    [wines],
  );

  const countries = useMemo(() => {
    const seen = new Set<string>();
    wines.forEach(w => { if (w.country) seen.add(w.country); });
    return seen.size;
  }, [wines]);

  const regionsCount = useMemo(() => {
    const seen = new Set<string>();
    wines.forEach(w => { if (w.region) seen.add(w.region); });
    return seen.size;
  }, [wines]);

  const focusOnWine = useCallback((wine: WineRecord) => {
    if (wine.latitude == null || wine.longitude == null) return;
    setActiveWineId(wine.id);
    mapRef.current?.animateToRegion(
      { latitude: wine.latitude, longitude: wine.longitude, latitudeDelta: 4, longitudeDelta: 4 },
      600,
    );
  }, []);

  const toggleRegions = useCallback(() => setShowRegions(v => !v), []);
  const toggleWineries = useCallback(() => setShowWineries(v => !v), []);
  const toggleUserWines = useCallback(() => setShowUserWines(v => !v), []);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Full-screen map */}
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={INITIAL_REGION}
        showsCompass
        rotateEnabled
        pitchEnabled
      >
        {showRegions && wineRegions.map(region => (
          <Marker
            key={`region-${region.id}`}
            coordinate={{ latitude: region.latitude, longitude: region.longitude }}
            onCalloutPress={() => router.push(`/region/${region.id}`)}
          >
            <View style={[styles.pin, { backgroundColor: Colors.regionMarker }]}>
              <Text style={styles.pinEmoji}>🍇</Text>
            </View>
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{region.name}</Text>
                <Text style={styles.calloutSub}>{region.country}</Text>
                <Text style={styles.calloutHint}>Tap for details →</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {showWineries && famousWineries.map(winery => (
          <Marker
            key={`winery-${winery.id}`}
            coordinate={{ latitude: winery.latitude, longitude: winery.longitude }}
            onCalloutPress={() => router.push(`/winery/${winery.id}`)}
          >
            <View style={[styles.pin, { backgroundColor: Colors.wineryMarker }]}>
              <Text style={styles.pinEmoji}>🏰</Text>
            </View>
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{winery.name}</Text>
                <Text style={styles.calloutSub}>{winery.region}</Text>
                <Text style={styles.calloutHint}>Tap for details →</Text>
              </View>
            </Callout>
          </Marker>
        ))}

        {showUserWines && winesWithCoords.map(wine => (
          <Marker
            key={`wine-${wine.id}`}
            coordinate={{ latitude: wine.latitude!, longitude: wine.longitude! }}
            onCalloutPress={() => router.push(`/wine/${wine.id}`)}
          >
            <View style={[
              styles.pin,
              { backgroundColor: wineTypeColor[wine.type] ?? Colors.primary },
              activeWineId === wine.id && styles.pinActive,
            ]}>
              <Text style={styles.pinEmoji}>🍷</Text>
            </View>
            <Callout tooltip={false}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{wine.name}</Text>
                <Text style={styles.calloutSub}>{[wine.vintage, wine.winery].filter(Boolean).join(' · ')}</Text>
                <Text style={styles.calloutHint}>Tap for details →</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Top: stats + filter chips */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.statsPill}>
          <Ionicons name="wine" size={12} color="#fff" />
          <Text style={styles.statsPillText}>
            {wines.length} wines · {countries} countries · {regionsCount} regions
          </Text>
        </View>
        <View style={styles.filterRow}>
          <FilterChip label="Regions" emoji="🍇" active={showRegions} color={Colors.regionMarker} onPress={toggleRegions} />
          <FilterChip label="Wineries" emoji="🏰" active={showWineries} color={Colors.wineryMarker} onPress={toggleWineries} />
          <FilterChip label="My Wines" emoji="🍷" active={showUserWines} color={Colors.primary} onPress={toggleUserWines} />
        </View>
      </View>

      {/* FAB — add wine */}
      <TouchableOpacity
        style={[styles.fab, { bottom: 60 + insets.bottom + (wines.length > 0 ? 108 : 20) }]}
        onPress={() => router.push('/add-wine')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={30} color={Colors.white} />
      </TouchableOpacity>

      {/* Bottom: horizontal wine strip (only when there are wines) */}
      {wines.length > 0 && (
        <View style={[styles.stripWrapper, { bottom: 60 + insets.bottom }]}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.stripScroll}
          >
            {wines.map(wine => (
              <WineChip
                key={wine.id}
                wine={wine}
                active={activeWineId === wine.id}
                onPress={focusOnWine}
              />
            ))}
            <TouchableOpacity
              style={styles.seeAllChip}
              onPress={() => router.push('/(tabs)/my-wines')}
              activeOpacity={0.8}
            >
              <Text style={styles.seeAllText}>See all</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primary} />
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const FilterChip = React.memo(({
  label, emoji, active, color, onPress,
}: {
  label: string; emoji: string; active: boolean; color: string; onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.chip, active ? { backgroundColor: color } : styles.chipInactive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={styles.chipEmoji}>{emoji}</Text>
    <Text style={[styles.chipLabel, { color: active ? '#fff' : Colors.textSecondary }]}>{label}</Text>
  </TouchableOpacity>
));

const WineChip = React.memo(({
  wine, active, onPress,
}: {
  wine: WineRecord; active: boolean; onPress: (w: WineRecord) => void;
}) => {
  const color = wineTypeColor[wine.type] ?? Colors.primary;
  const hasCoords = wine.latitude != null && wine.longitude != null;

  return (
    <TouchableOpacity
      style={[styles.wineChip, active && styles.wineChipActive]}
      onPress={() => hasCoords ? onPress(wine) : router.push(`/wine/${wine.id}`)}
      activeOpacity={0.8}
    >
      <View style={[styles.wineChipBar, { backgroundColor: color }]} />
      <View style={styles.wineChipBody}>
        {wine.photoUri ? (
          <Image source={{ uri: wine.photoUri }} style={styles.wineChipPhoto} />
        ) : (
          <View style={[styles.wineChipIcon, { backgroundColor: color + '18' }]}>
            <Ionicons name="wine" size={18} color={color} />
          </View>
        )}
        <View style={styles.wineChipInfo}>
          <Text style={styles.wineChipName} numberOfLines={2}>{wine.name}</Text>
          {wine.vintage ? <Text style={styles.wineChipVintage}>{wine.vintage}</Text> : null}
          {hasCoords
            ? <Ionicons name="locate" size={11} color={Colors.primary} style={{ marginTop: 2 }} />
            : <Ionicons name="location-outline" size={11} color={Colors.border} style={{ marginTop: 2 }} />
          }
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  pin: {
    width: 38, height: 38, borderRadius: 19,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2.5, borderColor: '#fff',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3, shadowRadius: 4, elevation: 5,
  },
  pinActive: {
    width: 46, height: 46, borderRadius: 23, borderColor: Colors.gold, borderWidth: 3,
  },
  pinEmoji: { fontSize: 18 },

  callout: { minWidth: 140, maxWidth: 200, padding: 4 },
  calloutTitle: { fontWeight: '700', fontSize: 13, color: Colors.text, marginBottom: 2 },
  calloutSub: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  calloutHint: { fontSize: 10, color: Colors.primary, fontWeight: '600' },

  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 14, gap: 8 },
  statsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center',
    backgroundColor: 'rgba(20,10,10,0.70)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  statsPillText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  filterRow: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  chipInactive: { backgroundColor: 'rgba(255,255,255,0.88)' },
  chipEmoji: { fontSize: 14 },
  chipLabel: { fontSize: 12, fontWeight: '700' },

  fab: {
    position: 'absolute', right: 16,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },

  /* Wine strip */
  stripWrapper: {
    position: 'absolute', left: 0, right: 0,
    backgroundColor: 'transparent',
  },
  stripScroll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },

  wineChip: {
    width: 110,
    backgroundColor: Colors.white,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  wineChipActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  wineChipBar: { height: 3 },
  wineChipBody: { flexDirection: 'row', padding: 8, gap: 6, alignItems: 'flex-start' },
  wineChipPhoto: { width: 32, height: 32, borderRadius: 6 },
  wineChipIcon: { width: 32, height: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  wineChipInfo: { flex: 1 },
  wineChipName: { fontSize: 11, fontWeight: '700', color: Colors.text, lineHeight: 14 },
  wineChipVintage: { fontSize: 10, color: Colors.textMuted, marginTop: 1 },

  seeAllChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: Colors.white,
    paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
  },
  seeAllText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
});
