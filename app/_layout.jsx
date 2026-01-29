// app/_layout.jsx
import { Slot, useRouter, useSegments } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useFonts, Ubuntu_400Regular, Ubuntu_500Medium, Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

// Import the service
import { OnboardingService } from '../utils/storage';

function RootLayoutNav() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  const [isAppReady, setIsAppReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(false);

  // Load Fonts
  const [fontsLoaded] = useFonts({
    Ubuntu_400Regular,
    Ubuntu_500Medium,
    Ubuntu_700Bold,
  });

  // Check Storage on Mount
  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const seen = await OnboardingService.checkIfSeen();
        setHasSeenOnboarding(seen);
      } catch (error) {
        console.error("Storage error", error);
      } finally {
        setIsAppReady(true);
      }
    };
    checkOnboarding();
  }, []);

  // Main Routing Logic
  useEffect(() => {
    // Block until everything is loaded
    if (isAuthLoading || !isAppReady || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboardingGroup = segments[0] === '(onboarding)';

    // Logic Tree
    if (!hasSeenOnboarding) {
      // 1. New User -> Go to Onboarding
      if (!inOnboardingGroup) {
        router.replace('/(onboarding)');
      }
    } else if (!user && !inAuthGroup) {
      // 2. Existing User, Not Logged In -> Go to Login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // 3. Logged In User -> Go to Home
      router.replace('/');
    }
  }, [user, isAuthLoading, segments, isAppReady, hasSeenOnboarding, fontsLoaded]);

  // Unified Loading Screen
  if (isAuthLoading || !isAppReady || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}