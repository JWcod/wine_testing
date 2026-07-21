import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { wineRegions } from '../../data/regions';
import { Colors } from '../../constants/colors';
import { InfoRow, InfoSection, TagList } from '../../components/InfoCard';

export default function RegionInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const region = wineRegions.find((r) => r.id === id);

  if (!region) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Region not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: region.name }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={styles.hero}>
          <Ionicons name="earth" size={48} color="rgba(255,255,255,0.8)" />
          <Text style={styles.heroTitle}>{region.name}</Text>
          <Text style={styles.heroSub}>{region.country}</Text>
        </View>

        <View style={styles.body}>
          {/* Description */}
          <InfoSection heading="Overview">
            <Text style={styles.description}>{region.description}</Text>
          </InfoSection>

          {/* History */}
          <InfoSection heading="History">
            <Text style={styles.description}>{region.history}</Text>
          </InfoSection>

          {/* Characteristics */}
          <InfoSection heading="Characteristics">
            {region.characteristics.map((c, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={styles.bullet} />
                <Text style={styles.bulletText}>{c}</Text>
              </View>
            ))}
          </InfoSection>

          {/* Famous grapes */}
          <InfoSection heading="Famous Grape Varieties">
            <TagList items={region.famousGrapes} color={Colors.primary} />
          </InfoSection>

          {/* Famous wineries */}
          {region.famousWineries && region.famousWineries.length > 0 && (
            <InfoSection heading="Notable Producers">
              <TagList items={region.famousWineries} color={Colors.goldDark} />
            </InfoSection>
          )}

          {/* Coordinates */}
          <InfoSection heading="Location">
            <InfoRow
              title="Coordinates"
              value={`${region.latitude.toFixed(4)}° N, ${region.longitude.toFixed(4)}° E`}
            />
            <InfoRow title="Country" value={region.country} />
          </InfoSection>
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFound: { fontSize: 16, color: Colors.textMuted },
  hero: {
    backgroundColor: Colors.primary,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
  },
  body: { padding: 16 },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginVertical: 4,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
});
