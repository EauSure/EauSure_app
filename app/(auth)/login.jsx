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
import Logo from '../../assets/logo.svg'; 
import CustomModal from '../../components/CustomModal';
import Reveal from '../../components/Reveal';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '', type: 'error' });

  const { login } = useAuth();
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

  const showAlert = (title, message, type = 'error') => {
    setModalContent({ title, message, type });
    setModalVisible(true);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Champs requis', 'Veuillez saisir votre email et votre mot de passe.');
      return;
    }
    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        showAlert('Connexion échouée', 'Email ou mot de passe incorrect.');
      }
    } catch (e) {
      showAlert('Erreur', 'Une erreur technique est survenue.');
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
        onClose={() => setModalVisible(false)}
      />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled" 
          >
            <View style={styles.innerContainer}>
              
              {/* Header with logo - reveals first */}
              <Reveal delay={0}>
                <View style={styles.header}>
                  <Logo width={100} height={100} />
                  <Text style={styles.title}>Bienvenue</Text> 
                  <Text style={styles.subtitle}>Connectez-vous à EauSûre</Text>
                </View>
              </Reveal>

              {/* Form fields - reveals after 150ms */}
              <Reveal delay={150}>
                <View style={styles.form}>
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

              {/* Action buttons - reveals after 300ms */}
              <Reveal delay={300}>
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? <ActivityIndicator color="#2563EB" /> : <Text style={styles.loginButtonText}>Se connecter</Text>}
                  </TouchableOpacity>

                  <View style={styles.signupContainer}>
                    <Text style={styles.signupText}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={() => router.push('/register')}>
                      <Text style={styles.signupLink}>Créer un compte</Text>
                    </TouchableOpacity>
                  </View>
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
  innerContainer: { paddingHorizontal: 32 },
  header: { alignItems: 'center', marginBottom: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10 },
  subtitle: { fontSize: 16, color: '#CBD5E1' },
  form: { gap: 16 },
  inputContainer: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', 
    borderRadius: 20, paddingHorizontal: 20, height: 60, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
  },
  input: { flex: 1, marginLeft: 10, color: '#FFF' },
  actions: { marginTop: 40 },
  loginButton: { backgroundColor: '#FFF', padding: 18, borderRadius: 20, alignItems: 'center' },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { color: '#2563EB', fontWeight: 'bold', fontSize: 18 },
  signupContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  signupText: { color: '#CBD5E1' },
  signupLink: { color: '#FFF', fontWeight: 'bold' }
});