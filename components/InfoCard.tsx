import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  title: string;
  value: string;
  icon?: React.ReactNode;
}

/** Single key-value row used in detail/info screens. */
export function InfoRow({ title, value, icon }: Props) {
  return (
    <View style={styles.row}>
      {icon && <View style={styles.iconWrap}>{icon}</View>}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
    </View>
  );
}

interface SectionProps {
  heading: string;
  children: React.ReactNode;
}

/** Section wrapper for grouped info. */
export function InfoSection({ heading, children }: SectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.heading}>{heading}</Text>
      {children}
    </View>
  );
}

interface TagListProps {
  items: string[];
  color?: string;
}

/** Horizontal list of pill tags. */
export function TagList({ items, color = Colors.primaryLight }: TagListProps) {
  return (
    <View style={styles.tagList}>
      {items.map((item) => (
        <View key={item} style={[styles.tag, { borderColor: color }]}>
          <Text style={[styles.tagText, { color }]}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  iconWrap: {
    marginRight: 10,
    marginTop: 1,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  section: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 10,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
});
