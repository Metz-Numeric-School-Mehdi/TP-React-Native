import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StorageService } from '@/services/storageService';
import { Obstacle } from '@/types';
import { DevUtils } from '@/utils/devUtils';
import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ObstaclesScreen() {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [loading, setLoading] = useState(true);
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  /**
   * Load obstacles from storage
   */
  const loadObstacles = async () => {
    try {
      const storedObstacles = await StorageService.getObstacles();
      setObstacles(storedObstacles);
    } catch (error) {
      console.error('Erreur lors du chargement des obstacles:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete an obstacle
   */
  const deleteObstacle = (obstacle: Obstacle) => {
    Alert.alert(
      'Supprimer l\'obstacle',
      `Êtes-vous sûr de vouloir supprimer "${obstacle.titre}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await StorageService.removeObstacle(obstacle.id);
            loadObstacles();
          },
        },
      ]
    );
  };

  /**
   * Add sample obstacles for testing (dev only)
   */
  const addSampleObstacles = async () => {
    try {
      const sampleObstacles = DevUtils.generateSampleObstacles();
      for (const obstacle of sampleObstacles) {
        await StorageService.addObstacle(obstacle);
      }
      loadObstacles();
      Alert.alert('Succès', 'Obstacles de test ajoutés');
    } catch (error) {
      console.error('Erreur lors de l\'ajout des obstacles de test:', error);
      Alert.alert('Erreur', 'Impossible d\'ajouter les obstacles de test');
    }
  };

  /**
   * Navigate to add obstacle screen
   */
  const navigateToAddObstacle = () => {
    router.push('/(tabs)/../add-obstacle' as any);
  };

  useFocusEffect(
    useCallback(() => {
      loadObstacles();
    }, [])
  );

  /**
   * Render obstacle item
   */
  const renderObstacle = ({ item }: { item: Obstacle }) => (
    <View style={[styles.obstacleCard, { backgroundColor: colors.background, borderColor: '#e0e0e0' }]}>
      <View style={styles.obstacleHeader}>
        <Text style={[styles.obstacleTitle, { color: colors.text }]}>{item.titre}</Text>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteObstacle(item)}
        >
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={[styles.obstacleDescription, { color: colors.text }]}>{item.description}</Text>
      
      {item.photo && (
        <Image source={{ uri: item.photo }} style={styles.obstacleImage} />
      )}
      
      {(item.latitude && item.longitude) && (
        <Text style={[styles.locationText, { color: colors.tabIconDefault }]}>
          📍 {item.latitude.toFixed(6)}, {item.longitude.toFixed(6)}
        </Text>
      )}
      
      <Text style={[styles.dateText, { color: colors.tabIconDefault }]}>
        Créé le: {new Date(item.dateCreation).toLocaleString('fr-FR')}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Obstacles du parcours</Text>
        <TouchableOpacity
          style={[styles.addButton]}
          onPress={navigateToAddObstacle}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {obstacles.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.tabIconDefault }]}>
            Aucun obstacle enregistré
          </Text>
          <Text style={[styles.emptySubtext, { color: colors.tabIconDefault }]}>
            {`Appuyez sur "Ajouter" pour créer votre premier obstacle`}
          </Text>
          {DevUtils.isDevelopment() && (
            <TouchableOpacity
              style={[styles.devButton, { backgroundColor: colors.tabIconDefault }]}
              onPress={addSampleObstacles}
            >
              <Text style={styles.devButtonText}>🔧 Ajouter obstacles de test</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={obstacles}
          renderItem={renderObstacle}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  addButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  obstacleCard: {
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
  obstacleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  obstacleTitle: {
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
  obstacleDescription: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 20,
  },
  obstacleImage: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 16,
  },
  devButton: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  devButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});
