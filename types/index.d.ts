export interface Obstacle {
  id: string;
  titre: string;
  description: string;
  photo?: string;
  latitude?: number;
  longitude?: number;
  dateCreation: string;
}

export interface Contact {
  id: string;
  nom: string;
  telephone: string;
  fonction: string;
}

export interface Location {
  latitude: number;
  longitude: number;
}
