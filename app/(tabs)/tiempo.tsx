import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import * as Location from 'expo-location';

const WeatherScreen = () => {
  const [temperature, setTemperature] = useState<number | null>(null);
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null); // Cambia el tipo aquí

  useEffect(() => {
    const getLocationAndWeather = async () => {
      try {
        // Pedir permisos de ubicación
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permiso de ubicación denegado');
          setLoading(false);
          return;
        }

        // Obtener la ubicación actual
        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation.coords);

        // Obtener el clima actual
        const { latitude, longitude } = currentLocation.coords;
        const apiKey = 'TU_API_KEY'; // Reemplaza con tu clave de API
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        setTemperature(response.data.main.temp);
      } catch (error) {
        setError('Error al obtener datos');
      } finally {
        setLoading(false);
      }
    };

    getLocationAndWeather();
  }, []);

  const getCurrentDateTime = () => {
    return new Date().toLocaleString();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.dateTime}>{getCurrentDateTime()}</Text>
      <Text style={styles.location}>Ubicación: {location?.latitude}, {location?.longitude}</Text>
      <Text style={styles.temperature}>Temperatura: {temperature} °C</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dateTime: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 18,
    marginVertical: 8,
  },
  temperature: {
    fontSize: 18,
    color: 'blue',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    fontSize: 18,
    color: 'red',
  },
});

export default WeatherScreen;
