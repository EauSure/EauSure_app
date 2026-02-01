import { Tabs } from 'expo-router';
import { View, Platform } from 'react-native';
import { Home, Scan, Settings } from 'lucide-react-native';

// Couleurs centralisées pour une maintenance facile
const COLORS = {
  primary: '#0ea5e9',
  inactive: '#94a3b8',
  bg: '#f8fafc',
};

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'Ubuntu_500Medium',
          fontSize: 11,
          marginTop: -4,
          marginBottom: Platform.OS === 'ios' ? 0 : 4,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.inactive,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 16,
          right: 16,
          elevation: 8,
          backgroundColor: '#ffffff',
          borderRadius: 24,
          height: Platform.OS === 'ios' ? 80 : 70,
          borderTopWidth: 0,
          shadowColor: '#0f172a',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.12,
          shadowRadius: 16,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 20 : 8,
          paddingBottom: Platform.OS === 'android' ? 8 : 20,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: 2,
            }}>
              <Home size={24} color={color} strokeWidth={focused ? 2.5 : 2} />
              {focused && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: color,
                  marginTop: 4,
                  position: 'absolute',
                  bottom: -14,
                }} />
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              top: Platform.OS === 'ios' ? -28 : -32,
              width: 64,
              height: 64,
              borderRadius: 32,
              backgroundColor: COLORS.primary,
              justifyContent: 'center',
              alignItems: 'center',
              shadowColor: COLORS.primary,
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 12,
              borderWidth: 4,
              borderColor: '#ffffff',
            }}>
              <Scan size={28} color="#fff" strokeWidth={2.5} />
            </View>
          ),
          tabBarLabel: () => null, // Hide label for center button
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Réglages',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              top: 2,
            }}>
              <Settings size={24} color={color} strokeWidth={focused ? 2.5 : 2}  />
              {focused && (
                <View style={{
                  width: 4,
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: color,
                  marginTop: 4,
                  position: 'absolute',
                  bottom: -14,
                }} />
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}