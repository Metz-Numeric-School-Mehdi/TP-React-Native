import { StorageService } from '@/services/storageService';
import { Obstacle } from '@/types';
import { useEffect, useState } from 'react';

/**
 * Hook for managing obstacles state
 */
export const useObstacles = () => {
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [loading, setLoading] = useState(true);

  /**
   * Load obstacles from storage
   */
  const loadObstacles = async () => {
    try {
      setLoading(true);
      const storedObstacles = await StorageService.getObstacles();
      setObstacles(storedObstacles);
    } catch (error) {
      console.error('Erreur lors du chargement des obstacles:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Add a new obstacle
   */
  const addObstacle = async (obstacle: Obstacle) => {
    try {
      await StorageService.addObstacle(obstacle);
      await loadObstacles();
    } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'obstacle:', error);
      throw error;
    }
  };

  /**
   * Remove an obstacle
   */
  const removeObstacle = async (id: string) => {
    try {
      await StorageService.removeObstacle(id);
      await loadObstacles();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'obstacle:', error);
      throw error;
    }
  };

  /**
   * Clear all obstacles
   */
  const clearAllObstacles = async () => {
    try {
      await StorageService.clearObstacles();
      await loadObstacles();
    } catch (error) {
      console.error('Erreur lors de la suppression de tous les obstacles:', error);
      throw error;
    }
  };

  useEffect(() => {
    loadObstacles();
  }, []);

  return {
    obstacles,
    loading,
    loadObstacles,
    addObstacle,
    removeObstacle,
    clearAllObstacles,
  };
};
