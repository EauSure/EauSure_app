import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { Feather } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

// 1. Import the new Background
import WaterBackground from '../components/WaterBackground';
import Logo from '../assets/logo.svg'; 

const { width } = Dimensions.get('window');

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Incomplet', 'Veuillez remplir tous les champs.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        Alert.alert('Erreur', result.msg);
      }
    } catch (e) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // We remove the backgroundColor here so Skia is visible
    <View style={styles.container}> 
      
      {/* 2. Add the Background Component here */}
      <WaterBackground />

      <StatusBar style="light" /> {/* Changed to light for contrast */}
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView 
            style={{ flex: 1 }}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled" 
            showsVerticalScrollIndicator={false}
          >
            
            <View style={styles.innerContainer}>
              {/* --- Header --- */}
              <View style={styles.header}>
                <View style={styles.logoContainer}>
                  <Logo width={120} height={120} />
                </View>
                {/* Changed text color to white for better contrast on blue */}
                <Text style={styles.title}>Bienvenue</Text> 
                <Text style={styles.subtitle}>Connectez-vous à EauSûre</Text>
              </View>

              {/* --- Form --- */}
              <View style={styles.form}>
                
                {/* Email - Glassmorphism style */}
                <View style={styles.inputContainer}>
                  <Feather name="mail" size={20} color="#E2E8F0" />
                  <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    placeholderTextColor="#94A3B8"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>

                {/* Password - Glassmorphism style */}
                <View style={styles.inputContainer}>
                  <Feather name="lock" size={20} color="#E2E8F0" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor="#94A3B8"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                </View>

                <TouchableOpacity style={styles.forgotButton}>
                  <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
                </TouchableOpacity>
              </View>

              {/* --- Actions --- */}
              <View style={styles.actions}>
                <TouchableOpacity 
                  style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#2563EB" />
                  ) : (
                    <Text style={styles.loginButtonText}>Se connecter</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Pas encore de compte ? </Text>
                  <TouchableOpacity>
                    <Text style={styles.signupLink}>Créer un compte</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // No background color here!
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', 
    paddingTop: 80, 
    paddingBottom: 40,
  },
  innerContainer: {
    paddingHorizontal: 32,
    width: '100%',
  },
  
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 50,
  },
  logoContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#CBD5E1', // Light gray text
    fontWeight: '500',
  },

  // Form
  form: {
    gap: 16, 
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Glass Effect (Semi-transparent white)
    backgroundColor: 'rgba(255, 255, 255, 0.15)', 
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20, // More rounded
    paddingHorizontal: 20,
    height: 60,
  },
  input: {
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    color: '#FFFFFF', // White input text
    fontWeight: '500',
    height: '100%',
  },
  forgotButton: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  forgotText: {
    color: '#93C5FD', // Light Blue
    fontWeight: '600',
    fontSize: 14,
  },

  // Actions
  actions: {
    marginTop: 40,
  },
  loginButton: {
    backgroundColor: '#FFFFFF', // White button for contrast
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#2563EB', // Blue text on white button
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
  signupText: {
    color: '#CBD5E1',
  },
  signupLink: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});