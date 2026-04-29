import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const WakeAlarm = () => {
  const router = useRouter();

  const chartData = [
    { time: "00:00", value: 30, color: "#2563EB" },
    { time: "01:00", value: 50, color: "#60A5FA" },
    { time: "02:00", value: 20, color: "#2563EB" },
    { time: "03:00", value: 40, color: "#5EEAD4" },
    { time: "03:30", value: 85, color: "#9333EA" },
  ];

  const sleepStages = [
    { id: "awake", label: "Awake", percentage: 8, color: "#5EEAD4" },
    { id: "rem", label: "Rem", percentage: 18, color: "#9333EA" },
    { id: "light", label: "Light", percentage: 52, color: "#60A5FA" },
    { id: "deep", label: "Deep", percentage: 22, color: "#2563EB" },
  ];

  return (
    <ImageBackground 
      source={require('../../assets/images/background1.png')} 
      style={styles.container}
      resizeMode="cover"
    >
      {/* МАЛЕНЬКЕ ЛОГО У КУТКУ */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Wake alarm</Text>
        {/* Лінія-розділювач */}
        <Image source={require('../../assets/images/Header-line.png')} style={styles.headerLine} resizeMode="stretch" />
      </View>

      {/* CHART SECTION */}
      <View style={styles.chartCard}>
        <View style={styles.chartContent}>
          {chartData.map((item, index) => (
            <View key={index} style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { height: item.value, backgroundColor: item.color }
                ]} 
              />
              <Text style={styles.barLabel}>{item.time}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* STAGES LIST */}
      <View style={styles.stagesList}>
        <Text style={styles.sectionTitle}>Sleep Stages</Text>
        {sleepStages.map((stage) => (
          <View key={stage.id} style={styles.stageCard}>
            <View style={styles.stageLeft}>
              <View style={[styles.dotGlow, { backgroundColor: stage.color }]} />
              <View style={[styles.dotCore, { backgroundColor: stage.color }]} />
              <Text style={styles.stageText}>{stage.label}</Text>
            </View>
            <Text style={styles.percentageText}>{stage.percentage}%</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity 
        style={styles.continueBtn} 
        onPress={() => router.push('/sleepanalysis')}
      >
        <Text style={styles.btnText}>View Analysis</Text>
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
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Inter',
  },
  headerLine: {
    width: '100%',
    height: 2,
    marginTop: 20,
  },
  chartCard: {
    height: 160,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    marginBottom: 20,
  },
  chartContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 15,
  },
  barContainer: { alignItems: 'center', width: 40 },
  bar: { width: 20, borderRadius: 6 },
  barLabel: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 10, marginTop: 10, position: 'absolute', bottom: -18 },
  
  stagesList: {
    flex: 1,
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#FFF',
    opacity: 0.6,
    marginBottom: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stageCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: 16,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 12,
  },
  stageLeft: { flexDirection: 'row', alignItems: 'center' },
  dotCore: { width: 8, height: 8, borderRadius: 4, marginRight: 15 },
  dotGlow: { position: 'absolute', width: 20, height: 20, borderRadius: 10, left: -6, opacity: 0.3 },
  stageText: { color: '#FFF', fontSize: 16, fontWeight: '400' },
  percentageText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  continueBtn: {
    backgroundColor: '#6188DB',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
    marginTop: 20,
  },
  btnText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WakeAlarm;