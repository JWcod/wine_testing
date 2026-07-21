import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { WineRecord } from '../types';
import { Colors } from '../constants/colors';
import WineTypeTag from './WineTypeTag';
import RatingStars from './RatingStars';

interface Props {
  wine: WineRecord;
}

export default function WineCard({ wine }: Props) {
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/wine/${wine.id}`)}
    >
      {/* Photo or placeholder */}
      <View style={styles.photoContainer}>
        {wine.photoUri ? (
          <Image source={{ uri: wine.photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="wine" size={32} color={Colors.primaryLight} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>
            {wine.name}
          </Text>
          <WineTypeTag type={wine.type} small />
        </View>

        <Text style={styles.sub}>
          {wine.vintage ? `${wine.vintage} · ` : ''}
          {wine.winery || wine.region}
        </Text>

        <Text style={styles.location} numberOfLines={1}>
          <Ionicons name="location-outline" size={12} color={Colors.textMuted} />{' '}
          {[wine.region, wine.country].filter(Boolean).join(', ')}
        </Text>

        {wine.grapeVariety ? (
          <Text style={styles.grape} numberOfLines={1}>
            {wine.grapeVariety}
          </Text>
        ) : null}

        <View style={styles.footer}>
          {wine.rating != null ? (
            <RatingStars rating={wine.rating} size={14} />
          ) : (
            <Text style={styles.noRating}>No rating</Text>
          )}
          <Text style={styles.date}>{formatDate(wine.tastingDate)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 3,
  },
  photoContainer: {
    width: 90,
  },
  photo: {
    width: 90,
    height: '100%',
  },
  photoPlaceholder: {
    width: 90,
    backgroundColor: Colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 110,
  },
  info: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  name: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  sub: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  location: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  grape: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  noRating: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  date: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
