// app/settings.jsx
import { View, Text, TouchableOpacity, Alert, Switch } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { LogOut, Globe, Bell } from 'lucide-react-native';

export default function SettingsPage() {
  const { logout, user } = useAuth();
  const [isFr, setIsFr] = useState(true);
  
  return (
    <View className="flex-1 bg-slate-50 p-4 pt-12">
      <Text className="text-2xl font-bold text-blue-900 mb-8">Paramètres</Text>

      <View className="bg-white rounded-xl overflow-hidden mb-6">
        <View className="p-4 border-b border-slate-100 flex-row justify-between items-center">
            <View className="flex-row items-center gap-3">
                <Globe size={20} color="#64748b"/>
                <Text className="text-lg">Langue ({isFr ? 'FR' : 'EN'})</Text>
            </View>
            <Switch value={isFr} onValueChange={setIsFr} />
        </View>

        <TouchableOpacity 
            className="p-4 flex-row items-center gap-3 bg-red-50"
            onPress={logout}
        >
            <LogOut size={20} color="#ef4444" />
            <Text className="text-red-600 font-bold text-lg">Se déconnecter</Text>
        </TouchableOpacity>
      </View>
      
      <Text className="text-center text-slate-400">Connecté en tant que : {user?.email}</Text>
    </View>
  );
}