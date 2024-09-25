import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Modal, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import QRCode from 'react-native-qrcode-svg';

const AboutScreen = () => {
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  // Datos de los integrantes
  const teamMembers = "Reifut y Becherman";
  const qrValue = JSON.stringify({ members: teamMembers });

  // Función para manejar el escaneo del QR
  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    // Verifica los datos escaneados
    console.log("Datos escaneados:", data);  // Imprime los datos escaneados

    try {
      const parsedData = JSON.parse(data);  // Intenta parsear el QR como JSON

      if (parsedData.members) {
        Alert.alert("Integrantes de la aplicación:", parsedData.members);
      } else {
        Alert.alert("Error", "El código QR no contiene información de los integrantes.");
      }
    } catch (error) {
      Alert.alert("Error", "Formato de QR no válido.");  // Si no es JSON válido
      console.error("Error al intentar parsear el código QR:", error);
    }
  };

  // Solicita permisos de cámara
  const requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
    if (status !== 'granted') {
      Alert.alert('Permiso de cámara requerido');
    }
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  // Muestra un mensaje si no tiene permisos de cámara
  if (hasPermission === null) {
    return <Text>Solicitando permisos de cámara...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No se han concedido permisos de cámara.</Text>;
  }

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
