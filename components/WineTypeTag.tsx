import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WineType } from '../types';
import { Colors } from '../constants/colors';

interface Props {
  type: WineType;
  small?: boolean;
}

const labels: Record<WineType, string> = {
  red: 'Red',
  white: 'White',
  sparkling: 'Sparkling',
  rose: 'Rosé',
};

const bg: Record<WineType, string> = {
  red: Colors.redWine,
  white: Colors.whiteWine,
  sparkling: Colors.sparklingWine,
  rose: Colors.roseWine,
};

export default function WineTypeTag({ type, small = false }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: bg[type] }, small && styles.small]}>
      <Text style={[styles.label, small && styles.labelSmall]}>{labels[type]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  small: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  label: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  labelSmall: {
    fontSize: 10,
  },
});
