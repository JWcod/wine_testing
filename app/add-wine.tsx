import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useWineStore } from '../store/wineStore';
import RatingStars from '../components/RatingStars';
import { Colors, wineTypeColor } from '../constants/colors';
import { WineType } from '../types';
import { inferCoordinates } from '../utils/locationUtils';

const WINE_TYPES: { label: string; value: WineType }[] = [
  { label: 'Red', value: 'red' },
  { label: 'White', value: 'white' },
  { label: 'Sparkling', value: 'sparkling' },
  { label: 'Rosé', value: 'rose' },
];

export default function AddWineScreen() {
  const db = useSQLiteContext();
  const { addWine } = useWineStore();

  const [name, setName] = useState('');
  const [vintage, setVintage] = useState('');
  const [winery, setWinery] = useState('');
  const [region, setRegion] = useState('');
  const [country, setCountry] = useState('');
  const [type, setType] = useState<WineType>('red');
  const [grapeVariety, setGrapeVariety] = useState('');
  const [tastingDate, setTastingDate] = useState(todayISO());
  const [photoUri, setPhotoUri] = useState<string | undefined>();
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [coordsMatched, setCoordsMatched] = useState<boolean | null>(null);

  useEffect(() => {
    if (!region.trim() && !winery.trim()) {
      setCoordsMatched(null);
      return;
    }
    const timer = setTimeout(() => {
      setCoordsMatched(inferCoordinates(region, winery) !== null);
    }, 300);
    return () => clearTimeout(timer);
  }, [region, winery]);

  async function pickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo library access in Settings.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!name.trim()) {
      Alert.alert('Required', 'Please enter a wine name.');
      return;
    }

    setSaving(true);
    try {
      await addWine(db, {
        name: name.trim(),
        vintage: vintage.trim(),
        winery: winery.trim(),
        region: region.trim(),
        country: country.trim(),
        type,
        grapeVariety: grapeVariety.trim(),
        tastingDate: tastingDate.trim(),
        photoUri,
        rating: rating > 0 ? rating : undefined,
        notes: notes.trim() || undefined,
      });
      router.back();
    } catch (e) {
      Alert.alert('Error', 'Failed to save wine. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Photo picker */}
        <TouchableOpacity style={styles.photoBox} onPress={pickPhoto} activeOpacity={0.8}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera" size={36} color={Colors.primaryLight} />
              <Text style={styles.photoHint}>Add wine label photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Wine Type selector */}
        <Text style={styles.label}>Wine Type</Text>
        <View style={styles.typeRow}>
          {WINE_TYPES.map((t) => (
            <TouchableOpacity
              key={t.value}
              style={[
                styles.typeBtn,
                type === t.value && { backgroundColor: wineTypeColor[t.value], borderColor: wineTypeColor[t.value] },
              ]}
              onPress={() => setType(t.value)}
            >
              <Text
                style={[styles.typeBtnText, type === t.value && styles.typeBtnTextActive]}
              >
                {t.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Text fields */}
        <Field label="Wine Name *" value={name} onChange={setName} placeholder="e.g. Château Margaux" />
        <Field label="Vintage" value={vintage} onChange={setVintage} placeholder="e.g. 2018" keyboardType="number-pad" />
        <Field label="Winery / Producer" value={winery} onChange={setWinery} placeholder="e.g. Château Margaux" />
        <Field label="Region" value={region} onChange={setRegion} placeholder="e.g. Bordeaux, Napa Valley" />
        {coordsMatched !== null && (
          <View style={[styles.coordsBadge, { backgroundColor: coordsMatched ? '#E8F5E9' : '#FFF3E0' }]}>
            <Ionicons
              name={coordsMatched ? 'location' : 'location-outline'}
              size={14}
              color={coordsMatched ? '#2E7D32' : '#E65100'}
            />
            <Text style={[styles.coordsBadgeText, { color: coordsMatched ? '#2E7D32' : '#E65100' }]}>
              {coordsMatched ? 'Region found — will appear on map' : 'Region not recognised — won\'t show on map'}
            </Text>
          </View>
        )}
        <Field label="Country" value={country} onChange={setCountry} placeholder="e.g. France" />
        <Field label="Grape Variety" value={grapeVariety} onChange={setGrapeVariety} placeholder="e.g. Cabernet Sauvignon, Merlot" />
        <Field
          label="Tasting Date"
          value={tastingDate}
          onChange={setTastingDate}
          placeholder="YYYY-MM-DD"
          // TODO: replace with a date picker component
        />

        {/* Rating */}
        <Text style={styles.label}>Rating</Text>
        <View style={styles.ratingRow}>
          <RatingStars rating={rating} editable size={32} onRate={setRating} />
          {rating > 0 && (
            <TouchableOpacity onPress={() => setRating(0)} style={styles.clearRating}>
              <Text style={styles.clearRatingText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notes */}
        <Text style={styles.label}>Tasting Notes</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={notes}
          onChangeText={setNotes}
          placeholder="Aromas, flavours, finish, food pairing…"
          placeholderTextColor={Colors.textMuted}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />


        {/* Save button */}
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.85}
        >
          <Ionicons name="checkmark-circle" size={20} color={Colors.white} />
          <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Wine'}</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  keyboardType = 'default',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'number-pad' | 'email-address';
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType}
        returnKeyType="next"
      />
    </>
  );
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: Colors.cream },
  content: { padding: 16 },
  photoBox: {
    height: 180,
    backgroundColor: Colors.parchment,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photo: { width: '100%', height: '100%' },
  photoPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  photoHint: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  typeBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  typeBtnTextActive: {
    color: Colors.white,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 15,
    color: Colors.text,
    marginBottom: 14,
  },
  textarea: {
    height: 100,
    paddingTop: 11,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  clearRating: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  clearRatingText: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
  },
  coordsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginBottom: 14,
  },
  coordsBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
