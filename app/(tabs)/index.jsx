import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Droplets, Activity, Battery, Wifi, Bell, 
  MapPin, ArrowUpRight, AlertTriangle, Waves
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

// ─── Theme Configuration ───
const THEME = {
  primary: ['#0ea5e9', '#2563eb'],
  alert: ['#ef4444', '#b91c1c'],
  success: ['#22c55e', '#15803d'],
  warning: ['#f59e0b', '#d97706'],
  cardBg: '#ffffff',
  textMain: '#0f172a',
  textSub: '#64748b',
};

// Mock data (en attendant l'API)
const MOCK_BUOYS = [
  { _id: '1', name: 'Puits Nord', status: 'active', tds: 420, ph: 7.2, turbidity: 'clear', bat: 87 },
  { _id: '2', name: 'Réservoir Est', status: 'alert', tds: 890, ph: 5.8, turbidity: 'turbid', bat: 12 },
];

// Mock global metrics
const GLOBAL_METRICS = {
  avgTDS: 412,
  avgPH: 6.8,
  turbidityStatus: 'clear', // 'clear' or 'turbid'
  activeAlerts: 1,
};

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const avatarSource = user?.image 
    ? { uri: user.image } 
    : user?.avatar 
      ? { uri: user.avatar } 
      : { uri: 'https://ui-avatars.com/api/?background=0ea5e9&color=fff&name=' + (user?.name || 'User') };

  const firstName = user?.name?.split(' ')[0] || 'Utilisateur';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* ─── Enhanced Header ─── */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.header}>
          
          {/* Left Side: Logo + App Name + Date Lockup */}
          <View style={styles.headerLeft}>
            <View style={styles.logoWrapper}>
              <Image 
                source={require('../../assets/logo.png')}
                style={styles.logoIcon}
                resizeMode="contain"
              />
            </View>
            <View style={styles.headerTextWrap}>
              <Text style={styles.appName}>EauSûre</Text>
              <Text style={styles.dateText}>
                {new Date().toLocaleDateString('fr-FR', { 
                  weekday: 'long',
                  day: 'numeric', 
                  month: 'long' 
                })}
              </Text>
            </View>
          </View>
          
          {/* Right Side: Avatar */}
          <TouchableOpacity 
            style={styles.profileBtn}
            onPress={() => router.push('/settings')}
            activeOpacity={0.8}
          >
            <Image source={avatarSource} style={styles.avatar} />
            <View style={styles.notifBadge} />
          </TouchableOpacity>

        </View>
      </SafeAreaView>

      <ScrollView 
        contentContainerStyle={{ paddingBottom: 100 }} 
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Hero Section (KPIs) ─── */}
        <View style={styles.section}>
          <Text style={styles.greeting}>Bonjour, {firstName} 👋</Text>
          <Text style={styles.subGreeting}>Voici l'état de vos installations.</Text>
          
          {/* Main Metrics Grid */}
          <View style={styles.metricsContainer}>
            {/* TDS Card */}
            <TouchableOpacity activeOpacity={0.8} style={styles.metricCardLarge}>
              <LinearGradient
                colors={THEME.primary}
                start={{ x: 0, y: 0 }} 
                end={{ x: 1, y: 1 }}
                style={styles.gradientCard}
              >
                <View style={styles.bgPattern}>
                  <Droplets size={120} color="rgba(255,255,255,0.08)" style={styles.bgIcon1} />
                  <Droplets size={80} color="rgba(255,255,255,0.05)" style={styles.bgIcon2} />
                </View>
                
                <View style={styles.cardContent}>
                  <View style={styles.metricHeader}>
                    <View style={styles.iconContainer}>
                      <Droplets size={22} color="#fff" />
                    </View>
                    <Text style={styles.metricLabel}>Qualité de l'eau</Text>
                  </View>
                  <Text style={styles.metricValueLarge}>
                    {GLOBAL_METRICS.avgTDS} <Text style={styles.metricUnit}>ppm</Text>
                  </Text>
                  <Text style={styles.metricSubtext}>TDS Moyen • Excellent</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary Metrics Row */}
            <View style={styles.secondaryRow}>
              {/* pH Card */}
              <TouchableOpacity activeOpacity={0.8} style={styles.metricCardSmall}>
                <LinearGradient
                  colors={['#ffffff', '#f8fafc']}
                  style={[styles.gradientCard, styles.shadow]}
                >
                  <View style={styles.bgPattern}>
                    <View style={styles.phCurve} />
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.metricHeader}>
                      <View style={[styles.iconContainer, { backgroundColor: '#dbeafe' }]}>
                        <Activity size={18} color="#2563eb" />
                      </View>
                      <Text style={[styles.metricLabel, { color: THEME.textSub }]}>pH</Text>
                    </View>
                    <Text style={[styles.metricValueMedium, { color: THEME.textMain }]}>
                      {GLOBAL_METRICS.avgPH}
                    </Text>
                    <Text style={[styles.metricSubtext, { color: THEME.textSub }]}>Neutre</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              {/* Turbidity Card */}
              <TouchableOpacity activeOpacity={0.8} style={styles.metricCardSmall}>
                <LinearGradient
                  colors={GLOBAL_METRICS.turbidityStatus === 'clear' ? THEME.success : THEME.warning}
                  start={{ x: 0, y: 0 }} 
                  end={{ x: 1, y: 1 }}
                  style={styles.gradientCard}
                >
                  <View style={styles.bgPattern}>
                    <Waves size={90} color="rgba(255,255,255,0.1)" style={styles.bgIcon1} />
                  </View>
                  
                  <View style={styles.cardContent}>
                    <View style={styles.metricHeader}>
                      <View style={styles.iconContainer}>
                        <Waves size={18} color="#fff" />
                      </View>
                      <Text style={styles.metricLabel}>Turbidité</Text>
                    </View>
                    <Text style={styles.metricValueMedium}>
                      {GLOBAL_METRICS.turbidityStatus === 'clear' ? 'Claire' : 'Trouble'}
                    </Text>
                    <Text style={styles.metricSubtext}>État actuel</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Alerts Card */}
            <TouchableOpacity activeOpacity={0.8} style={styles.alertCard}>
              <View style={[styles.alertCardInner, styles.shadow]}>
                <View style={styles.alertIcon}>
                  <Bell size={20} color="#ef4444" />
                  {GLOBAL_METRICS.activeAlerts > 0 && (
                    <View style={styles.alertBadge}>
                      <Text style={styles.alertBadgeText}>{GLOBAL_METRICS.activeAlerts}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.alertContent}>
                  <Text style={styles.alertTitle}>
                    {GLOBAL_METRICS.activeAlerts} Alerte{GLOBAL_METRICS.activeAlerts > 1 ? 's' : ''} Active{GLOBAL_METRICS.activeAlerts > 1 ? 's' : ''}
                  </Text>
                  <Text style={styles.alertText}>Batterie faible détectée</Text>
                </View>
                <ArrowUpRight size={18} color="#94a3b8" />
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* ─── Polished Liste des Appareils ─── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Mes Bouées</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          {MOCK_BUOYS.map((buoy) => (
            <TouchableOpacity key={buoy._id} activeOpacity={0.9} style={styles.buoyCardWrapper}>
              <ImageBackground 
                source={require('../../assets/bg_card.png')}
                style={[styles.buoyCard, styles.shadow]}
                imageStyle={styles.buoyCardImage}
              >
                
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.cardTitleWrap}>
                    <View style={styles.titleRow}>
                      <Text style={styles.buoyName}>{buoy.name}</Text>
                      <View style={[
                        styles.statusDot, 
                        { backgroundColor: buoy.status === 'alert' ? THEME.alert[0] : THEME.success[0] }
                      ]} />
                    </View>
                    <View style={styles.locationTag}>
                      <MapPin size={12} color="#64748b" />
                      <Text style={styles.locationText}>Guellala, Djerba</Text>
                    </View>
                  </View>
                  <View style={styles.cardArrowBtn}>
                    <ArrowUpRight size={20} color="#94a3b8" />
                  </View>
                </View>

                {/* Metrics Grid */}
                <View style={styles.buoyMetricsGrid}>
                  <View style={styles.metricBox}>
                    <View style={styles.metricBoxHeader}>
                      <Droplets size={14} color="#64748b" />
                      <Text style={styles.buoyMetricLabel}>TDS</Text>
                    </View>
                    <Text style={[
                      styles.buoyMetricValue, 
                      { color: buoy.tds > 500 ? THEME.alert[0] : THEME.textMain }
                    ]}>
                      {buoy.tds} <Text style={styles.buoyMetricUnit}>ppm</Text>
                    </Text>
                  </View>
                  
                  <View style={styles.metricBox}>
                    <View style={styles.metricBoxHeader}>
                      <Activity size={14} color="#64748b" />
                      <Text style={styles.buoyMetricLabel}>pH</Text>
                    </View>
                    <Text style={styles.buoyMetricValue}>{buoy.ph}</Text>
                  </View>
                  
                  <View style={styles.metricBox}>
                    <View style={styles.metricBoxHeader}>
                      <Battery size={14} color="#64748b" />
                      <Text style={styles.buoyMetricLabel}>Batterie</Text>
                    </View>
                    <Text style={[
                      styles.buoyMetricValue, 
                      { color: buoy.bat < 20 ? THEME.alert[0] : THEME.success[0] }
                    ]}>
                      {buoy.bat}%
                    </Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },
  shadow: {
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  
  // Header Styles Updated
  headerSafe: { 
    backgroundColor: '#fff', 
    paddingBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoWrapper: {
    width: 44,
    height: 44,
    backgroundColor: '#e0f2fe', // Soft blue box behind the orb
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoIcon: { 
    width: 28, 
    height: 28,
  },
  headerTextWrap: {
    justifyContent: 'center',
  },
  appName: {
    fontSize: 17,
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
    marginBottom: 2,
  },
  dateText: { 
    fontSize: 13, 
    color: '#64748b', 
    fontFamily: 'Ubuntu_500Medium',
    textTransform: 'capitalize',
  },
  
  // Right side Avatar
  profileBtn: { 
    position: 'relative',
    padding: 2,
  },
  avatar: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    borderWidth: 2, 
    borderColor: '#e2e8f0' 
  },
  notifBadge: {
    position: 'absolute', 
    top: 0, 
    right: 0, 
    width: 14, 
    height: 14, 
    borderRadius: 7, 
    backgroundColor: '#ef4444', 
    borderWidth: 2.5, 
    borderColor: '#fff' 
  },

  // Hero Section
  section: { padding: 20 },
  greeting: { 
    fontSize: 28, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a', 
    marginBottom: 4,
  },
  subGreeting: { 
    fontSize: 15, 
    color: '#64748b',
    fontFamily: 'Ubuntu_400Regular',
    marginBottom: 24,
  },
  
  // Metrics Container
  metricsContainer: { gap: 16 },
  metricCardLarge: { height: 180, borderRadius: 24, overflow: 'hidden' },
  metricCardSmall: { flex: 1, height: 160, borderRadius: 20, overflow: 'hidden' },
  secondaryRow: { flexDirection: 'row', gap: 16 },
  gradientCard: { flex: 1, padding: 20, position: 'relative', overflow: 'hidden' },
  
  // Background patterns
  bgPattern: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  bgIcon1: { position: 'absolute', right: -20, top: -10 },
  bgIcon2: { position: 'absolute', left: -10, bottom: -15 },
  phCurve: {
    position: 'absolute', right: 0, bottom: 0, width: 100, height: 60,
    borderTopLeftRadius: 60, borderWidth: 3, borderColor: '#e0f2fe',
    borderRightWidth: 0, borderBottomWidth: 0,
  },
  cardContent: { flex: 1, justifyContent: 'space-between', zIndex: 1 },
  metricHeader: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  iconContainer: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  metricLabel: { 
    color: 'rgba(255,255,255,0.95)', fontSize: 13, fontFamily: 'Ubuntu_500Medium',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  metricValueLarge: { color: '#fff', fontSize: 48, fontFamily: 'Ubuntu_700Bold', lineHeight: 52 },
  metricValueMedium: { color: '#fff', fontSize: 36, fontFamily: 'Ubuntu_700Bold' },
  metricUnit: { fontSize: 20, fontFamily: 'Ubuntu_500Medium', opacity: 0.9 },
  metricSubtext: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'Ubuntu_400Regular' },
  
  // Alert Card
  alertCard: { borderRadius: 16 },
  alertCardInner: { backgroundColor: '#fff', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 },
  alertIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#fee2e2', alignItems: 'center', justifyContent: 'center' },
  alertBadge: {
    position: 'absolute', top: -4, right: -4, backgroundColor: '#ef4444', borderRadius: 10,
    minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6, borderWidth: 2, borderColor: '#fff',
  },
  alertBadgeText: { color: '#fff', fontSize: 11, fontFamily: 'Ubuntu_700Bold' },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: 15, fontFamily: 'Ubuntu_700Bold', color: '#0f172a', marginBottom: 2 },
  alertText: { fontSize: 13, color: '#64748b', fontFamily: 'Ubuntu_400Regular' },

  // List (Mes Bouées)
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginBottom: 16,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
  },
  seeAll: { 
    fontSize: 14, 
    color: '#0ea5e9', 
    fontFamily: 'Ubuntu_500Medium',
  },

  // Enhanced Cards
  buoyCardWrapper: {
    marginBottom: 16,
  },
  buoyCard: {
    backgroundColor: '#fff', 
    borderRadius: 24, 
    padding: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    overflow: 'hidden',
  },
  buoyCardImage: {
    borderRadius: 24,
    opacity: 0.4,
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  cardTitleWrap: { gap: 4 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  buoyName: { 
    fontSize: 18, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
  },
  locationTag: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4,
  },
  locationText: { 
    fontSize: 13, 
    color: '#64748b',
    fontFamily: 'Ubuntu_400Regular',
  },
  cardArrowBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  // Bento-style Metric Grid
  buoyMetricsGrid: { 
    flexDirection: 'row', 
    gap: 12,
  },
  metricBox: { 
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 16,
    padding: 12,
    gap: 8,
  },
  metricBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buoyMetricLabel: { 
    fontSize: 12, 
    color: '#64748b', 
    fontFamily: 'Ubuntu_500Medium',
  },
  buoyMetricValue: { 
    fontSize: 18, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
  },
  buoyMetricUnit: {
    fontSize: 13,
    fontFamily: 'Ubuntu_500Medium',
    color: '#94a3b8',
  }
});