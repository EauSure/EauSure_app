// components/OnboardingSlide.jsx
import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { VideoView, useVideoPlayer } from 'expo-video';
import { BlurView } from 'expo-blur'; 
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

export default function OnboardingSlide({ item, isFocused, pageWidth, pageHeight }) {
  const videoRef = useRef(null);

  const player = useVideoPlayer(item.videoUri, (player) => {
    player.loop = true;
    player.muted = true;
  });

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const subheadOpacity = useSharedValue(0);
  const subheadTranslateY = useSharedValue(15);
  const descOpacity = useSharedValue(0);
  const descTranslateY = useSharedValue(10);
  
  // Controls the blur layer opacity (0 = clear video, 1 = blurred)
  const blurOpacity = useSharedValue(1); 

  useEffect(() => {
    if (!player) return;

    if (isFocused) {
      // 1. Play Video
      player.play();

      // 2. Fade OUT the blur (reveal video) slowly
      blurOpacity.value = withTiming(0, { duration: 600, easing: Easing.out(Easing.quad) });

      // 3. Animate Text In (Slower, more cinematic durations)
      titleOpacity.value = 0; titleTranslateY.value = 20;
      subheadOpacity.value = 0; subheadTranslateY.value = 15;
      descOpacity.value = 0; descTranslateY.value = 10;

      titleOpacity.value = withDelay(300, withTiming(1, { duration: 800 }));
      titleTranslateY.value = withDelay(300, withSpring(0, { damping: 14, stiffness: 70 }));

      subheadOpacity.value = withDelay(500, withTiming(1, { duration: 800 }));
      subheadTranslateY.value = withDelay(500, withSpring(0, { damping: 14, stiffness: 70 }));

      descOpacity.value = withDelay(700, withTiming(1, { duration: 900 }));
      descTranslateY.value = withDelay(700, withSpring(0, { damping: 14, stiffness: 70 }));
      
    } else {
      // 1. Pause Video (Saves GPU, we are now blurring a static frame)
      player.pause();

      // 2. Fade IN the blur (hide video details)
      blurOpacity.value = withTiming(1, { duration: 500 });

      // 3. Reset Text
      titleOpacity.value = 0;
      subheadOpacity.value = 0;
      descOpacity.value = 0;
    }
  }, [isFocused, player]);

  const blurContainerStyle = useAnimatedStyle(() => ({
    opacity: blurOpacity.value,
  }));

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
    transform: [{ translateY: descTranslateY.value }],
  }));

  return (
    <View style={[styles.container, { width: pageWidth, height: pageHeight }]}>
      <View style={styles.backgroundContainer}>
        {/* Video Layer */}
        <View style={StyleSheet.absoluteFill}>
          <VideoView
            ref={videoRef}
            style={StyleSheet.absoluteFill}
            player={player}
            contentFit="cover"
            nativeControls={false}
          />
        </View>

        {/* Blur Layer - Fades in when not focused */}
        <Animated.View style={[StyleSheet.absoluteFill, blurContainerStyle]}>
           <BlurView 
              intensity={Platform.OS === 'android' ? 20 : 30} 
              tint="dark"
              style={StyleSheet.absoluteFill} 
              // experimentalBlurMethod="dime"  <-- REMOVED to fix crash
           />
           {/* Fallback dark overlay for consistency if blur is weak on Android */}
           <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(15, 23, 42, 0.4)' }]} />
        </Animated.View>

        {/* Gradient Layer (Always on top for text readability) */}
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.6)', 'rgba(15, 23, 42, 0.95)']}
          locations={[0.4, 0.8, 1]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </View>

      <View style={styles.contentContainer}>
        <Animated.Text style={[styles.title, titleStyle]}>{item.title}</Animated.Text>
        <Animated.Text style={[styles.subhead, subheadStyle]}>{item.subhead}</Animated.Text>
        <Animated.Text style={[styles.description, descStyle]}>{item.description}</Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'flex-end',
    overflow: 'hidden', 
    backgroundColor: '#0f172a',
    
  },
  backgroundContainer: { ...StyleSheet.absoluteFillObject },
  contentContainer: { paddingHorizontal: 24, paddingBottom: 160 },
  title: { fontFamily: 'Ubuntu_700Bold', fontSize: 32, color: '#FFFFFF', marginBottom: 8, lineHeight: 38 },
  subhead: {
    fontFamily: 'Ubuntu_500Medium',
    fontSize: 18,
    color: '#38bdf8',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  description: { fontFamily: 'Ubuntu_400Regular', fontSize: 16, color: '#cbd5e1', lineHeight: 24 },
});