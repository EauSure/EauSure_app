// app/_layout.jsx
import { Tabs, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Home, Scan, Settings } from 'lucide-react-native';

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === 'login'; // Vérifie si on est sur login

    if (!user && !inAuthGroup) {
      // Pas connecté et pas sur login -> Hop, au login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Connecté et sur login -> Hop, à l'accueil
      router.replace('/');
    }
  }, [user, isLoading, segments]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#2563eb',
        tabBarStyle: { height: 60, paddingBottom: 10 },
      }}
    >
      {/* 1. Dashboard (Index) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />

      {/* 2. Scanner */}
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Ajouter',
          tabBarIcon: ({ color }) => <Scan size={24} color={color} />,
        }}
      />

      {/* 3. Settings */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color }) => <Settings size={24} color={color} />,
        }}
      />

      {/* 4. Login (Caché de la barre) */}
      <Tabs.Screen
        name="login"
        options={{
          href: null, // Ne pas afficher dans le menu du bas
          tabBarStyle: { display: 'none' }, // Cacher la barre complètement
        }}
      />
    </Tabs>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}