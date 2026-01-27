// app/scan.jsx
import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button, Alert } from 'react-native';
import { CameraView, Camera } from "expo-camera";
import { useRouter } from 'expo-router';
// import client from '../client';

export default function ScanPage() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    Alert.alert("Bouée détectée", `ID: ${data}`, [
      { text: "OK", onPress: () => {
          // Logique d'ajout ici (API Call)
          router.replace('/'); // Retour accueil
      }}
    ]);
  };

  if (hasPermission === null) return <Text className="text-center mt-20">Demande permission...</Text>;
  if (hasPermission === false) return <Text className="text-center mt-20">Accès caméra refusé.</Text>;

  return (
    <View className="flex-1 bg-black">
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View className="absolute bottom-20 w-full items-center">
        <View className="bg-white/90 p-4 rounded-xl">
            <Text className="font-bold">Scannez le QR Code de la bouée</Text>
        </View>
      </View>
      {scanned && <Button title={'Scanner à nouveau'} onPress={() => setScanned(false)} />}
    </View>
  );
}