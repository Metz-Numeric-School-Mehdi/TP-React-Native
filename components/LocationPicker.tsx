import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MapSelector from './MapSelector';

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (latitude: number | undefined, longitude: number | undefined) => void;
}

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
}: LocationPickerProps) {
  const [showMapSelector, setShowMapSelector] = useState(false);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  /**
   * Handle location selection from map
   */
  const handleLocationSelect = (lat: number, lng: number) => {
    onLocationChange(lat, lng);
  };

  /**
   * Clear location
   */
  const clearLocation = () => {
    onLocationChange(undefined, undefined);
  };

  return (
    <View style={styles.container}>
      {latitude && longitude ? (
        <View style={styles.locationContainer}>
          <View style={styles.locationInfo}>
            <Text style={[styles.locationTitle, { color: colors.text }]}>
              Position sélectionnée
            </Text>
            <Text style={[styles.coordinates, { color: colors.tabIconDefault }]}>
              📍 {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </Text>
          </View>
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.modifyButton, { borderColor: colors.tint }]}
              onPress={() => setShowMapSelector(true)}
            >
              <Text style={[styles.modifyButtonText, { color: colors.tint }]}>
                🗺️ Modifier
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.clearButton, { borderColor: '#ff4444' }]}
              onPress={clearLocation}
            >
              <Text style={[styles.clearButtonText, { color: '#ff4444' }]}>
                ✕ Supprimer
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={[styles.selectButton, { borderColor: colors.tint }]}
          onPress={() => setShowMapSelector(true)}
        >
          <Text style={[styles.selectButtonText, { color: colors.tint }]}>
            🗺️ Sélectionner sur la carte
          </Text>
        </TouchableOpacity>
      )}

      <MapSelector
        visible={showMapSelector}
        onClose={() => setShowMapSelector(false)}
        onLocationSelect={handleLocationSelect}
        initialLatitude={latitude}
        initialLongitude={longitude}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  locationContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  locationInfo: {
    marginBottom: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  coordinates: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  modifyButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  modifyButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  clearButton: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  selectButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
