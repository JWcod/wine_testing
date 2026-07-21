import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useWineStore } from '../../store/wineStore';
import WineCard from '../../components/WineCard';
import { Colors } from '../../constants/colors';
import { WineType } from '../../types';

const FILTERS: { label: string; value: WineType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Red', value: 'red' },
  { label: 'White', value: 'white' },
  { label: 'Sparkling', value: 'sparkling' },
  { label: 'Rosé', value: 'rose' },
];

export default function MyWinesScreen() {
  const db = useSQLiteContext();
  const { wines, loadWines } = useWineStore();
  const insets = useSafeAreaInsets();

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<WineType | 'all'>('all');

  useEffect(() => {
    loadWines(db);
  }, []);

  const filtered = wines.filter((w) => {
    const matchesType = filter === 'all' || w.type === filter;
    const q = search.toLowerCase();
    const matchesSearch =
      q === '' ||
      w.name.toLowerCase().includes(q) ||
      w.winery.toLowerCase().includes(q) ||
      w.region.toLowerCase().includes(q) ||
      w.country.toLowerCase().includes(q) ||
      w.grapeVariety.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search wines, wineries, regions…"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Type filter pills */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[styles.pill, filter === f.value && styles.pillActive]}
            onPress={() => setFilter(f.value)}
          >
            <Text
              style={[styles.pillText, filter === f.value && styles.pillTextActive]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Count */}
      <Text style={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'wine' : 'wines'}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <WineCard wine={item} />}
        contentContainerStyle={{ paddingBottom: 24 }}
        ListEmptyComponent={<EmptyState hasWines={wines.length > 0} />}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-wine')}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

function EmptyState({ hasWines }: { hasWines: boolean }) {
  return (
    <View style={styles.empty}>
      <Ionicons name="wine-outline" size={56} color={Colors.border} />
      <Text style={styles.emptyTitle}>
        {hasWines ? 'No matches' : 'No wines yet'}
      </Text>
      <Text style={styles.emptyText}>
        {hasWines
          ? 'Try adjusting your search or filter.'
          : 'Tap the + button to add your first wine.'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  pillTextActive: {
    color: Colors.white,
  },
  count: {
    fontSize: 12,
    color: Colors.textMuted,
    marginHorizontal: 20,
    marginBottom: 6,
    fontWeight: '500',
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 6,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
