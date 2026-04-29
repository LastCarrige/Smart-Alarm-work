import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SleepTracking() {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Анімаційні змінні для хвиль
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;
  const moveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    const createSmoothWaveAnimation = (anim: Animated.Value, distance: number, duration: number, delay: number = 0) => {
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: distance,
            duration: duration,
            easing: Easing.bezier(0.42, 0, 0.58, 1), 
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: -distance,
            duration: duration,
            easing: Easing.bezier(0.42, 0, 0.58, 1),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    createSmoothWaveAnimation(moveAnim1, 12, 4000, 0);
    createSmoothWaveAnimation(moveAnim2, -9, 3500, 500);
    createSmoothWaveAnimation(moveAnim3, 10, 5000, 1000);

    return () => clearInterval(timer);
  }, [moveAnim1, moveAnim2, moveAnim3]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
  };

  return (
    <ImageBackground 
      source={require('../../assets/images/background1.png')} 
      style={styles.container}
    >
      {/* МАЛЕНЬКЕ ЛОГО У КУТКУ */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      {/* HEADER У НОВОМУ СТИЛІ */}
      <View style={styles.header}>
         <View style={styles.headerTopRow}>
                  <TouchableOpacity 
                    style={styles.backBtnCircle} 
                    onPress={() => router.push('/routevmap')}
                  >
                    <Text style={styles.backArrow}>‹</Text>
                  </TouchableOpacity>
                  <Text style={styles.headerTitle}>Sleep Tracking</Text>
                </View>
        <Image source={require('../../assets/images/Header-line.png')} style={styles.headerLine} resizeMode="stretch" />
      </View>

      {/* CLOCK SECTION */}
      <View style={styles.clockSection}>
        <Text style={styles.currentTimeText}>{formatTime(currentTime)}</Text>
        <Text style={styles.statusText}>Tracking Sleep...</Text>
      </View>

      {/* WAVE SECTION */}
      <View style={styles.waveContainer}>
        <Animated.Image 
          source={require('../../assets/images/wave1.png')} 
          style={[styles.waveItem, { transform: [{ translateX: moveAnim1 }] }]} 
          resizeMode="stretch" 
        />
        <Animated.Image 
          source={require('../../assets/images/wave2.png')} 
          style={[styles.waveItem, styles.waveLayer2, { transform: [{ translateX: moveAnim2 }] }]} 
          resizeMode="stretch" 
        />
        <Animated.Image 
          source={require('../../assets/images/wave3.png')} 
          style={[styles.waveItem, styles.waveLayer3, { transform: [{ translateX: moveAnim3 }] }]} 
          resizeMode="stretch" 
        />
      </View>

      {/* ARRIVAL INFO */}
      <View style={styles.arrivalInfo}>
        <Text style={styles.arrivalLabel}>Arrival In</Text>
        <Text style={styles.timeRemaining}>45 min</Text>
      </View>

      {/* STOP BUTTON */}
      <TouchableOpacity 
        style={styles.stopBtn} 
        onPress={() => router.push('/timewakeup')}
      >
        <Text style={styles.stopBtnText}>Stop</Text>
      </TouchableOpacity>

    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingHorizontal: 25, 
    paddingTop: 60, 
    paddingBottom: 30 
  },
  smallLogoContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  logoLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter',
  },
  headerSub: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.6,
    marginTop: 5,
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backBtnCircle: { 
    width: 35, 
    height: 35, 
    borderRadius: 17.5, 
    backgroundColor: '#071225', 
    borderWidth: 2, 
    borderColor: '#a7a7a7', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  backArrow: { 
    color: 'white', 
    fontSize: 24, 
    marginTop: -3 
  },
  headerLine: {
    width: '100%',
    height: 2,
    marginTop: 20,
  },
  clockSection: { 
    alignItems: 'center', 
    marginTop: 20 
  },
  currentTimeText: { 
    fontSize: 72, 
    color: 'white', 
    fontWeight: '600' 
  },
  statusText: { 
    color: 'white', 
    opacity: 0.6, 
    fontSize: 14, 
    marginTop: 10 
  },
  waveContainer: { 
    flex: 1, 
    width: '100%', 
    justifyContent: 'center', 
    alignItems: 'center', 
    position: 'relative' 
  },
  waveItem: {
    position: 'absolute',
    width: width * 1.1,
    height: 120,
  },
  waveLayer2: {
    opacity: 0.7,
    height: 100,
  },
  waveLayer3: {
    opacity: 0.5,
    height: 80,
  },
  arrivalInfo: { 
    alignItems: 'center', 
    marginBottom: 30 
  },
  arrivalLabel: { 
    color: 'white', 
    opacity: 0.7, 
    fontSize: 14 
  },
  timeRemaining: { 
    color: '#7BB8E9', 
    fontSize: 32, 
    fontWeight: 'bold' 
  },
  stopBtn: { 
    backgroundColor: '#6188DB', 
    width: '100%', 
    paddingVertical: 18, 
    borderRadius: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  stopBtnText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});