import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';

const AboutScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scanData, setScanData] = useState('');

  // Datos de los integrantes
  const teamMembers = "Reifut y Becherman";
  const qrValue = JSON.stringify({ members: teamMembers });

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    // Procesar los datos escaneados
    try {
      const parsedData = JSON.parse(data);
      if (parsedData.members) {
        Alert.alert("Integrantes de la aplicación:", parsedData.members);
      } else {
        Alert.alert("Error", "No se pudo leer el código QR.");
      }
    } catch (error) {
      Alert.alert("Error", "Formato de QR no válido.");
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso de cámara requerido');
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Acerca de</Text>
      <View style={styles.qrCodeContainer}>
        <QRCode value={qrValue} size={200} />
      </View>
      <Button title="Escanear otra app" onPress={() => setModalVisible(true)} />

      {/* Modal para escanear QR */}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
          <Button title="Cerrar" onPress={() => {
            setModalVisible(false);
            setScanned(false); // Reiniciar escaneo al cerrar
          }} />
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  qrCodeContainer: {
    marginBottom: 20,
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AboutScreen;
