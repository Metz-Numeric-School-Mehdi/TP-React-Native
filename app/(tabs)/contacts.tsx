import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ContactService } from '@/services/contactService';
import { Contact } from '@/types';
import React from 'react';
import {
    Alert,
    FlatList,
    Linking,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ContactsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const contacts = ContactService.getContacts();

  /**
   * Handle phone call
   */
  const handleCall = (contact: Contact) => {
    Alert.alert(
      'Appeler',
      `Voulez-vous appeler ${contact.nom} au ${contact.telephone} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Appeler',
          onPress: () => {
            Linking.openURL(`tel:${contact.telephone}`);
          },
        },
      ]
    );
  };

  /**
   * Render contact item
   */
  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactCard, { backgroundColor: colors.background, borderColor: '#e0e0e0' }]}
      onPress={() => handleCall(item)}
    >
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: colors.text }]}>{item.nom}</Text>
        <Text style={[styles.contactFunction, { color: colors.tabIconDefault }]}>{item.fonction}</Text>
        <Text style={[styles.contactPhone, { color: colors.tint }]}>{item.telephone}</Text>
      </View>
      <View style={[styles.callButton]}>
        <Text style={styles.callButtonText}>📞</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Contacts utiles</Text>
      </View>

      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactFunction: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 16,
    fontWeight: '600',
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
});
