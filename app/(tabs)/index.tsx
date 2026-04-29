import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../../context/ThemeContext'; // 1. Імпортуємо наш контекст

const { width } = Dimensions.get('window');
const LOGO_BASE_SIZE = width * 0.95; 

export default function HomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme(); // 2. Дістаємо стан теми

  // Динамічні кольори
  const textColor = isDark ? '#ffffff' : '#071225';
  const subTextColor = isDark ? '#d1d5db' : 'rgba(7, 18, 37, 0.6)';
  const iconBg = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)';
  const btnBg = isDark ? '#AEB9D4' : '#071225';
  const btnText = isDark ? '#000' : '#FFF';

  return (
    <ImageBackground 
      // 3. Міняємо фон залежно від isDark
      source={isDark 
        ? require('../../assets/images/background1.png') 
        : require('../../assets/images/background_light.png')
      } 
      style={[styles.container, { backgroundColor: isDark ? '#071225' : '#F0F4F8' }]}
      resizeMode="cover"
    >
      <View style={styles.topNav}>
        {/* Кнопка налаштувань */}
        <TouchableOpacity 
          style={[styles.iconBtn, { backgroundColor: iconBg }]} 
          onPress={() => router.push('/settings')}
        >
          <Svg width="24" height="24" viewBox="0 0 15 15" fill="none">
              <Path d="M7.50019 1.50251C7.30135 1.50251 7.11066 1.5815 6.97006 1.7221C6.82946 1.8627 6.75047 2.0534 6.75047 2.25224C6.75047 3.52079 5.21656 4.15656 4.31915 3.25913..." 
                fill={textColor} // Колір іконки міняється
              />
          </Svg>
        </TouchableOpacity>
        
        {/* Кнопка аналітики */}
        <TouchableOpacity 
          style={[styles.iconBtn, { backgroundColor: iconBg }]} 
          onPress={() => router.push('/sleepanalysis')}
        >
          <Svg width="24" height="24" viewBox="0 0 16 16" fill="none">
            <Path d="M2 1H1V14C1 14.2652 1.10536 14.5196 1.29289 14.7071..." fill={textColor}/>
            <Path d="M15 4.5H11.5V5.5H13.295L9.5 9.295..." fill={textColor}/>
          </Svg>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.logoStack}>
          <Image 
            source={require('../../assets/images/logo_bg.png')} 
            style={styles.bgLayer} 
            resizeMode="contain"
          />

          <View style={styles.iconWrapper}>
            <Image 
              source={require('../../assets/images/logo_moon.png')} 
              style={[styles.logoLayer, styles.moonLayer]} 
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/images/logo_pin.png')} 
              style={[styles.logoLayer, styles.pinLayer]} 
              resizeMode="contain"
            />
            <Image 
              source={require('../../assets/images/logo_dot.png')} 
              style={[styles.logoLayer, styles.dotLayer]} 
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Тексти з динамічними кольорами */}
        <Text style={[styles.mainTitle, { color: textColor }]}>WayWake</Text>
        <Text style={[styles.subTitle, { color: subTextColor }]}>Smart Wake for Travelers</Text>
        
        {/* Кнопка Get Started */}
        <TouchableOpacity 
          style={[styles.startButton, { backgroundColor: btnBg }]} 
          onPress={() => router.push('/plantrip')}
        >
          <Text style={[styles.buttonText, { color: btnText }]}>Get started</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  topNav: { position: 'absolute', top: 60, right: 20, flexDirection: 'row', gap: 15 },
  iconBtn: { width: 45, height: 45, borderRadius: 22.5, alignItems: 'center', justifyContent: 'center' },
  content: { alignItems: 'center', width: '100%' },
  logoStack: { width: LOGO_BASE_SIZE, height: LOGO_BASE_SIZE, alignItems: 'center', justifyContent: 'center', marginBottom: -10, marginTop: -20 },
  bgLayer: { position: 'absolute', width: '100%', height: '100%' },
  iconWrapper: { width: LOGO_BASE_SIZE * 0.42, height: LOGO_BASE_SIZE * 0.42, alignItems: 'center', justifyContent: 'center' },
  logoLayer: { position: 'absolute' },
  moonLayer: { width: '100%', height: '100%' },
  pinLayer: { width: '65%', height: '65%' },
  dotLayer: { width: '20%', height: '20%' },
  mainTitle: { fontSize: width * 0.12, fontWeight: 'bold', marginTop: 5 },
  subTitle: { fontSize: 18, marginTop: 5, marginBottom: 80 },
  startButton: { paddingVertical: 15, paddingHorizontal: 55, borderRadius: 30, elevation: 10 },
  buttonText: { fontSize: 18, fontWeight: 'bold' },
});