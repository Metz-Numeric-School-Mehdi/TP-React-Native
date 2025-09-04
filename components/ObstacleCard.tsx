import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Obstacle } from '@/types';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ObstacleCardProps {
  obstacle: Obstacle;
  onDelete: (obstacle: Obstacle) => void;
}

/**
 * Card component for displaying obstacle information
 */
export const ObstacleCard: React.FC<ObstacleCardProps> = ({ obstacle, onDelete }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: colors.background, borderColor: '#e0e0e0' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>{obstacle.titre}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => onDelete(obstacle)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.description, { color: colors.text }]}>{obstacle.description}</Text>
      
      {obstacle.photo && (
        <Image source={{ uri: obstacle.photo }} style={styles.image} />
      )}
      
      {(obstacle.latitude && obstacle.longitude) && (
        <Text style={[styles.locationText, { color: colors.tabIconDefault }]}>
          📍 {obstacle.latitude.toFixed(6)}, {obstacle.longitude.toFixed(6)}
        </Text>
      )}
      
      <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
        Créé le: {new Date(obstacle.dateCreation).toLocaleString('fr-FR')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationText: {
    fontSize: 12,
    marginBottom: 4,
  },
  dateText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
