// File: app/scanner.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import { useRouter } from 'expo-router';
import {
  X,
  CheckCircle,
  AlertCircle,
  Wifi,
  Plus,
  RotateCcw,
} from 'lucide-react-native';
// import client from '../api/client'; // Uncomment if you have this file

// ─── Scan target corners ───
function ScanCorner({ style }) {
  return <View style={style} />;
}

function ScanFrame() {
  const size = 200;
  const thickness = 3;
  const radius = 24;
  const armLen = 32;
  const color = '#fff';

  return (
    <View style={{ width: size, height: size, position: 'relative' }}>
      <View style={[styles.corner, { top: 0, left: 0 }]}>
        <View style={[styles.cornerArm, styles.cornerArmH, { width: armLen, height: thickness, borderTopLeftRadius: radius, backgroundColor: color }]} />
        <View style={[styles.cornerArm, styles.cornerArmV, { width: thickness, height: armLen, borderTopLeftRadius: radius, backgroundColor: color }]} />
      </View>
      <View style={[styles.corner, { top: 0, right: 0 }]}>
        <View style={[styles.cornerArm, styles.cornerArmH, { width: armLen, height: thickness, borderTopRightRadius: radius, backgroundColor: color, alignSelf: 'flex-end' }]} />
        <View style={[styles.cornerArm, styles.cornerArmV, { width: thickness, height: armLen, borderTopRightRadius: radius, backgroundColor: color, alignSelf: 'flex-end' }]} />
      </View>
      <View style={[styles.corner, { bottom: 0, left: 0 }]}>
        <View style={[styles.cornerArm, styles.cornerArmV, { width: thickness, height: armLen, borderBottomLeftRadius: radius, backgroundColor: color }]} />
        <View style={[styles.cornerArm, styles.cornerArmH, { width: armLen, height: thickness, borderBottomLeftRadius: radius, backgroundColor: color }]} />
      </View>
      <View style={[styles.corner, { bottom: 0, right: 0 }]}>
        <View style={[styles.cornerArm, styles.cornerArmV, { width: thickness, height: armLen, borderBottomRightRadius: radius, backgroundColor: color, alignSelf: 'flex-end' }]} />
        <View style={[styles.cornerArm, styles.cornerArmH, { width: armLen, height: thickness, borderBottomRightRadius: radius, backgroundColor: color, alignSelf: 'flex-end' }]} />
      </View>
    </View>
  );
}

// ─── Result modal ───
function ResultModal({ visible, type, data, onClose, onAdd }) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalBackdrop}>
        <View style={styles.modalSheet}>
          {type === 'adding' && (
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#2563eb" />
              <Text style={styles.modalTitle}>Vérification...</Text>
              <Text style={styles.modalSub}>Connexion à la bouée via le serveur</Text>
            </View>
          )}

          {type === 'detected' && (
            <View style={styles.modalContent}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#eff6ff' }]}>
                <Wifi size={28} color="#2563eb" />
              </View>
              <Text style={styles.modalTitle}>Bouée détectée</Text>
              <Text style={styles.modalSub}>ID : {data?.id}</Text>
              <View style={styles.modalActions}>
                <Pressable style={styles.modalBtnSecondary} onPress={onClose}>
                  <Text style={styles.modalBtnSecondaryText}>Annuler</Text>
                </Pressable>
                <Pressable style={styles.modalBtnPrimary} onPress={onAdd}>
                  <Plus size={16} color="#fff" />
                  <Text style={styles.modalBtnPrimaryText}>Ajouter</Text>
                </Pressable>
              </View>
            </View>
          )}

          {type === 'success' && (
            <View style={styles.modalContent}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#f0fdf4' }]}>
                <CheckCircle size={32} color="#22c55e" />
              </View>
              <Text style={[styles.modalTitle, { color: '#22c55e' }]}>Bouée ajoutée !</Text>
              <Text style={styles.modalSub}>{data?.name} est désormais active</Text>
              <Pressable style={[styles.modalBtnPrimary, { marginTop: 16 }]} onPress={onClose}>
                <Text style={styles.modalBtnPrimaryText}>Retour au tableau</Text>
              </Pressable>
            </View>
          )}

          {type === 'error' && (
            <View style={styles.modalContent}>
              <View style={[styles.modalIconWrap, { backgroundColor: '#fef2f2' }]}>
                <AlertCircle size={32} color="#ef4444" />
              </View>
              <Text style={[styles.modalTitle, { color: '#ef4444' }]}>Erreur</Text>
              <Text style={styles.modalSub}>{data?.message || 'Impossible de connecter cette bouée.'}</Text>
              <Pressable style={[styles.modalBtnPrimary, { marginTop: 16, backgroundColor: '#ef4444' }]} onPress={onClose}>
                <Text style={styles.modalBtnPrimaryText}>Réessayer</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

export default function ScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [scannedData, setScannedData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = useCallback(({ data }) => {
    setScanned(true);
    setScannedData({ id: data, name: 'Bouée ' + data.slice(-4).toUpperCase() });
    setModalType('detected');
  }, []);

  const handleAdd = async () => {
    setModalType('adding');
    try {
      // Simulate API call
      await new Promise((r) => setTimeout(r, 1800));
      setModalType('success');
    } catch (e) {
      setModalType('error');
    }
  };

  const handleClose = () => {
    setModalType(null);
    if (modalType === 'success') {
      // Go back to the main tabs if successful
      router.dismissAll(); 
      router.replace('/'); 
    }
  };

  const handleReset = () => {
    setScanned(false);
    setScannedData(null);
    setModalType(null);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.permCenter}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.permCenter}>
        <AlertCircle size={48} color="#ef4444" />
        <Text style={[styles.permText, { color: '#ef4444', fontWeight: '600' }]}>Accès caméra refusé</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topBarBtn}>
          <X size={22} color="#fff" />
        </Pressable>
        <Text style={styles.topBarTitle}>Scanner une bouée</Text>
        <View style={{ width: 36 }} />
      </View>

      <View style={styles.centerArea}>
        <ScanFrame />
        <Text style={styles.scanHint}>
          {scanned ? 'Bouée détectée !' : 'Positionnez le QR Code\nde la bouée ici'}
        </Text>
      </View>

      {scanned && (
        <View style={styles.bottomArea}>
          <Pressable style={styles.resetBtn} onPress={handleReset}>
            <RotateCcw size={18} color="#fff" />
            <Text style={styles.resetBtnText}>Scanner une autre bouée</Text>
          </Pressable>
        </View>
      )}

      <ResultModal
        visible={!!modalType}
        type={modalType}
        data={scannedData}
        onClose={handleClose}
        onAdd={handleAdd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  gradientTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 140, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1 },
  gradientBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, backgroundColor: 'rgba(0,0,0,0.55)', zIndex: 1 },
  topBar: { position: 'absolute', top: 56, left: 0, right: 0, zIndex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 },
  topBarBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  topBarTitle: { fontSize: 16, fontWeight: '600', color: '#fff' },
  centerArea: { flex: 1, alignItems: 'center', justifyContent: 'center', zIndex: 2 },
  scanHint: { color: 'rgba(255,255,255,0.85)', fontSize: 14, textAlign: 'center', marginTop: 24, lineHeight: 20, fontWeight: '500' },
  corner: { position: 'absolute' },
  bottomArea: { position: 'absolute', bottom: 60, left: 0, right: 0, zIndex: 2, alignItems: 'center' },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30 },
  resetBtnText: { color: '#fff', fontSize: 14, fontWeight: '500' },
  permCenter: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', gap: 14, paddingHorizontal: 32 },
  permText: { fontSize: 15, color: '#0f172a', textAlign: 'center' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: '#fff', width: '100%', borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingBottom: 40, paddingTop: 12 },
  modalContent: { alignItems: 'center', paddingHorizontal: 32, paddingTop: 20, gap: 8 },
  modalIconWrap: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#0f172a' },
  modalSub: { fontSize: 14, color: '#64748b', textAlign: 'center' },
  modalActions: { flexDirection: 'row', gap: 10, marginTop: 20, width: '100%' },
  modalBtnSecondary: { flex: 1, paddingVertical: 13, borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  modalBtnSecondaryText: { fontSize: 15, fontWeight: '600', color: '#64748b' },
  modalBtnPrimary: { flex: 1, paddingVertical: 13, borderRadius: 14, backgroundColor: '#2563eb', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 },
  modalBtnPrimaryText: { fontSize: 15, fontWeight: '600', color: '#fff' },
});