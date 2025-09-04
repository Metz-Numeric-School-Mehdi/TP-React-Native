import { Obstacle } from '@/types';

/**
 * Utility functions for testing and development
 */
export class DevUtils {
  /**
   * Generate sample obstacles for testing
   */
  static generateSampleObstacles(): Obstacle[] {
    return [
      {
        id: 'sample-1',
        titre: 'Feu tricolore à démonter',
        description: 'Feu tricolore situé au carrefour de la rue principale. Nécessite l\'intervention des services municipaux pour démontage temporaire.',
        latitude: 49.1193089,
        longitude: 6.1757156,
        dateCreation: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      },
      {
        id: 'sample-2',
        titre: 'Passage à niveau SNCF',
        description: 'Coordination nécessaire avec la SNCF pour le passage du convoi exceptionnel. Prévoir un arrêt de 15 minutes minimum.',
        latitude: 49.1203089,
        longitude: 6.1767156,
        dateCreation: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      },
      {
        id: 'sample-3',
        titre: 'Pont à hauteur limitée',
        description: 'Pont avec limitation de hauteur à 4,5m. Vérifier les dimensions du chargement avant passage.',
        latitude: 49.1213089,
        longitude: 6.1777156,
        dateCreation: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
      },
    ];
  }

  /**
   * Check if we're in development mode
   */
  static isDevelopment(): boolean {
    return __DEV__;
  }
}
