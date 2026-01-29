// components/OnboardingSlide.jsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withDelay, 
  withSpring, 
  withTiming, 
  interpolate,
  Extrapolation
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function OnboardingSlide({ item, isFocused }) {
  // Animation Values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(14);
  
  const subheadOpacity = useSharedValue(0);
  const subheadTranslateY = useSharedValue(10);
  
  const descOpacity = useSharedValue(0);
  const descMask = useSharedValue(0); // 0 to 1 progress

  useEffect(() => {
    if (isFocused) {
      // Reset values instantly
      titleOpacity.value = 0;
      titleTranslateY.value = 14;
      subheadOpacity.value = 0;
      subheadTranslateY.value = 10;
      descOpacity.value = 0;
      descMask.value = 0;

      // Trigger Animations sequence
      titleOpacity.value = withTiming(1, { duration: 300 });
      titleTranslateY.value = withSpring(0, { damping: 12 });

      subheadOpacity.value = withDelay(80, withTiming(1, { duration: 240 }));
      subheadTranslateY.value = withDelay(80, withTiming(0, { duration: 240 }));

      descOpacity.value = withDelay(140, withTiming(1, { duration: 500 }));
      descMask.value = withDelay(140, withTiming(1, { duration: 650 }));
    }
  }, [isFocused]);

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subheadStyle = useAnimatedStyle(() => ({
    opacity: subheadOpacity.value,
    transform: [{ translateY: subheadTranslateY.value }],
  }));

  const descStyle = useAnimatedStyle(() => ({
    opacity: descOpacity.value,
    maxWidth: interpolate(descMask.value, [0, 1], [0, width - 48], Extrapolation.CLAMP)
  }));

  return (
    <View style={styles.container}>
      {/* Background Video Layer */}
      <View style={styles.backgroundContainer}>
        <Video
          source={item.videoUri}
          style={StyleSheet.absoluteFill}
          resizeMode={ResizeMode.COVER}
          isLooping
          isMuted
          shouldPlay={isFocused} // Only play if active slide
          posterSource={item.fallbackImage}
          usePoster={true} // Critical for avoiding black flash on Android
          posterStyle={{ resizeMode: 'cover' }}
        />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.6)', 'rgba(15, 23, 42, 0.95)']}
          style={StyleSheet.absoluteFill}
          locations={[0.4, 0.8, 1]}
        />
      </View>

      {/* Text Content Layer */}
      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.title, titleStyle]}>
          {item.title}
        </Animated.Text>
        
        <Animated.Text style={[styles.subhead, subheadStyle]}>
          {item.subhead}
        </Animated.Text>
        
        <Animated.Text style={[styles.description, descStyle]}>
          {item.description}
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width, height, justifyContent: 'flex-end' },
  backgroundContainer: { ...StyleSheet.absoluteFillObject },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 160, 
  },
  title: {
    fontFamily: 'Ubuntu_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 38,
  },
  subhead: {
    fontFamily: 'Ubuntu_500Medium',
    fontSize: 18,
    color: '#38bdf8',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: {
    fontFamily: 'Ubuntu_400Regular',
    fontSize: 16,
    color: '#cbd5e1',
    lineHeight: 24,
  },
});