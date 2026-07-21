import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useWineStore } from '../../store/wineStore';
import { WineRecord } from '../../types';
import { Colors } from '../../constants/colors';
import WineTypeTag from '../../components/WineTypeTag';
import RatingStars from '../../components/RatingStars';
import { InfoRow, InfoSection } from '../../components/InfoCard';

export default function WineDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const db = useSQLiteContext();
  const { getWineById, removeWine, loadWines } = useWineStore();
  const [wine, setWine] = useState<WineRecord | undefined>(getWineById(id));

  // Ensure store is populated if navigated directly
  useEffect(() => {
    if (!wine) {
      loadWines(db).then(() => setWine(getWineById(id)));
    }
  }, [id]);

  if (!wine) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Wine not found.</Text>
      </View>
    );
  }

  function confirmDelete() {
    Alert.alert('Delete Wine', `Remove "${wine!.name}" from your collection?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await removeWine(db, wine!.id);
          router.back();
        },
      },
    ]);
  }

  const addedDate = new Date(wine.createdAt).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: wine.name,
          headerRight: () => (
            <TouchableOpacity onPress={confirmDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="trash-outline" size={22} color={Colors.white} />
            </TouchableOpacity>
          ),
        }}
      />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero / photo */}
        {wine.photoUri ? (
          <Image source={{ uri: wine.photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="wine" size={64} color={Colors.primaryLight} />
          </View>
        )}

        <View style={styles.body}>
          {/* Title block */}
          <View style={styles.titleBlock}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{wine.name}</Text>
              <WineTypeTag type={wine.type} />
            </View>
            {wine.vintage ? (
              <Text style={styles.vintage}>{wine.vintage}</Text>
            ) : null}
            {wine.rating != null && (
              <View style={styles.ratingRow}>
                <RatingStars rating={wine.rating} size={22} />
                <Text style={styles.ratingLabel}>{wine.rating} / 5</Text>
              </View>
            )}
          </View>

          {/* Core info */}
          <InfoSection heading="Details">
            {wine.winery ? <InfoRow title="Winery" value={wine.winery} /> : null}
            {wine.region ? <InfoRow title="Region" value={wine.region} /> : null}
            {wine.country ? <InfoRow title="Country" value={wine.country} /> : null}
            {wine.grapeVariety ? <InfoRow title="Grape Variety" value={wine.grapeVariety} /> : null}
            {wine.tastingDate ? <InfoRow title="Tasting Date" value={formatDate(wine.tastingDate)} /> : null}
            <InfoRow title="Added" value={addedDate} />
          </InfoSection>

          {/* Notes */}
          {wine.notes ? (
            <InfoSection heading="Tasting Notes">
              <Text style={styles.notes}>{wine.notes}</Text>
            </InfoSection>
          ) : null}

          {/* Location */}
          {wine.latitude && wine.longitude ? (
            <InfoSection heading="Location">
              <InfoRow title="Coordinates" value={`${wine.latitude.toFixed(4)}, ${wine.longitude.toFixed(4)}`} />
              <TouchableOpacity
                style={styles.mapBtn}
                onPress={() => router.push('/(tabs)/map')}
              >
                <Ionicons name="map" size={16} color={Colors.primary} />
                <Text style={styles.mapBtnText}>View on Map</Text>
              </TouchableOpacity>
            </InfoSection>
          ) : null}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 16, color: Colors.textMuted },
  photo: { width: '100%', height: 260 },
  photoPlaceholder: {
    height: 200,
    backgroundColor: Colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 16 },
  titleBlock: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    gap: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
  },
  vintage: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ratingLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  notes: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 10,
  },
  mapBtnText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
});
