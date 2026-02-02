import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Image, Switch,
  TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator,
  Modal, useColorScheme
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronRight, Save, User, Mail, Phone, Building2, 
  Bell, Shield, LogOut, Camera, Smartphone, 
  Activity, Globe, Moon, Sun, Lock, Key, Fingerprint,
  Thermometer, Ruler, CheckCircle
} from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import * as ImagePicker from 'expo-image-picker';

export default function SettingsPage() {
  const { logout } = useAuth();
  const { profile, updateProfile, loading: profileLoading } = useProfile();
  const systemColorScheme = useColorScheme();
  
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [expandedSection, setExpandedSection] = useState('profile');
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // Local state for the form
  const [formData, setFormData] = useState({});
  
  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Sync Profile Data to Local Form State
  useEffect(() => {
    if (profile) {
      setFormData({
        // Top level fields
        name: profile.name || '',
        phone: profile.phone || '',
        organization: profile.organization || '',
        email: profile.email || '',
        avatar: profile.avatar || profile.image || '',
        
        // Preferences -> Notifications (matching your JSON structure)
        push: profile.preferences?.notifications?.push ?? true,
        emailAlerts: profile.preferences?.notifications?.emailAlerts ?? true,
        criticalOnly: profile.preferences?.notifications?.criticalOnly ?? false,
        fall_detection: profile.preferences?.notifications?.fall_detection ?? true,
        dailySummary: profile.preferences?.notifications?.dailySummary ?? true,
        maintenanceReminders: profile.preferences?.notifications?.maintenanceReminders ?? true,
        
        // Preferences -> Units
        temperature: profile.preferences?.units?.temperature || 'celsius',
        distance: profile.preferences?.units?.distance || 'metric',
        
        // Preferences -> General
        language: profile.preferences?.language || 'en',
        
        // Security settings (these would need to be stored separately)
        biometric: profile.preferences?.security?.biometric ?? false,
        
        // UI preferences
        theme: profile.preferences?.theme || 'auto', // 'light', 'dark', 'auto'
      });
      
      // Set dark mode based on profile or system
      const themePreference = profile.preferences?.theme || 'auto';
      if (themePreference === 'auto') {
        setIsDarkMode(systemColorScheme === 'dark');
      } else {
        setIsDarkMode(themePreference === 'dark');
      }
    }
  }, [profile, systemColorScheme]);

  // Get current theme colors
  const theme = isDarkMode ? darkTheme : lightTheme;

  // 2. Handle Avatar Change
  const handleAvatarChange = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        // Here you would upload the image to your server
        // For now, we'll just update the local state
        setFormData(prev => ({ ...prev, avatar: result.assets[0].uri }));
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de charger l\'image');
    }
  };

  // 3. Handle Password Change
  const handlePasswordChange = async () => {
    if (!passwordData.current || !passwordData.new || !passwordData.confirm) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (passwordData.new !== passwordData.confirm) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.new.length < 8) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    // Here you would call your API to change password
    // For now, we'll just show success
    Alert.alert('Succès', 'Mot de passe modifié avec succès');
    setPasswordModalVisible(false);
    setPasswordData({ current: '', new: '', confirm: '' });
  };

  // 4. Handle Save Action
  const handleSave = async () => {
    setSaving(true);
    
    // Construct the nested payload expected by the API
    const apiPayload = {
      name: formData.name,
      phone: formData.phone,
      organization: formData.organization,
      avatar: formData.avatar,
      preferences: {
        language: formData.language,
        theme: formData.theme,
        units: { 
          temperature: formData.temperature, 
          distance: formData.distance 
        },
        notifications: {
          push: formData.push,
          emailAlerts: formData.emailAlerts,
          criticalOnly: formData.criticalOnly,
          fall_detection: formData.fall_detection,
          dailySummary: formData.dailySummary,
          maintenanceReminders: formData.maintenanceReminders
        },
        security: {
          biometric: formData.biometric
        }
      }
    };

    const result = await updateProfile(apiPayload);
    
    setSaving(false);
    if (result.success) {
      setEditing(false);
      Alert.alert('Succès', 'Vos paramètres ont été mis à jour.');
    } else {
      Alert.alert('Erreur', 'Impossible de mettre à jour les paramètres.');
    }
  };

  // 5. Input Handlers
  const handleChange = (key, text) => {
    setFormData(prev => ({ ...prev, [key]: text }));
  };

  const handleToggle = (key) => {
    if (!editing && key !== 'theme') return;
    setFormData(prev => ({ ...prev, [key]: !prev[key] }));
    
    // Special handling for theme toggle
    if (key === 'theme') {
      const newTheme = formData.theme === 'light' ? 'dark' : 'light';
      setFormData(prev => ({ ...prev, theme: newTheme }));
      setIsDarkMode(newTheme === 'dark');
    }
  };

  const handleSelectChange = (key, value) => {
    if (!editing) return;
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // 6. Section Definitions
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
      id: 'notifications',
      title: 'Notifications',
      icon: Bell,
      items: [
        { id: 'push', label: 'Notifications Push', type: 'toggle', icon: Smartphone },
        { id: 'emailAlerts', label: 'Alertes Email', type: 'toggle', icon: Mail },
        { id: 'criticalOnly', label: 'Alertes Critiques Uniquement', type: 'toggle', icon: Activity },
        { id: 'fall_detection', label: 'Détection de Chute', type: 'toggle', icon: Activity },
        { id: 'dailySummary', label: 'Résumé Quotidien', type: 'toggle', icon: Bell },
        { id: 'maintenanceReminders', label: 'Rappels de Maintenance', type: 'toggle', icon: Bell },
      ]
    },
    {
      id: 'units',
      title: 'Unités de Mesure',
      icon: Ruler,
      items: [
        { 
          id: 'temperature', 
          label: 'Température', 
          type: 'select', 
          icon: Thermometer,
          options: [
            { value: 'celsius', label: '°C (Celsius)' },
            { value: 'fahrenheit', label: '°F (Fahrenheit)' }
          ]
        },
        { 
          id: 'distance', 
          label: 'Distance', 
          type: 'select', 
          icon: Ruler,
          options: [
            { value: 'metric', label: 'Métrique (km, m)' },
            { value: 'imperial', label: 'Impérial (mi, ft)' }
          ]
        },
      ]
    },
    {
      id: 'preferences',
      title: 'Préférences',
      icon: Globe,
      items: [
        { 
          id: 'language', 
          label: 'Langue', 
          type: 'select', 
          icon: Globe,
          options: [
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'Français' },
            { value: 'ar', label: 'العربية' }
          ]
        },
        { 
          id: 'theme', 
          label: 'Mode Sombre', 
          type: 'toggle', 
          icon: isDarkMode ? Moon : Sun,
          alwaysEnabled: true // Can toggle even when not editing
        },
      ]
    },
    {
      id: 'security',
      title: 'Sécurité',
      icon: Shield,
      items: [
        { id: 'password', label: 'Changer le mot de passe', type: 'action', icon: Key },
        { id: 'biometric', label: 'Connexion Biométrique', type: 'toggle', icon: Fingerprint },
      ]
    }
  ];

  // 7. Render Helper
  const renderSettingItem = (item, sectionId) => {
    const isExpanded = expandedSection === sectionId;
    if (!isExpanded) return null;

    const IconComponent = item.icon;
    const canEdit = editing || item.alwaysEnabled;

    // INPUT TYPE
    if (item.type === 'input') {
      return (
        <View key={item.id} style={[styles.settingItem, { backgroundColor: theme.cardBackground }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: theme.iconBackground }]}>
            <IconComponent size={18} color={theme.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
            <TextInput 
              style={[
                styles.settingInput, 
                { color: theme.text },
                !editing && styles.disabledInput
              ]}
              value={formData[item.id]}
              onChangeText={(t) => handleChange(item.id, t)}
              editable={editing}
              placeholder={!editing ? "Non renseigné" : item.label}
              placeholderTextColor={theme.textSecondary}
            />
          </View>
        </View>
      );
    }

    // TOGGLE TYPE
    if (item.type === 'toggle') {
      return (
        <View key={item.id} style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
           <View style={[styles.settingIconContainer, { backgroundColor: theme.iconBackground }]}>
             <IconComponent size={18} color={theme.primary} />
           </View>
           <View style={styles.settingContent}>
             <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
           </View>
           <Switch 
             value={formData[item.id]}
             onValueChange={() => handleToggle(item.id)}
             disabled={!canEdit} 
             trackColor={{ false: theme.switchTrackInactive, true: theme.switchTrackActive }}
             thumbColor={formData[item.id] ? theme.primary : theme.switchThumb}
           />
        </View>
      );
    }
    
    // SELECT TYPE
    if (item.type === 'select') {
      const currentOption = item.options?.find(opt => opt.value === formData[item.id]);
      
      return (
        <View key={item.id} style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
          <View style={[styles.settingIconContainer, { backgroundColor: theme.iconBackground }]}>
            <IconComponent size={18} color={theme.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
            {currentOption && (
              <Text style={[styles.settingValue, { color: theme.textSecondary }]}>
                {currentOption.label}
              </Text>
            )}
          </View>
          {editing && (
            <View style={styles.selectOptions}>
              {item.options?.map(option => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelectChange(item.id, option.value)}
                  style={[
                    styles.selectOption,
                    { backgroundColor: theme.background }
                  ]}
                >
                  {formData[item.id] === option.value && (
                    <CheckCircle size={16} color={theme.primary} />
                  )}
                  <Text style={[
                    styles.selectOptionText,
                    { color: theme.text },
                    formData[item.id] === option.value && { fontWeight: '600' }
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {!editing && <ChevronRight size={18} color={theme.textSecondary} />}
        </View>
      );
    }
    
    // READONLY TYPE
    if (item.type === 'readonly') {
        return (
          <View key={item.id} style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
            <View style={[styles.settingIconContainer, { backgroundColor: theme.disabledBackground }]}>
              <IconComponent size={18} color={theme.textSecondary} />
            </View>
            <View style={styles.settingContent}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
              <Text style={[styles.readOnlyText, { color: theme.textSecondary }]}>{formData[item.id]}</Text>
            </View>
            <Lock size={14} color={theme.textSecondary} />
          </View>
        );
    }

    // ACTION TYPE (like password change)
    if (item.type === 'action') {
      return (
        <TouchableOpacity 
          key={item.id} 
          style={[styles.settingItem, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}
          onPress={() => item.id === 'password' && setPasswordModalVisible(true)}
          disabled={!editing}
        >
          <View style={[styles.settingIconContainer, { backgroundColor: theme.iconBackground }]}>
            <IconComponent size={18} color={theme.primary} />
          </View>
          <View style={styles.settingContent}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>{item.label}</Text>
          </View>
          <ChevronRight size={18} color={theme.textSecondary} />
        </TouchableOpacity>
      );
    }

    return null;
  };

  // 8. Loading State
  if (profileLoading || !profile) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={{ marginTop: 10, color: theme.textSecondary }}>Chargement du profil...</Text>
      </View>
    );
  }

  // 9. Main Render
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.headerBg, { backgroundColor: theme.cardBackground, borderBottomColor: theme.border }]}>
        <SafeAreaView edges={['top']}>
          <View style={styles.headerNav}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>Paramètres</Text>
            {editing ? (
              <TouchableOpacity 
                onPress={handleSave} 
                disabled={saving} 
                style={[styles.saveBtn, { backgroundColor: theme.primary }]}
              >
                {saving ? <ActivityIndicator size="small" color="#fff" /> : <Save size={18} color="#fff" />}
                <Text style={styles.saveText}>{saving ? '...' : 'Enregistrer'}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => setEditing(true)}>
                <Text style={[styles.editText, { color: theme.primary }]}>Modifier</Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: theme.cardBackground }]}>
          <View style={styles.avatarContainer}>
            <Image 
              source={
                formData.avatar 
                  ? { uri: formData.avatar } 
                  : require('../../assets/logo.png')
              } 
              style={[styles.avatar, { borderColor: theme.cardBackground }]} 
            />
            {editing && (
              <TouchableOpacity 
                style={[styles.editAvatarBtn, { backgroundColor: theme.primary, borderColor: theme.cardBackground }]}
                onPress={handleAvatarChange}
              >
                <Camera size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={[styles.userName, { color: theme.text }]}>
            {formData.name || 'Utilisateur'}
          </Text>
          <Text style={[styles.joinedText, { color: theme.textSecondary }]}>
            {formData.email}
          </Text>
        </View>

        {/* Dynamic Sections */}
        {SETTING_SECTIONS.map(section => (
            <View key={section.id} style={styles.section}>
                 <TouchableOpacity 
                    style={[styles.sectionHeader, { backgroundColor: theme.cardBackground }]} 
                    onPress={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                    activeOpacity={0.7}
                 >
                    <View style={styles.sectionTitleContainer}>
                        <section.icon size={16} color={theme.primary} />
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>{section.title}</Text>
                    </View>
                    <ChevronRight 
                      size={18} 
                      color={theme.textSecondary} 
                      style={{ transform: [{ rotate: expandedSection === section.id ? '90deg' : '0deg' }] }}
                    />
                 </TouchableOpacity>
                 
                 {expandedSection === section.id && (
                     <View style={[styles.settingGroup, { backgroundColor: theme.cardBackground }]}>
                        {section.items.map(item => renderSettingItem(item, section.id))}
                     </View>
                 )}
            </View>
        ))}

        {/* Logout */}
        <TouchableOpacity 
          style={[styles.logoutBtn, { backgroundColor: theme.dangerBackground }]} 
          onPress={logout}
        >
          <LogOut size={20} color={theme.danger} />
          <Text style={[styles.logoutText, { color: theme.danger }]}>Se déconnecter</Text>
        </TouchableOpacity>
        
        <View style={{height: 50}} />
      </ScrollView>

      {/* Password Change Modal */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: theme.cardBackground }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Changer le mot de passe</Text>
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Mot de passe actuel"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={passwordData.current}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, current: text }))}
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Nouveau mot de passe"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={passwordData.new}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, new: text }))}
            />
            
            <TextInput
              style={[styles.modalInput, { backgroundColor: theme.background, color: theme.text, borderColor: theme.border }]}
              placeholder="Confirmer le mot de passe"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry
              value={passwordData.confirm}
              onChangeText={(text) => setPasswordData(prev => ({ ...prev, confirm: text }))}
            />
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel, { backgroundColor: theme.background }]}
                onPress={() => {
                  setPasswordModalVisible(false);
                  setPasswordData({ current: '', new: '', confirm: '' });
                }}
              >
                <Text style={[styles.modalButtonText, { color: theme.textSecondary }]}>Annuler</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm, { backgroundColor: theme.primary }]}
                onPress={handlePasswordChange}
              >
                <Text style={[styles.modalButtonText, { color: '#fff' }]}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// 10. Theme Definitions
