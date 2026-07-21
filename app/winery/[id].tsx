import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { famousWineries } from '../../data/wineries';
import { Colors } from '../../constants/colors';
import { InfoRow, InfoSection, TagList } from '../../components/InfoCard';

export default function WineryInfoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const winery = famousWineries.find((w) => w.id === id);

  if (!winery) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>Winery not found.</Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: winery.name }} />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Hero banner */}
        <View style={styles.hero}>
          <Ionicons name="wine" size={48} color="rgba(255,255,255,0.8)" />
          <Text style={styles.heroTitle}>{winery.name}</Text>
          <Text style={styles.heroSub}>
            {winery.region} · {winery.country}
          </Text>
        </View>

        <View style={styles.body}>
          {/* Description */}
          <InfoSection heading="About">
            <Text style={styles.description}>{winery.description}</Text>
          </InfoSection>

          {/* History */}
          <InfoSection heading="History">
            <Text style={styles.description}>{winery.history}</Text>
          </InfoSection>

          {/* Specialties */}
          <InfoSection heading="Signature Wines & Specialties">
            <TagList items={winery.specialties} color={Colors.goldDark} />
          </InfoSection>

          {/* Location info */}
          <InfoSection heading="Location">
            <InfoRow title="Region" value={winery.region} />
            <InfoRow title="Country" value={winery.country} />
            <InfoRow
              title="Coordinates"
              value={`${winery.latitude.toFixed(4)}°, ${winery.longitude.toFixed(4)}°`}
            />
          </InfoSection>

          {/* Website */}
          {winery.website ? (
            <TouchableOpacity
              style={styles.websiteBtn}
              onPress={() => Linking.openURL(winery.website!)}
              activeOpacity={0.8}
            >
              <Ionicons name="globe-outline" size={18} color={Colors.white} />
              <Text style={styles.websiteBtnText}>Visit Official Website</Text>
            </TouchableOpacity>
          ) : null}
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
    backgroundColor: Colors.goldDark,
    paddingVertical: 36,
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 8,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
    textAlign: 'center',
  },
  heroSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
    textAlign: 'center',
  },
  body: { padding: 16 },
  description: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 22,
  },
  websiteBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  websiteBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.white,
  },
});
