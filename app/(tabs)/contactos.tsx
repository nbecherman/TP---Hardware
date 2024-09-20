import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as Contacts from 'expo-contacts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState<Contacts.Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [emergencyPhoneNumber, setEmergencyPhoneNumber] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmergencyNumber = async () => {
      try {
        const savedNumber = await AsyncStorage.getItem('emergencyPhoneNumber');
        setEmergencyPhoneNumber(savedNumber);
      } catch (e) {
        Alert.alert('Error', 'No se pudo recuperar el número de emergencia');
      }
    };

    const fetchContacts = async () => {
      const { status } = await Contacts.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permisos requeridos', 'Necesitas permitir el acceso a tus contactos.');
        setLoading(false);
        return;
      }

      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
      });

      if (data.length > 0) {
        const sortedContacts = data
          .filter(contact => contact.name && contact.phoneNumbers)
          .sort((a, b) => a.name.localeCompare(b.name));
          
        setContacts(sortedContacts);
      }
      setLoading(false);
    };

    fetchEmergencyNumber();
    fetchContacts();
  }, []);

  const renderItem = ({ item }: { item: Contacts.Contact }) => {
    const isEmergencyContact = item.phoneNumbers?.some(phone => phone.number === emergencyPhoneNumber) ?? false;

    return (
      <View style={styles.contactItem}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{item.name}</Text>
          <Text style={styles.contactPhone}>{item.phoneNumbers?.[0]?.number || 'Sin número'}</Text>
        </View>
        {isEmergencyContact && (
          <Ionicons name="alert-circle" size={24} color="red" style={styles.emergencyIcon} />
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()} // Generar clave única
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contactItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactPhone: {
    fontSize: 16,
    color: '#555',
  },
  emergencyIcon: {
    alignSelf: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
