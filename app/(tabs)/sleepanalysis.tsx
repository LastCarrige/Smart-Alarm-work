import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

export default function SleepAnalysis() {
  const router = useRouter();

  // Анімації для трьох хвиль
  const moveAnim1 = useRef(new Animated.Value(0)).current;
  const moveAnim2 = useRef(new Animated.Value(0)).current;
  const moveAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnim = (anim: Animated.Value, duration: number, toValue: number) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, { toValue, duration, useNativeDriver: true }),
          Animated.timing(anim, { toValue: -toValue, duration, useNativeDriver: true }),
        ])
      ).start();
    };

    createAnim(moveAnim1, 3000, 10);
    createAnim(moveAnim2, 2500, -8);
    createAnim(moveAnim3, 3500, 12);
  }, []);

  return (
    <ImageBackground 
      source={require('../../assets/images/background1.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* 1. ФІКСОВАНА ВЕРХНЯ ЧАСТИНА (НЕ СКРОЛИТЬСЯ) */}
      <View style={styles.fixedHeader}>
        {/* ЛОГОТИП */}
        <View style={styles.smallLogoContainer}>
          <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} />
          <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} />
          <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} />
          <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} />
        </View>

        {/* ЗАГОЛОВОК ТА ЛІНІЯ */}
        <View style={styles.headerContent}>
          <View style={styles.headerTopRow}>
            <TouchableOpacity 
                        style={styles.backBtnCircle} 
                        onPress={() => router.push('/wakealarm')}
                      >
                        <Text style={styles.backArrow}>‹</Text>
                      </TouchableOpacity>
            <Text style={styles.headerTitle}>Sleep analysis</Text>
          </View>
          <Image source={require('../../assets/images/Header-line.png')} style={styles.headerLine} resizeMode="stretch" />
        </View>
      </View>

      {/* 2. ТІЛО, ЯКЕ МОЖНА СКРОЛИТИ */}
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Image source={require('../../assets/images/moon-icon.png')} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statLabel}>Sleep Duration</Text>
            <Text style={styles.statValue}>3h 25m</Text>
          </View>
          <View style={styles.statCard}>
            <Image source={require('../../assets/images/quality-icon.png')} style={styles.statIcon} resizeMode="contain" />
            <Text style={styles.statLabel}>Sleep Quality</Text>
            <Text style={[styles.statValue, { color: '#69beff' }]}>82%</Text>
          </View>
        </View>

        {/* SLEEP PATTERN */}
        <View style={styles.patternCard}>
          <View style={styles.patternTitleRow}>
            <View style={styles.patternLine} />
            <Text style={styles.patternTitle}>SLEEP PATTERN</Text>
            <View style={styles.patternLine} />
          </View>
          <View style={styles.wavePlaceholder}>
            <Animated.Image 
              source={require('../../assets/images/wave1.png')} 
              style={[styles.waveImage, { transform: [{ translateX: moveAnim1 }], opacity: 0.8 }]} 
              resizeMode="stretch" 
            />
            <Animated.Image 
              source={require('../../assets/images/wave2.png')} 
              style={[styles.waveImage, { transform: [{ translateX: moveAnim2 }], opacity: 0.6, position: 'absolute' }]} 
              resizeMode="stretch" 
            />
            <Animated.Image 
              source={require('../../assets/images/wave3.png')} 
              style={[styles.waveImage, { transform: [{ translateX: moveAnim3 }], opacity: 0.4, position: 'absolute' }]} 
              resizeMode="stretch" 
            />
          </View>
        </View>

        {/* INSIGHTS */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              <Text style={{ color: '#5eead4', fontWeight: '600' }}>Good job!</Text> You got 22% deep sleep.
            </Text>
          </View>
          <View style={styles.insightBox}>
            <Text style={styles.insightText}>
              Your REM sleep was <Text style={{ color: '#d8b4fe', fontWeight: '600' }}>18%</Text> of total sleep.
            </Text>
          </View>
        </View>

        {/* ACTIONS */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.btnSettings} onPress={() => router.push('/settings')}>
            <Text style={styles.btnTextSettings}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnNewTrip} onPress={() => router.push('/plantrip')}>
            <Text style={styles.btnTextNewTrip}>New trip</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  // Контейнер для фіксованого верху
  fixedHeader: {
    paddingHorizontal: 25,
    paddingTop: 60, // Відступ для системної панелі
    backgroundColor: 'transparent',
    zIndex: 10,
  },
  headerContent: {
    marginTop: 10,
  },
  smallLogoContainer: {
    position: 'absolute',
    top: 60, 
    right: 25, 
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLayer: { position: 'absolute', width: '100%', height: '100%', resizeMode: 'contain' },
  headerTopRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  backBtnCircle: { width: 35, height: 35, borderRadius: 17.5, backgroundColor: '#071225', borderWidth: 2, borderColor: '#a7a7a7', alignItems: 'center', justifyContent: 'center' },
  backArrow: { color: 'white', fontSize: 24, marginTop: -3 },
  headerTitle: { fontSize: 30, fontWeight: 'bold', color: '#FFF' },
  headerLine: { width: '100%', height: 2, marginTop: 15 },

  // Тільки тіло скролиться
  scrollContent: { 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    paddingBottom: 40 
  },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: { flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.08)', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  statIcon: { width: 24, height: 24, marginBottom: 12 },
  statLabel: { fontSize: 12, color: 'rgba(255, 255, 255, 0.5)', marginBottom: 4 },
  statValue: { fontSize: 20, fontWeight: '700', color: '#FFF' },

  patternCard: { backgroundColor: 'rgba(57, 101, 125, 0.3)', borderRadius: 24, padding: 20, marginBottom: 30, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
  patternTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  patternTitle: { color: '#FFF', fontSize: 14, fontWeight: '600', letterSpacing: 2, marginHorizontal: 10, opacity: 0.8 },
  patternLine: { flex: 1, height: 1, backgroundColor: 'rgba(125, 231, 238, 0.3)' },
  wavePlaceholder: { height: 80, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  waveImage: { width: width * 1.2, height: 80 },

  insightsSection: { marginBottom: 30 },
  sectionTitle: { fontSize: 13, color: '#FFF', opacity: 0.6, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 15 },
  insightBox: { backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 18, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(125, 171, 251, 0.3)' },
  insightText: { color: 'rgba(255, 255, 255, 0.85)', fontSize: 14, lineHeight: 20 },

  actions: { gap: 12 },
  btnSettings: { backgroundColor: '#6188DB', paddingVertical: 18, borderRadius: 35, alignItems: 'center', elevation: 5 },
  btnNewTrip: { backgroundColor: 'rgba(59, 130, 246, 0.2)', paddingVertical: 18, borderRadius: 35, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
  btnTextSettings: { color: '#071225', fontSize: 18, fontWeight: 'bold' },
  btnTextNewTrip: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});