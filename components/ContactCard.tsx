import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Contact } from '@/types';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ContactCardProps {
  contact: Contact;
  onCall: (contact: Contact) => void;
}

/**
 * Card component for displaying contact information
 */
export const ContactCard: React.FC<ContactCardProps> = ({ contact, onCall }) => {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.background, borderColor: '#e0e0e0' }]}
      onPress={() => onCall(contact)}
    >
      <View style={styles.info}>
        <Text style={[styles.name, { color: colors.text }]}>{contact.nom}</Text>
        <Text style={[styles.function, { color: colors.tabIconDefault }]}>{contact.fonction}</Text>
        <Text style={[styles.phone, { color: colors.tint }]}>{contact.telephone}</Text>
      </View>
      <View style={[styles.callButton, { backgroundColor: colors.tint }]}>
        <Text style={styles.callButtonText}>📞</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  function: {
    fontSize: 14,
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    fontWeight: '600',
  },
  callButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonText: {
    fontSize: 20,
  },
});
