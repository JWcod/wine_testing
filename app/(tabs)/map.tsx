import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useWineStore } from '../../store/wineStore';
import { Colors, wineTypeColor } from '../../constants/colors';
import { WineRecord } from '../../types';
import FranceRegionMap from '../../components/FranceRegionMap';
import USWestCoastMap from '../../components/USWestCoastMap';
import ItalyRegionMap from '../../components/ItalyRegionMap';
import SpainRegionMap from '../../components/SpainRegionMap';
import PortugalRegionMap from '../../components/PortugalRegionMap';
import GermanyRegionMap from '../../components/GermanyRegionMap';
import ArgentinaRegionMap from '../../components/ArgentinaRegionMap';
import SouthAfricaRegionMap from '../../components/SouthAfricaRegionMap';
import AustraliaRegionMap from '../../components/AustraliaRegionMap';
import NewZealandRegionMap from '../../components/NewZealandRegionMap';
import WineGlobe from '../../components/WineGlobe';

type Country =
  | 'globe' | 'france' | 'usa' | 'italy' | 'spain'
  | 'portugal' | 'germany' | 'argentina' | 'south-africa' | 'australia' | 'new-zealand';

const COUNTRY_TABS: { id: Country; label: string }[] = [
  { id: 'globe', label: '🌐 World' },
  { id: 'france', label: 'France' },
  { id: 'usa', label: 'USA' },
  { id: 'italy', label: 'Italy' },
  { id: 'spain', label: 'Spain' },
  { id: 'portugal', label: 'Portugal' },
  { id: 'germany', label: 'Germany' },
  { id: 'argentina', label: 'Argentina' },
  { id: 'south-africa', label: 'South Africa' },
  { id: 'australia', label: 'Australia' },
  { id: 'new-zealand', label: 'New Zealand' },
];

export default function MapScreen() {
  const db = useSQLiteContext();
  const { wines, loadWines } = useWineStore();
  const insets = useSafeAreaInsets();
  const [country, setCountry] = useState<Country>('globe');

  useEffect(() => { loadWines(db); }, []);

  const regionsCount = useMemo(() => {
    const seen = new Set<string>();
    wines.forEach(w => { if (w.region) seen.add(w.region); });
    return seen.size;
  }, [wines]);

  const handleSelectRegion = (id: string) => router.push(`/region/${id}`);

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Illustrated wine-region map — real boundaries where available, coordinate-anchored approximations elsewhere */}
      {country === 'globe' && <WineGlobe onSelectRegion={handleSelectRegion} />}
      {country === 'france' && <FranceRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'usa' && <USWestCoastMap onSelectRegion={handleSelectRegion} />}
      {country === 'italy' && <ItalyRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'spain' && <SpainRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'portugal' && <PortugalRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'germany' && <GermanyRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'argentina' && <ArgentinaRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'south-africa' && <SouthAfricaRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'australia' && <AustraliaRegionMap onSelectRegion={handleSelectRegion} />}
      {country === 'new-zealand' && <NewZealandRegionMap onSelectRegion={handleSelectRegion} />}

      {/* Top: stats pill + country switch */}
      <View style={[styles.topOverlay, { paddingTop: insets.top + 8 }]}>
        <View style={styles.statsPill}>
          <Ionicons name="wine" size={12} color="#fff" />
          <Text style={styles.statsPillText}>
            {wines.length} wines logged · {regionsCount} regions tasted
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.countrySwitchScroll}
          contentContainerStyle={styles.countrySwitch}
        >
          {COUNTRY_TABS.map(tab => (
            <CountryTab
              key={tab.id}
              label={tab.label}
              active={country === tab.id}
              onPress={() => setCountry(tab.id)}
            />
          ))}
        </ScrollView>
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
              <WineChip key={wine.id} wine={wine} />
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

const CountryTab = React.memo(({
  label, active, onPress,
}: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    style={[styles.countryTab, active && styles.countryTabActive]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.countryTabText, active && styles.countryTabTextActive]}>{label}</Text>
  </TouchableOpacity>
));

const WineChip = React.memo(({ wine }: { wine: WineRecord }) => {
  const color = wineTypeColor[wine.type] ?? Colors.primary;

  return (
    <TouchableOpacity
      style={styles.wineChip}
      onPress={() => router.push(`/wine/${wine.id}`)}
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
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: { flex: 1 },

  topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 14, gap: 8 },
  statsPill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center',
    backgroundColor: 'rgba(20,10,10,0.70)', borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 7,
  },
  statsPillText: { fontSize: 12, color: '#fff', fontWeight: '600' },

  countrySwitchScroll: {
    alignSelf: 'center', maxWidth: '100%',
    backgroundColor: 'rgba(20,10,10,0.70)', borderRadius: 20,
  },
  countrySwitch: {
    flexDirection: 'row', gap: 4, padding: 3,
  },
  countryTab: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 16 },
  countryTabActive: { backgroundColor: Colors.gold },
  countryTabText: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.7)' },
  countryTabTextActive: { color: Colors.text },

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
