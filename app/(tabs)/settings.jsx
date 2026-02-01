import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Switch,
  TouchableOpacity, TextInput, Platform, Alert, Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, Camera, User, Mail, Phone, Building2, 
  Shield, Calendar, LogOut, ChevronRight, Save, Bell,
  Moon, Sun, Globe, Wifi, Bluetooth, Zap, Download,
  Upload, RotateCcw, Trash2, Lock, HelpCircle, FileText,
  Radio, CloudUpload, CloudDownload, Activity, Database,
  Settings as SettingsIcon, Waves, Smartphone, Key
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';

const SETTING_SECTIONS = [
  {
    id: 'profile',
    title: 'Profil',
    icon: User,
    items: [
      { id: 'name', label: 'Nom complet', type: 'input', icon: User },
      { id: 'phone', label: 'Téléphone', type: 'input', icon: Phone },
      { id: 'organization', label: 'Organisation', type: 'input', icon: Building2 },
      { id: 'email', label: 'Email', type: 'readonly', icon: Mail },
    ]
  },
  {
    id: 'appearance',
    title: 'Apparence',
    icon: Sun,
    items: [
      { id: 'theme', label: 'Mode sombre', type: 'toggle', icon: Moon },
      { id: 'language', label: 'Langue', type: 'select', icon: Globe, value: 'Français' },
    ]
  },
  {
    id: 'notifications',
    title: 'Notifications & Alertes',
    icon: Bell,
    items: [
      { id: 'push', label: 'Notifications Push', type: 'toggle', icon: Smartphone },
      { id: 'quality_alerts', label: 'Alertes Qualité Eau', type: 'toggle', icon: Waves },
      { id: 'fall_detection', label: 'Détection de Chute', type: 'toggle', icon: Activity },
      { id: 'battery_low', label: 'Batterie Faible', type: 'toggle', icon: Zap },
      { id: 'connectivity', label: 'Perte de Connexion', type: 'toggle', icon: Wifi },
    ]
  },
  {
    id: 'devices',
    title: 'Gestion des Bouées',
    icon: Radio,
    items: [
      { id: 'add_device', label: 'Ajouter une bouée', type: 'action', icon: CloudUpload },
      { id: 'sync_devices', label: 'Synchroniser', type: 'action', icon: RotateCcw },
      { id: 'view_devices', label: 'Mes bouées ({count})', type: 'navigate', icon: Database },
    ]
  },
  {
    id: 'network',
    title: 'Réseau & Connectivité',
    icon: Wifi,
    items: [
      { id: 'lorawan', label: 'LoRaWAN', type: 'info', icon: Radio, value: 'Actif' },
      { id: 'gateway', label: 'Passerelle DIY', type: 'info', icon: Wifi, value: 'Connectée' },
      { id: 'fuota', label: 'Mises à jour OTA (FUOTA)', type: 'toggle', icon: CloudDownload },
    ]
  },
  {
    id: 'data',
    title: 'Données & Historique',
    icon: Database,
    items: [
      { id: 'export_data', label: 'Exporter les données', type: 'action', icon: Download },
      { id: 'clear_cache', label: 'Vider le cache', type: 'action', icon: Trash2 },
      { id: 'retention', label: 'Conservation des données', type: 'select', icon: Calendar, value: '12 mois' },
    ]
  },
  {
    id: 'security',
    title: 'Sécurité',
    icon: Shield,
    items: [
      { id: 'change_password', label: 'Changer le mot de passe', type: 'action', icon: Lock },
      { id: 'two_factor', label: 'Authentification à 2 facteurs', type: 'toggle', icon: Key },
    ]
  },
  {
    id: 'about',
    title: 'À propos',
    icon: HelpCircle,
    items: [
      { id: 'privacy', label: 'Politique de confidentialité', type: 'navigate', icon: FileText },
      { id: 'terms', label: 'Conditions d\'utilisation', type: 'navigate', icon: FileText },
      { id: 'help', label: 'Centre d\'aide', type: 'navigate', icon: HelpCircle },
    ]
  },
];

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState('profile');
  
  // Settings state
  const [settings, setSettings] = useState({
    // Profile
    name: user?.name || '',
    phone: user?.phone || '',
    organization: user?.organization || '',
    email: user?.email || '',
    
    // Preferences
    theme: false, // false = light, true = dark
    language: 'fr',
    
    // Notifications
    push: true,
    quality_alerts: true,
    fall_detection: true,
    battery_low: true,
    connectivity: true,
    
    // Network
    fuota: true,
    
    // Security
    two_factor: false,
  });

  const joinedDate = user?.createdAt 
    ? new Date(user.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : 'Récemment';

  const handleSave = async () => {
    setLoading(true);
    try {
      // API call simulation
      // await client.put(`/users/${user._id}`, settings);
      setTimeout(() => {
        setLoading(false);
        setEditing(false);
        Alert.alert('Succès', 'Paramètres mis à jour avec succès');
      }, 1000);
    } catch (e) {
      setLoading(false);
      Alert.alert('Erreur', 'Impossible de mettre à jour les paramètres');
    }
  };

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAction = (action) => {
    switch(action) {
      case 'add_device':
        Alert.alert('Ajouter une bouée', 'Scannez le QR code de votre nouvelle bouée');
        break;
      case 'sync_devices':
        Alert.alert('Synchronisation', 'Synchronisation en cours...');
        break;
      case 'export_data':
        Alert.alert('Export', 'Vos données seront exportées en CSV');
        break;
      case 'clear_cache':
        Alert.alert('Cache', 'Cache vidé avec succès');
        break;
      case 'change_password':
        Alert.alert('Mot de passe', 'Fonctionnalité à venir');
        break;
      default:
        break;
    }
  };

  const renderAvatar = () => {
    if (user?.avatar?.startsWith('data:image')) {
      return { uri: user.avatar };
    }
    if (user?.image) {
      return { uri: user.image };
    }
    return require('../../assets/logo.png');
  };

  const renderSettingItem = (item, sectionId) => {
    const IconComponent = item.icon;
    const isExpanded = expandedSection === sectionId;

    if (!isExpanded && item.type !== 'action') return null;

    switch(item.type) {
      case 'input':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <IconComponent size={18} color="#0ea5e9" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <TextInput 
                style={[styles.settingInput, !editing && styles.disabledInput]}
                value={settings[item.id]}
                onChangeText={(text) => setSettings({...settings, [item.id]: text})}
                editable={editing}
                placeholder={item.label}
              />
            </View>
          </View>
        );
      
      case 'readonly':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#f1f5f9' }]}>
              <IconComponent size={18} color="#64748b" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.readOnlyText}>{settings[item.id]}</Text>
            </View>
          </View>
        );
      
      case 'toggle':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <IconComponent size={18} color="#0ea5e9" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <Switch 
              value={settings[item.id]}
              onValueChange={() => handleToggle(item.id)}
              trackColor={{ false: '#cbd5e1', true: '#7dd3fc' }}
              thumbColor={settings[item.id] ? '#0ea5e9' : '#f1f5f9'}
            />
          </View>
        );
      
      case 'select':
        return (
          <TouchableOpacity key={item.id} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <IconComponent size={18} color="#0ea5e9" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={styles.settingValue}>{item.value}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>
        );
      
      case 'info':
        return (
          <View key={item.id} style={styles.settingItem}>
            <View style={[styles.settingIconContainer, { backgroundColor: '#dcfce7' }]}>
              <IconComponent size={18} color="#22c55e" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
              <Text style={[styles.settingValue, { color: '#22c55e', fontFamily: 'Ubuntu_500Medium' }]}>
                {item.value}
              </Text>
            </View>
          </View>
        );
      
      case 'action':
        return (
          <TouchableOpacity 
            key={item.id} 
            style={styles.settingItem}
            onPress={() => handleAction(item.id)}
          >
            <View style={styles.settingIconContainer}>
              <IconComponent size={18} color="#0ea5e9" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>
                {item.label.includes('{count}') ? item.label.replace('{count}', '2') : item.label}
              </Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>
        );
      
      case 'navigate':
        return (
          <TouchableOpacity key={item.id} style={styles.settingItem}>
            <View style={styles.settingIconContainer}>
              <IconComponent size={18} color="#0ea5e9" />
            </View>
            <View style={styles.settingContent}>
              <Text style={styles.settingLabel}>{item.label}</Text>
            </View>
            <ChevronRight size={18} color="#cbd5e1" />
          </TouchableOpacity>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* ─── Header ─── */}
      <View style={styles.headerBg}>
        <SafeAreaView>
          <View style={styles.headerNav}>
            <Text style={styles.headerTitle}>Paramètres</Text>
            {editing ? (
              <TouchableOpacity 
                onPress={handleSave} 
                disabled={loading} 
                style={styles.saveBtn}
              >
                <Save size={18} color="#fff" />
                <Text style={styles.saveText}>
                  {loading ? 'Enregistrement...' : 'Enregistrer'}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={styles.editText}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* ─── Profile Card ─── */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Image 
              source={renderAvatar()}
              style={styles.avatar} 
            />
            {editing && (
              <TouchableOpacity style={styles.cameraBadge}>
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <Shield size={10} color="#64748b" />
            <Text style={styles.roleText}>
              {user?.role === 'user' ? 'Utilisateur Standard' : 'Admin'}
            </Text>
          </View>
          <Text style={styles.joinedText}>Membre depuis {joinedDate}</Text>
        </View>

        {/* ─── Settings Sections ─── */}
        {SETTING_SECTIONS.map(section => {
          const SectionIcon = section.icon;
          const isExpanded = expandedSection === section.id;
          
          return (
            <View key={section.id} style={styles.section}>
              <TouchableOpacity 
                style={styles.sectionHeader}
                onPress={() => setExpandedSection(isExpanded ? null : section.id)}
              >
                <View style={styles.sectionTitleContainer}>
                  <View style={styles.sectionIconWrapper}>
                    <SectionIcon size={16} color="#0ea5e9" />
                  </View>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                </View>
                <ChevronRight 
                  size={18} 
                  color="#94a3b8" 
                  style={{
                    transform: [{ rotate: isExpanded ? '90deg' : '0deg' }]
                  }}
                />
              </TouchableOpacity>
              
              {isExpanded && (
                <View style={styles.settingGroup}>
                  {section.items.map(item => renderSettingItem(item, section.id))}
                </View>
              )}
            </View>
          );
        })}

        {/* ─── Logout ─── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <LogOut size={20} color="#ef4444" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          EauSûre v1.0.2 • Build 2026.01.29
        </Text>
        <Text style={styles.copyright}>
          Système IoT de Surveillance de la Qualité de l'Eau
        </Text>
        <View style={{ height: 100 }} /> 
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f8fafc',
  },
  
  // Header
  headerBg: { 
    backgroundColor: '#fff', 
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  headerNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    height: 44,
  },
  headerTitle: { 
    fontSize: 22, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
  },
  editText: { 
    color: '#0ea5e9', 
    fontSize: 16, 
    fontFamily: 'Ubuntu_500Medium',
  },
  saveBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#0ea5e9', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    gap: 8, 
    alignItems: 'center',
  },
  saveText: { 
    color: '#fff', 
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 14,
  },

  scrollContent: { 
    paddingHorizontal: 20,
  },

  // Profile Card
  profileCard: { 
    alignItems: 'center', 
    marginTop: 24, 
    marginBottom: 32,
  },
  avatarContainer: { 
    position: 'relative', 
    marginBottom: 16,
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4, 
    borderColor: '#fff',
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  cameraBadge: { 
    position: 'absolute', 
    bottom: 0, 
    right: 0, 
    backgroundColor: '#0ea5e9', 
    padding: 10, 
    borderRadius: 24, 
    borderWidth: 3, 
    borderColor: '#fff',
  },
  userName: { 
    fontSize: 24, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a', 
    marginBottom: 6,
  },
  roleBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 6, 
    backgroundColor: '#e2e8f0', 
    paddingHorizontal: 12, 
    paddingVertical: 5, 
    borderRadius: 12, 
    marginBottom: 10,
  },
  roleText: { 
    fontSize: 11, 
    fontFamily: 'Ubuntu_500Medium',
    color: '#475569', 
    textTransform: 'uppercase',
  },
  joinedText: { 
    fontSize: 13, 
    color: '#94a3b8',
    fontFamily: 'Ubuntu_400Regular',
  },

  // Sections
  section: { 
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 8,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sectionIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: '#e0f2fe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: { 
    fontSize: 16, 
    fontFamily: 'Ubuntu_700Bold',
    color: '#0f172a',
  },
  
  settingGroup: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    overflow: 'hidden',
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  settingIconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    backgroundColor: '#e0f2fe', 
    alignItems: 'center', 
    justifyContent: 'center',
  },
  settingContent: { 
    flex: 1,
  },
  settingLabel: { 
    fontSize: 15, 
    color: '#0f172a', 
    fontFamily: 'Ubuntu_500Medium',
  },
  settingInput: { 
    fontSize: 15, 
    fontFamily: 'Ubuntu_400Regular',
    color: '#0f172a', 
    marginTop: 4,
    padding: 0,
  },
  disabledInput: { 
    color: '#64748b',
  },
  readOnlyText: { 
    fontSize: 14, 
    fontFamily: 'Ubuntu_400Regular',
    color: '#64748b',
    marginTop: 2,
  },
  settingValue: {
    fontSize: 14,
    fontFamily: 'Ubuntu_400Regular',
    color: '#64748b',
    marginTop: 2,
  },

  // Actions
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    backgroundColor: '#fee2e2', 
    padding: 18, 
    borderRadius: 16,
    marginTop: 20,
  },
  logoutText: { 
    color: '#ef4444', 
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 16,
  },
  version: { 
    textAlign: 'center', 
    color: '#94a3b8', 
    fontSize: 12, 
    fontFamily: 'Ubuntu_500Medium',
    marginTop: 24,
  },
  copyright: {
    textAlign: 'center',
    color: '#cbd5e1',
    fontSize: 11,
    fontFamily: 'Ubuntu_400Regular',
    marginTop: 8,
  },
});