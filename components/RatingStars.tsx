import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/colors';

interface Props {
  rating: number;           // 0–5, supports 0.5 steps visually
  maxStars?: number;
  size?: number;
  editable?: boolean;
  onRate?: (rating: number) => void;
}

export default function RatingStars({
  rating,
  maxStars = 5,
  size = 20,
  editable = false,
  onRate,
}: Props) {
  const stars = Array.from({ length: maxStars }, (_, i) => {
    const full = rating >= i + 1;
    const half = !full && rating >= i + 0.5;
    return { index: i, full, half };
  });

  return (
    <View style={styles.row}>
      {stars.map(({ index, full, half }) => {
        const iconName = full ? 'star' : half ? 'star-half' : 'star-outline';
        const color = full || half ? Colors.gold : Colors.border;

        if (editable) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => onRate?.(index + 1)}
              hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            >
              <Ionicons name={iconName as any} size={size} color={color} />
            </TouchableOpacity>
          );
        }
        return (
          <Ionicons key={index} name={iconName as any} size={size} color={color} />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
  },
});
