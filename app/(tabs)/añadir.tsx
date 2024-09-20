import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddEmergencyScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');

  // Función para guardar el número de teléfono en el almacenamiento local
  const savePhoneNumber = async () => {
    if (phoneNumber.length >= 10) {
      try {
        await AsyncStorage.setItem('emergencyPhoneNumber', phoneNumber);
        Alert.alert('Número guardado', 'El número ha sido guardado correctamente');
      } catch (e) {
        Alert.alert('Error', 'No se pudo guardar el número');
      }
    } else {
      Alert.alert('Error', 'Ingresa un número de teléfono válido');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Ingresa el número de emergencia"
          keyboardType="phone-pad"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
        <Button title="Guardar número" onPress={savePhoneNumber} />
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
});
