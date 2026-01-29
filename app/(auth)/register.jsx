import { useState , useCallback } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  KeyboardAvoidingView, Platform, ActivityIndicator, 
  ScrollView, StyleSheet
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { Feather } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';

import WaterBackground from '../../components/WaterBackground';
import CustomModal from '../../components/CustomModal';
import Reveal from '../../components/Reveal';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });

  const { register } = useAuth(); 
  const router = useRouter();

   useFocusEffect(
      useCallback(() => {
        setEmail('');
        setPassword('');
        setShowPassword(false);
        setIsLoading(false);
        setModalVisible(false);
      }, [])
    );

  const showAlert = (title, message) => {
    setModalContent({ title, message });
    setModalVisible(true);
  };

  const handleRegister = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!name || !email || !password) {
      showAlert('Attention', 'Veuillez remplir tous les champs.');
      return;
    }

    if (!emailRegex.test(email)) {
      showAlert('Email invalide', 'Veuillez entrer une adresse email valide (ex: nom@domaine.com).');
      return;
    }

    if (password.length < 6) {
      showAlert('Mot de passe court', 'Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(email, password, name);
      if (result.success) {
        setModalContent({
          title: "Succès d'inscription",
          message: "Votre compte a été créé avec succès ! Vous pouvez maintenant vous connecter.",
          type: "success"
        });
        setModalVisible(true);
      } else {
        const emailTaken = result.msg?.toLowerCase().includes('already exists') || 
                           result.msg?.toLowerCase().includes('utilisé');
        
        showAlert(
          emailTaken ? 'Email déjà pris' : 'Erreur',
          emailTaken ? 'Cette adresse email est déjà enregistrée.' : result.msg
        );
      }
    } catch (e) {
      showAlert('Erreur', 'Connexion impossible au serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}> 
      <WaterBackground />
      <StatusBar style="light" />
      <CustomModal 
        visible={modalVisible}
        title={modalContent.title}
        message={modalContent.message}
        type={modalContent.type}
        onClose={() => {
          setModalVisible(false);
          if (modalContent.type === 'success') {
            router.replace('/login');
          }
        }}
      />
      <SafeAreaView style={{ flex: 1 }}>
        
        {/* Back button - reveals first */}
        <Reveal delay={0}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
        </Reveal>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.innerContainer}>
              
              {/* Header - reveals after 100ms */}
              <Reveal delay={100}>
                <View style={styles.header}>
                  <Text style={styles.title}>Inscription</Text> 
                  <Text style={styles.subtitle}>Rejoignez le réseau EauSûre</Text>
                </View>
              </Reveal>

              {/* Form - reveals after 200ms */}
              <Reveal delay={200}>
                <View style={styles.form}>
                  <View style={styles.inputContainer}>
                    <Feather name="user" size={20} color="#E2E8F0" />
                    <TextInput
                      style={styles.input}
                      placeholder="Nom complet"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Feather name="mail" size={20} color="#E2E8F0" />
                    <TextInput
                      style={styles.input}
                      placeholder="Adresse email"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Feather name="lock" size={20} color="#E2E8F0" />
                    <TextInput
                      style={styles.input}
                      placeholder="Mot de passe"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Feather name={showPassword ? "eye" : "eye-off"} size={20} color="#E2E8F0" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Reveal>

              {/* Action button - reveals after 300ms */}
              <Reveal delay={300}>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                  >
                    {isLoading ? <ActivityIndicator color="#2563EB" /> : <Text style={styles.loginButtonText}>S'inscrire</Text>}
                  </TouchableOpacity>
                </View>
              </Reveal>

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', paddingBottom: 40 },
  backButton: { marginLeft: 20, marginTop: 10 },
  innerContainer: { paddingHorizontal: 32 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF' },
  subtitle: { fontSize: 16, color: '#CBD5E1', marginTop: 8 },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20, paddingHorizontal: 20, height: 60, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  input: { flex: 1, marginLeft: 10, color: '#FFF' },
  actions: { marginTop: 40 },
  loginButton: { backgroundColor: '#FFF', padding: 18, borderRadius: 20, alignItems: 'center' },
  loginButtonText: { color: '#2563EB', fontWeight: 'bold', fontSize: 18 },
  loginButtonDisabled: { opacity: 0.7 }
});