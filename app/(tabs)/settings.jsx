import { View, Text, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { LogOut, Globe, User } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsPage() {
  const { logout, user } = useAuth();
  const [isFr, setIsFr] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      <View style={styles.section}>
        <View style={styles.row}>
            <View style={styles.rowLeft}>
                <Globe size={22} color="#64748b"/>
                <Text style={styles.rowText}>Langue ({isFr ? 'FR' : 'EN'})</Text>
            </View>
            <Switch 
              value={isFr} 
              onValueChange={setIsFr} 
              trackColor={{ false: "#CBD5E1", true: "#93C5FD" }}
              thumbColor={isFr ? "#2563EB" : "#F4F4F5"}
            />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <LogOut size={22} color="#ef4444" />
            <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        <User size={16} color="#94A3B8" />
        <Text style={styles.footerText}>Connecté : {user?.email}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1E293B', marginBottom: 32, marginTop: 10 },
  section: { backgroundColor: '#FFF', borderRadius: 24, overflow: 'hidden', elevation: 2, shadowOpacity: 0.05 },
  row: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', 
    padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' 
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowText: { fontSize: 16, color: '#334155', fontWeight: '500' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20, backgroundColor: '#FEF2F2' },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16 },
  footer: { marginTop: 'auto', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 },
  footerText: { color: '#94A3B8', fontSize: 14 }
});