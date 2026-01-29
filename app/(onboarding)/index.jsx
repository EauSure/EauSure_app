// app/(onboarding)/index.jsx
import React, { useRef, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming 
} from 'react-native-reanimated';

import { OnboardingService } from '../../utils/storage';
import OnboardingSlide from '../../components/OnboardingSlide';
import { SLIDES } from '../../data/slides';

const { width } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Button Animations
  const skipScale = useSharedValue(1);
  const continueScale = useSharedValue(1);

  const onViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      if (index !== null && index !== undefined) {
        setCurrentIndex(index);
        if (Platform.OS !== 'web') Haptics.selectionAsync();
      }
    }
  }, []);

  const finishOnboarding = async () => {
    await OnboardingService.markAsSeen();
    
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    // Redirect to login
    router.replace('/login');
  };

  const handleNext = () => {
    // Button press animation
    continueScale.value = withTiming(0.95, { duration: 100 }, () => {
      continueScale.value = withTiming(1);
    });

    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      finishOnboarding();
    }
  };

  const handleSkip = () => {
    skipScale.value = withTiming(0.9, { duration: 100 }, () => {
      skipScale.value = withTiming(1);
    });
    finishOnboarding();
  };

  const continueButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: continueScale.value }],
  }));

  const skipButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: skipScale.value }],
    opacity: withTiming(1, { duration: 180 }),
  }));

  // Dev Reset: Long press dots to reset
  const handleDevReset = async () => {
    await OnboardingService.resetOnboarding();
    alert('Dev: Onboarding reset. Restart app to see it again.');
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        renderItem={({ item, index }) => (
          <OnboardingSlide item={item} isFocused={index === currentIndex} />
        )}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={2} // Memory optimization for video
      />

      {/* Top Right Skip */}
      <Animated.View style={[styles.skipContainer, skipButtonStyle]}>
        <TouchableOpacity onPress={handleSkip} hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Bottom Controls */}
      <View style={styles.bottomControls}>
        
        {/* Pagination Dots */}
        <TouchableOpacity onLongPress={handleDevReset} delayLongPress={2000} activeOpacity={1}>
          <View style={styles.pagination}>
            {SLIDES.map((_, index) => {
              const isActive = index === currentIndex;
              return (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { 
                      width: isActive ? 18 : 6, 
                      backgroundColor: isActive ? '#3b82f6' : '#475569' 
                    }
                  ]}
                />
              );
            })}
          </View>
        </TouchableOpacity>

        {/* Continue Button */}
        <Animated.View style={[styles.buttonContainer, continueButtonStyle]}>
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.9}>
            <Text style={styles.buttonText}>
              {currentIndex === SLIDES.length - 1 ? "Get started" : "Continue"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  skipContainer: { position: 'absolute', top: 60, right: 30, zIndex: 10 },
  skipText: { color: 'rgba(255,255,255,0.7)', fontFamily: 'Ubuntu_500Medium', fontSize: 16 },
  bottomControls: { position: 'absolute', bottom: 50, left: 24, right: 24, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pagination: { flexDirection: 'row', gap: 8, height: 20, alignItems: 'center' },
  dot: { height: 6, borderRadius: 3 },
  buttonContainer: { shadowColor: '#3b82f6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  button: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 30 },
  buttonText: { color: '#FFF', fontFamily: 'Ubuntu_700Bold', fontSize: 16 },
});