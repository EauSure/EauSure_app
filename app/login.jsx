// app/login.js (ou app/(auth)/login.js si vous groupez)
import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
// Importez NativeWind ou vos styles ici

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    const result = await login(email, password);
    if (!result.success) {
      Alert.alert('Erreur', result.msg);
    }
    // La redirection est gérée automatiquement par le _layout
  };

  return (
    <View className="flex-1 justify-center p-6 bg-slate-50">
      <Text className="text-2xl font-bold text-center mb-8 text-blue-900">
        Connexion EauSure
      </Text>

      <TextInput
        className="bg-white p-4 rounded-xl mb-4 border border-slate-200"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        className="bg-white p-4 rounded-xl mb-6 border border-slate-200"
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity 
        className="bg-blue-600 p-4 rounded-xl items-center"
        onPress={handleLogin}
      >
        <Text className="text-white font-bold text-lg">Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
}