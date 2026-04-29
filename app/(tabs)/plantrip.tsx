import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const { width } = Dimensions.get('window');

const PlanTrip = () => {
  const router = useRouter();

  return (
    <ImageBackground 
      source={require('../../assets/images/background1.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* МАЛЕНЬКЕ ЛОГО У КУТКУ (за нашим принципом накладання) */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plan Your Trip</Text>
        {/* Лінія-розділювач */}
        <Image source={require('../../assets/images/Header-line.png')} style={styles.headerLine} resizeMode="stretch" />
      </View>

      <View style={styles.inputList}>
        {/* КАРТКА 1: ВІДКИЛЛЯ */}
        <TouchableOpacity style={styles.inputCard}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Path d="M7 18L26 9L17 28L15 20L7 18Z" stroke="#9FC4FF" strokeWidth="2"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={styles.label}>From</Text>
            <Text style={styles.value}>Current location</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* КАРТКА 2: КУДИ */}
        <TouchableOpacity style={styles.inputCard}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Path d="M17.5 10C14.5 10 12 12.5 12 15.5C12 21 17.5 27 17.5 27C17.5 27 23 21 23 15.5C23 12.5 20.5 10 17.5 10ZM17.5 18C16.1 18 15 16.9 15 15.5C15 14.1 16.1 13 17.5 13C18.9 13 20 14.1 20 15.5C20 16.9 18.9 18 17.5 18Z" fill="#9FC4FF"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={styles.label}>To</Text>
            <Text style={styles.value}>Lviv Station</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>

        {/* КАРТКА 3: ЧАС ПРИБУТТЯ */}
        <TouchableOpacity style={styles.inputCard}>
          <Svg width="35" height="35" viewBox="0 0 35 35" fill="none" style={styles.icon}>
            <Circle cx="17.5" cy="17.5" r="17.5" fill="#3A4E7F"/>
            <Circle cx="17.5" cy="17.5" r="9" stroke="#9FC4FF" strokeWidth="2"/>
            <Path d="M17.5 13V17.5L20.5 20.5" stroke="#9FC4FF" strokeWidth="2" strokeLinecap="round"/>
          </Svg>
          <View style={styles.inputText}>
            <Text style={styles.label}>Arrival Time</Text>
            <Text style={styles.value}>08:10</Text>
          </View>
          <Text style={styles.arrow}>›</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.continueBtn} 
        onPress={() => router.push('/routevmap')}
      >
        <Text style={styles.btnText}>Continue</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
  },
  smallLogoContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLayer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  header: {
    marginTop: 20,
    marginBottom: 40,
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
  headerLine: {
    width: '100%',
    height: 2,
    marginTop: 20,
  },
  inputList: {
    flex: 1,
    gap: 20,
    justifyContent: 'center',
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  icon: {
    marginRight: 15,
  },
  inputText: {
    flex: 1,
  },
  label: {
    color: '#FFF',
    fontSize: 12,
    opacity: 0.5,
  },
  value: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
  arrow: {
    color: '#FFF',
    fontSize: 24,
    opacity: 0.3,
  },
  continueBtn: {
    backgroundColor: '#6188DB',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlanTrip;