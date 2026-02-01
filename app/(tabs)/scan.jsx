import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { QrCode, ScanLine, Radio, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function ScanLandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ajouter une bouée</Text>
        <Text style={styles.subtitle}>
          Connectez une nouvelle bouée IoT à votre système de surveillance
        </Text>
      </View>

      <View style={styles.content}>
        {/* Main Icon Container */}
        <View style={styles.iconWrapper}>
          <LinearGradient
            colors={['#e0f2fe', '#dbeafe']}
            style={styles.iconContainer}
          >
            <View style={styles.iconInner}>
              <QrCode size={64} color="#0ea5e9" strokeWidth={2} />
              <View style={styles.scanLineWrapper}>
                <ScanLine size={80} color="#2563eb" style={styles.scanLine} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionTitle}>Comment ça marche ?</Text>
          
          <View style={styles.stepsList}>
            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Préparez la bouée</Text>
                <Text style={styles.stepText}>
                  Assurez-vous que la bouée est allumée et à portée
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Scannez le QR code</Text>
                <Text style={styles.stepText}>
                  Trouvez le code QR sur votre appareil ESP32-S3
                </Text>
              </View>
            </View>

            <View style={styles.step}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Configuration automatique</Text>
                <Text style={styles.stepText}>
                  La bouée sera configurée via LoRaWAN
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Radio size={18} color="#22c55e" />
            </View>
            <Text style={styles.featureText}>LoRaWAN</Text>
          </View>
          <View style={styles.feature}>
            <View style={styles.featureIcon}>
              <Zap size={18} color="#f59e0b" />
            </View>
            <Text style={styles.featureText}>Autonome 8-10 ans</Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable 
          style={({ pressed }) => [
            styles.scanButton,
            pressed && styles.scanButtonPressed
          ]} 
          onPress={() => router.push('/scanner')}
        >
          <LinearGradient
            colors={['#0ea5e9', '#2563eb']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.scanButtonGradient}
          >
            <ScanLine size={24} color="#fff" />
            <Text style={styles.scanButtonText}>Lancer le scan</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748b',
    fontFamily: 'Ubuntu_400Regular',
    lineHeight: 22,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 24,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  iconWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  iconInner: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLineWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanLine: {
    opacity: 0.3,
  },
  
  instructionsContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
    marginBottom: 16,
  },
  stepsList: {
    gap: 16,
  },
  step: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 14,
    fontFamily: 'Ubuntu_700Bold',
    color: '#0ea5e9',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 15,
    fontFamily: 'Ubuntu_500Medium',
    color: '#0f172a',
    marginBottom: 2,
  },
  stepText: {
    fontSize: 13,
    fontFamily: 'Ubuntu_400Regular',
    color: '#64748b',
    lineHeight: 18,
  },
  
  features: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 13,
    fontFamily: 'Ubuntu_500Medium',
    color: '#475569',
  },
  
  scanButton: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scanButtonPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  scanButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 48,
  },
  scanButtonText: {
    fontSize: 17,
    fontFamily: 'Ubuntu_700Bold',
    color: '#fff',
  },
});