import { Contact } from '@/types';

/**
 * Service for managing useful contacts
 */
export class ContactService {
  /**
   * Get all useful contacts (fixed list)
   */
  static getContacts(): Contact[] {
    return [
      {
        id: '1',
        nom: 'Urgences',
        telephone: '15',
        fonction: 'SAMU',
      },
      {
        id: '2',
        nom: 'Police/Gendarmerie',
        telephone: '17',
        fonction: 'Secours',
      },
      {
        id: '3',
        nom: 'Pompiers',
        telephone: '18',
        fonction: 'Incendie/Secours',
      },
      {
        id: '4',
        nom: 'Dispatcher Transport',
        telephone: '03 87 XX XX XX',
        fonction: 'Coordination',
      },
      {
        id: '5',
        nom: 'Chef d\'équipe',
        telephone: '06 XX XX XX XX',
        fonction: 'Supervision',
      },
      {
        id: '6',
        nom: 'SNCF Info Trafic',
        telephone: '3635',
        fonction: 'Info ferroviaire',
      },
    ];
  }
}
