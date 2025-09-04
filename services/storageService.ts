import { Obstacle } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OBSTACLES_KEY = 'obstacles';

/**
 * Service for managing obstacles in local storage
 */
export class StorageService {
  /**
   * Get all obstacles from storage
   */
  static async getObstacles(): Promise<Obstacle[]> {
    try {
      const obstaclesJson = await AsyncStorage.getItem(OBSTACLES_KEY);
      return obstaclesJson ? JSON.parse(obstaclesJson) : [];
    } catch (error) {
      console.error('Erreur lors de la récupération des obstacles:', error);
      return [];
    }
  }

  /**
   * Save obstacles to storage
   */
  static async saveObstacles(obstacles: Obstacle[]): Promise<void> {
    try {
      await AsyncStorage.setItem(OBSTACLES_KEY, JSON.stringify(obstacles));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des obstacles:', error);
    }
  }

  /**
   * Add a new obstacle
   */
  static async addObstacle(obstacle: Obstacle): Promise<void> {
    const obstacles = await this.getObstacles();
    obstacles.push(obstacle);
    await this.saveObstacles(obstacles);
  }

  /**
   * Remove an obstacle by ID
   */
  static async removeObstacle(id: string): Promise<void> {
    const obstacles = await this.getObstacles();
    const filteredObstacles = obstacles.filter(obstacle => obstacle.id !== id);
    await this.saveObstacles(filteredObstacles);
  }

  /**
   * Clear all obstacles
   */
  static async clearObstacles(): Promise<void> {
    try {
      await AsyncStorage.removeItem(OBSTACLES_KEY);
    } catch (error) {
      console.error('Erreur lors de la suppression des obstacles:', error);
    }
  }
}
