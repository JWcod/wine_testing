import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface LegendItem {
  color: string;
  label: string;
  active: boolean;
  onToggle: () => void;
}

interface Props {
  showRegions: boolean;
  showWineries: boolean;
  showUserWines: boolean;
  onToggleRegions: () => void;
  onToggleWineries: () => void;
  onToggleUserWines: () => void;
}

export default function MapLegend({
  showRegions,
  showWineries,
  showUserWines,
  onToggleRegions,
  onToggleWineries,
  onToggleUserWines,
}: Props) {
  const items: LegendItem[] = [
    { color: Colors.regionMarker, label: 'Regions', active: showRegions, onToggle: onToggleRegions },
    { color: Colors.wineryMarker, label: 'Wineries', active: showWineries, onToggle: onToggleWineries },
    { color: Colors.userWineMarker, label: 'My Wines', active: showUserWines, onToggle: onToggleUserWines },
  ];

  return (
    <View style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.label}
          style={[styles.item, !item.active && styles.inactive]}
          onPress={item.onToggle}
          activeOpacity={0.7}
        >
          <View style={[styles.dot, { backgroundColor: item.active ? item.color : Colors.border }]} />
          <Text style={[styles.label, !item.active && styles.labelInactive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 10,
  },
  inactive: {
    opacity: 0.5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  labelInactive: {
    color: Colors.textMuted,
  },
});
