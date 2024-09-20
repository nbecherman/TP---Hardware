import { Image, StyleSheet, Platform, Alert, Linking } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useEffect, useState } from 'react';
import { Accelerometer } from 'expo-sensors'; // Importar acelerómetro para detectar sacudidas
import AsyncStorage from '@react-native-async-storage/async-storage'; // Almacenar número de emergencia

export default function HomeScreen() {
  const [emergencyNumber, setEmergencyNumber] = useState<string>(''); // Estado para almacenar el número de emergencia
  const [shakeDetected, setShakeDetected] = useState<boolean>(false); // Estado para detectar sacudidas

  // Usar el acelerómetro para detectar sacudidas
  useEffect(() => {
    const subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalForce = Math.sqrt(x * x + y * y + z * z);
      if (totalForce > 1.78) { // Umbral para considerar una sacudida
        setShakeDetected(true);
      }
    });

    // Guardar los datos del acelerómetro
    Accelerometer.setUpdateInterval(500);

    return () => subscription.remove();
  }, []);

  // Al detectar una sacudida, llamar a la función para enviar mensaje por WhatsApp
  useEffect(() => {
    if (shakeDetected) {
      handleShakeAction();
      setShakeDetected(false); // Reiniciar la detección de sacudidas
    }
  }, [shakeDetected]);

  // Función para manejar la acción de sacudida
  const handleShakeAction = async () => {
    const number = await AsyncStorage.getItem('emergencyPhoneNumber'); // Recuperar el número almacenado
    console.log('Número de emergencia recuperado:', number); // Verificar el número recuperado
    
    if (number) {
      sendEmergencyMessage(number);
    } else {
      Alert.alert('Número de emergencia no configurado.');
    }
  };

  // Función para enviar mensaje solo por WhatsApp
  const sendEmergencyMessage = async (number: string) => { 
    const message = '¡Alerta! Se ha detectado una sacudida y necesito ayuda.';
    const whatsappURL = `whatsapp://send?phone=${number}&text=${encodeURIComponent(message)}`;
    const supported = await Linking.canOpenURL(whatsappURL);
      await Linking.openURL(whatsappURL);
      Alert.alert('Mensaje de emergencia enviado por WhatsApp.');

  };

  // Almacenar un número de emergencia en AsyncStorage
  const storeEmergencyNumber = async (number: string) => {
    try {
      await AsyncStorage.setItem('emergencyNumber', number);
      setEmergencyNumber(number);
      Alert.alert('Número de emergencia almacenado correctamente.');
    } catch (error) {
      Alert.alert('Error al almacenar el número de emergencia.');
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Welcome!</ThemedText>
        <HelloWave />
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 1: Try it</ThemedText>
        <ThemedText>
          Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
          Press{' '}
          <ThemedText type="defaultSemiBold">
            {Platform.select({ ios: 'cmd + d', android: 'cmd + m' })}
          </ThemedText>{' '}
          to open developer tools.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 2: Explore</ThemedText>
        <ThemedText>
          Tap the Explore tab to learn more about what's included in this starter app.
        </ThemedText>
      </ThemedView>
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
        <ThemedText>
          When you're ready, run{' '}
          <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
          <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
          <ThemedText type="defaultSemiBold">app-example</ThemedText>.
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