const lightTheme = {
  background: '#f8fafc',
  cardBackground: '#ffffff',
  text: '#0f172a',
  textSecondary: '#64748b',
  primary: '#0ea5e9',
  border: '#f1f5f9',
  iconBackground: '#e0f2fe',
  disabledBackground: '#f1f5f9',
  switchTrackActive: '#7dd3fc',
  switchTrackInactive: '#cbd5e1',
  switchThumb: '#f1f5f9',
  danger: '#ef4444',
  dangerBackground: '#fee2e2',
};

const darkTheme = {
  background: '#0f172a',
  cardBackground: '#1e293b',
  text: '#f1f5f9',
  textSecondary: '#94a3b8',
  primary: '#38bdf8',
  border: '#334155',
  iconBackground: '#1e3a5f',
  disabledBackground: '#334155',
  switchTrackActive: '#0284c7',
  switchTrackInactive: '#475569',
  switchThumb: '#cbd5e1',
  danger: '#f87171',
  dangerBackground: '#450a0a',
};

// 11. Styles
const styles = StyleSheet.create({
  container: { 
    flex: 1, 
  },
  headerBg: { 
    paddingBottom: 20, 
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  headerNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    alignItems: 'center', 
    height: 44 
  },
  headerTitle: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    fontFamily: 'Ubuntu_700Bold' 
  },
  editText: { 
    fontSize: 16, 
    fontWeight: '600',
    fontFamily: 'Ubuntu_500Medium' 
  },
  saveBtn: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    gap: 8, 
    alignItems: 'center' 
  },
  saveText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 14,
    fontFamily: 'Ubuntu_700Bold' 
  },
  scrollContent: { 
    paddingHorizontal: 20 
  },
  profileCard: { 
    alignItems: 'center', 
    marginTop: 24, 
    marginBottom: 24,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  avatarContainer: { 
    marginBottom: 16,
    position: 'relative'
  },
  avatar: { 
    width: 110, 
    height: 110, 
    borderRadius: 55, 
    borderWidth: 4,
    backgroundColor: '#e2e8f0' 
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
  },
  userName: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 6,
    fontFamily: 'Ubuntu_700Bold' 
  },
  joinedText: { 
    fontSize: 13, 
    fontFamily: 'Ubuntu_400Regular' 
  },
  section: { 
    marginBottom: 20 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingVertical: 14, 
    paddingHorizontal: 16, 
    borderRadius: 16, 
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitleContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12 
  },
  sectionTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    fontFamily: 'Ubuntu_700Bold' 
  },
  settingGroup: { 
    borderRadius: 16, 
    overflow: 'hidden',
    marginTop: 4 
  },
  settingItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    gap: 12, 
    borderBottomWidth: 1,
  },
  settingIconContainer: { 
    width: 36, 
    height: 36, 
    borderRadius: 10, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  settingContent: { 
    flex: 1 
  },
  settingLabel: { 
    fontSize: 15, 
    fontWeight: '500',
    fontFamily: 'Ubuntu_500Medium' 
  },
  settingInput: { 
    fontSize: 15, 
    marginTop: 4, 
    padding: 0,
    fontFamily: 'Ubuntu_400Regular' 
  },
  disabledInput: { 
    opacity: 0.6 
  },
  readOnlyText: { 
    fontSize: 14, 
    marginTop: 2,
    fontFamily: 'Ubuntu_400Regular' 
  },
  settingValue: {
    fontSize: 14,
    marginTop: 2,
    fontFamily: 'Ubuntu_400Regular'
  },
  selectOptions: {
    flexDirection: 'column',
    gap: 8,
    marginTop: 8,
  },
  selectOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 8,
  },
  selectOptionText: {
    fontSize: 14,
    fontFamily: 'Ubuntu_400Regular',
  },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 10, 
    padding: 18, 
    borderRadius: 16, 
    marginTop: 20 
  },
  logoutText: { 
    fontWeight: 'bold', 
    fontSize: 16,
    fontFamily: 'Ubuntu_700Bold' 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Ubuntu_700Bold',
  },
  modalInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    fontSize: 15,
    fontFamily: 'Ubuntu_400Regular',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalButtonCancel: {
    // backgroundColor set by theme
  },
  modalButtonConfirm: {
    // backgroundColor set by theme
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Ubuntu_600SemiBold',
  },
});