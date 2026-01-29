import React, { useEffect, useRef } from 'react';
import { 
  Modal, View, Text, TouchableOpacity, StyleSheet, 
  ImageBackground, Animated, Dimensions 
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { height } = Dimensions.get('window');

export default function CustomModal({ visible, title, message, onClose, type = 'error' }) {
  const translateY = useRef(new Animated.Value(height)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(
        type === 'error' 
          ? Haptics.NotificationFeedbackType.Error 
          : Haptics.NotificationFeedbackType.Success
      );

      translateY.setValue(height);
      opacity.setValue(0);

      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 35,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleClose = () => {
    Haptics.selectionAsync();
    
    Animated.timing(translateY, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal transparent visible={visible} animationType="none">
      <View style={styles.container}>
        
        {/* FOND : Ultra Blur + Noise */}
        <Animated.View style={[StyleSheet.absoluteFill, { opacity }]}>
          <BlurView intensity={140} tint="dark" style={StyleSheet.absoluteFill}>
            <ImageBackground 
              source={{ uri: 'https://www.transparenttextures.com/patterns/stardust.png' }} 
              imageStyle={styles.noiseImage}
              style={StyleSheet.absoluteFill}
            />
          </BlurView>
        </Animated.View>

        {/* MODALE : Compact Horizontal Layout */}
        <Animated.View style={[
          styles.modalWrapper, 
          { transform: [{ translateY }] }
        ]}>
          <View style={styles.modalCard}>
            
            {/* Icon on the left */}
            <View style={[
              styles.iconCircle, 
              { backgroundColor: type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(37, 99, 235, 0.1)' }
            ]}>
              <Feather 
                name={type === 'error' ? "x-circle" : "check-circle"} 
                size={32} 
                color={type === 'error' ? "#F87171" : "#3B82F6"} 
              />
            </View>

            {/* Message in the middle */}
            <View style={styles.textContainer}>
              <Text style={styles.message}>{message}</Text>
            </View>

            {/* Button on the right */}
            <TouchableOpacity 
              activeOpacity={0.7} 
              style={[styles.button, { backgroundColor: type === 'error' ? '#EF4444' : '#2563EB' }]} 
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>OK</Text>
            </TouchableOpacity>

          </View>
        </Animated.View>

      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noiseImage: {
    opacity: 0.22,
    resizeMode: 'repeat',
  },
  modalWrapper: {
    width: '90%',
    maxWidth: 400,
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.9)',
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    flexShrink: 0,
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  message: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '600',
    lineHeight: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    flexShrink: 0,
    minWidth: 70,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
    letterSpacing: 0.3,
  },
});