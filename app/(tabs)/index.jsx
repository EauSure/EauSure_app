import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { useRouter } from 'expo-router';
import CustomModal from '../../components/CustomModal';

export default function ScanPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [scannedData, setScannedData] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    setModalVisible(true);
  };

  if (hasPermission === null) return <View style={styles.center}><Text>Demande permission...</Text></View>;
  if (hasPermission === false) return <View style={styles.center}><Text>Accès caméra refusé.</Text></View>;

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanTarget}>
          <Text style={styles.scanText}>Scannez le QR Code de la bouée</Text>
        </View>
      </View>

      <CustomModal 
        visible={modalVisible}
        title="Bouée détectée"
        message={`ID: ${scannedData}\nSouhaitez-vous l'ajouter ?`}
        type="info"
        onClose={() => router.replace('/')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  scanTarget: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 20, borderRadius: 20 },
  scanText: { fontWeight: 'bold', color: '#1E293B' }
});