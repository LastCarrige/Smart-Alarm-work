import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Dimensions, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

export default function RouteMap() {
  const router = useRouter();
  const [location, setLocation] = useState<any>(null);
  const [destination, setDestination] = useState<any>(null);
  const [distance, setDistance] = useState<string>('—');

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      let curLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: curLocation.coords.latitude,
        longitude: curLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  const handleMapPress = (e: any) => {
    const coords = e.nativeEvent.coordinate;
    setDestination(coords);
    if (location) {
      const d = calculateDistance(location.latitude, location.longitude, coords.latitude, coords.longitude);
      setDistance(d);
    }
  };

  return (
    <ImageBackground source={require('../../assets/images/background1.png')} style={styles.container}>
      
      {/* МАЛЕНЬКЕ ЛОГО У КУТКУ */}
      <View style={styles.smallLogoContainer}>
        <Image source={require('../../assets/images/logo_bg.png')} style={styles.logoLayer} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_moon.png')} style={[styles.logoLayer, { width: '60%', height: '60%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_pin.png')} style={[styles.logoLayer, { width: '40%', height: '40%' }]} resizeMode="contain" />
        <Image source={require('../../assets/images/logo_dot.png')} style={[styles.logoLayer, { width: '15%', height: '15%' }]} resizeMode="contain" />
      </View>

      {/* HEADER З КНОПКОЮ НАЗАД */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity 
            style={styles.backBtnCircle} 
            onPress={() => router.push('/plantrip')}
          >
            <Text style={styles.backArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route Map</Text>
        </View>
        <Image source={require('../../assets/images/Header-line.png')} style={styles.headerLine} resizeMode="stretch" />
      </View>

      {/* MAP */}
      <View style={styles.mapWrapper}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={location}
          showsUserLocation={true}
          onPress={handleMapPress}
          customMapStyle={darkMapStyle}
        >
          {destination && <Marker coordinate={destination} pinColor="#6188DB" />}
        </MapView>
      </View>

      {/* INFO CARDS */}
      <View style={styles.infoCards}>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Distance</Text>
          <Text style={styles.infoValue}>{distance} km</Text>
        </View>
        <View style={styles.infoDivider} />
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Arrival</Text>
          <Text style={styles.infoValue}>
            {distance !== '—' ? `~ ${(Number(distance) * 1.5).toFixed(0)} min` : '-- : --'}
          </Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.sleepBtn} 
        onPress={() => router.push('/sleeptracking')}
      >
        <Text style={styles.sleepBtnText}>Start sleep mode</Text>
      </TouchableOpacity>

    </ImageBackground>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#242f3e" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#746855" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#242f3e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#38414e" }] }
];

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
  mapWrapper: { 
    flex: 1, 
    borderRadius: 30, 
    overflow: 'hidden', 
    borderWidth: 1, 
    borderColor: 'rgba(255,255,255,0.1)' 
  },
  map: { 
    width: '100%', 
    height: '100%' 
  },
  infoCards: { 
    flexDirection: 'row', 
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    borderRadius: 25, 
    padding: 20, 
    marginVertical: 20, 
    justifyContent: 'space-around', 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoItem: { 
    alignItems: 'center' 
  },
  infoLabel: { 
    color: '#FFF', 
    opacity: 0.5, 
    fontSize: 12 
  },
  infoValue: { 
    color: '#FFF', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  infoDivider: { 
    width: 1, 
    height: 30, 
    backgroundColor: 'rgba(255,255,255,0.2)' 
  },
  sleepBtn: { 
    backgroundColor: '#6188DB', 
    paddingVertical: 18, 
    borderRadius: 30, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  sleepBtnText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold' 
  }
});