/**
 * Service for data validation
 */
export class ValidationService {
  /**
   * Validate obstacle data
   */
  static validateObstacle(obstacle: {
    titre: string;
    description: string;
    latitude?: string;
    longitude?: string;
  }) {
    const errors: string[] = [];

    if (!obstacle.titre.trim()) {
      errors.push('Le titre est obligatoire');
    }

    if (obstacle.titre.trim().length < 3) {
      errors.push('Le titre doit contenir au moins 3 caractères');
    }

    if (obstacle.titre.trim().length > 100) {
      errors.push('Le titre ne peut pas dépasser 100 caractères');
    }

    if (!obstacle.description.trim()) {
      errors.push('La description est obligatoire');
    }

    if (obstacle.description.trim().length < 10) {
      errors.push('La description doit contenir au moins 10 caractères');
    }

    if (obstacle.description.trim().length > 500) {
      errors.push('La description ne peut pas dépasser 500 caractères');
    }

    if (obstacle.latitude && !this.isValidLatitude(obstacle.latitude)) {
      errors.push('La latitude doit être entre -90 et 90');
    }

    if (obstacle.longitude && !this.isValidLongitude(obstacle.longitude)) {
      errors.push('La longitude doit être entre -180 et 180');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Check if latitude is valid
   */
  static isValidLatitude(lat: string): boolean {
    const latitude = parseFloat(lat);
    return !isNaN(latitude) && latitude >= -90 && latitude <= 90;
  }

  /**
   * Check if longitude is valid
   */
  static isValidLongitude(lng: string): boolean {
    const longitude = parseFloat(lng);
    return !isNaN(longitude) && longitude >= -180 && longitude <= 180;
  }

  /**
   * Sanitize text input
   */
  static sanitizeText(text: string): string {
    return text.trim().replace(/\s+/g, ' ');
  }

  /**
   * Check if coordinates are valid
   */
  static isValidCoordinates(latitude?: string, longitude?: string): boolean {
    if (!latitude || !longitude) return true; // Coordinates are optional
    return this.isValidLatitude(latitude) && this.isValidLongitude(longitude);
  }
}
