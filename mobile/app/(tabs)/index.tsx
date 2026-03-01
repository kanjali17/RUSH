import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Linking, Platform, ScrollView, FlatList, Image } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Search, LocateFixed, SlidersHorizontal, X, Flame, Plus, Menu, Search as SearchIcon, Utensils, Bell } from 'lucide-react-native';
import { useApp, Popup } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RushCard } from '../../components/rush/RushCard';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { popups, currentUser, campuses } = useApp();

  const [userLocation, setUserLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('LIVE NOW');
  const [loading, setLoading] = useState(true);

  const campus = campuses.find((c) => c.id === currentUser?.campus_id);

  const filteredPopups = useMemo(() => {
    let base = popups.filter(p => !campus || p.campus_id === campus.id);
    if (activeFilter === 'LIVE NOW') {
      return base.filter(p => p.status === 'active');
    }
    if (activeFilter === 'TRENDING') {
      // Logic for trending: e.g., high attendance or specific flag
      return base.filter(p => p.attendance > 40 || p.status === 'active').sort((a, b) => (b.attendance || 0) - (a.attendance || 0));
    }
    return base;
  }, [popups, campus, activeFilter]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLoading(false);
    })();
  }, []);

  const FILTERS = ['LIVE NOW', 'TRENDING'];

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: campus?.lat || 30.2849,
          longitude: campus?.lng || -97.7341,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        region={region}
        customMapStyle={DARK_MAP_STYLE}
      >
        {filteredPopups.map((popup) => (
          <Marker
            key={popup.id}
            coordinate={{ latitude: popup.lat, longitude: popup.lng }}
            onPress={() => router.push(`/popup/${popup.id}`)}
          >
            <View style={styles.markerContainer}>
              <View style={[styles.markerGlow, activeFilter === 'TRENDING' && { backgroundColor: '#ff9f42', opacity: 0.5 }]} />
              <View style={[styles.markerCore, activeFilter === 'TRENDING' && { backgroundColor: '#ff9f42' }]} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Navigation */}
      <View style={[styles.topHeader, { paddingTop: insets.top + 10 }]}>
        <View style={styles.headerLeft}>
          <View style={styles.logoBox}>
            <Flame size={16} color="#000" fill="#000" />
          </View>
          <Text style={styles.headerLogoText}>RUSH</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={20} color="#f1f1f5" strokeWidth={2.5} />
            <View style={styles.activeDot} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Chips Overlay */}
      <View style={[styles.filterContainer, { top: insets.top + 70 }]}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
            onPress={() => setActiveFilter(filter)}
          >
            {filter === 'LIVE NOW' && <View style={styles.liveIndicator} />}
            {filter === 'TRENDING' && <MotiView animate={{ rotate: ['0deg', '10deg', '0deg'] }} transition={{ loop: true, duration: 2000 }}><Flame size={12} color={activeFilter === 'TRENDING' ? "#fff" : "#ff6b35"} fill={activeFilter === 'TRENDING' ? "#fff" : "#ff6b35"} style={{ marginRight: 4 }} /></MotiView>}
            <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom Category Overlay */}
      <MotiView
        from={{ translateY: 100, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'spring', delay: 500 }}
        style={styles.categoryOverlay}
      >
        <LinearGradient
          colors={['rgba(15,15,20,0.95)', '#000']}
          style={styles.categoryContent}
        >
          <View style={styles.handle} />

          <View style={styles.categoryMain}>
            <View style={styles.iconCircle}>
              <Utensils size={32} color="rgba(255,157,66,0.2)" />
            </View>
            <Text style={styles.categoryTitle}>SELECT A CATEGORY</Text>
            <Text style={styles.categorySubtitle}>Tap a button above to discover the best campus food spots right now.</Text>
          </View>
        </LinearGradient>
      </MotiView>

      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff6b35" />
        </View>
      )}
    </View>
  );
}

const DARK_MAP_STYLE = [
  { "elementType": "geometry", "stylers": [{ "color": "#121212" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#636363" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#121212" }] },
  { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#7a7a7a" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#636363" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#212121" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#636363" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#000000" }] }
];


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  loader: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topHeader: {
    position: 'absolute',
    left: 0, right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 100,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBox: {
    width: 28,
    height: 28,
    backgroundColor: '#ff6b35',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  headerLogoText: {
    color: '#f1f1f5',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    fontStyle: 'italic',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  filterContainer: {
    position: 'absolute',
    left: 0, right: 0,
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 10,
    zIndex: 90,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15,15,20,0.8)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterChipActive: {
    backgroundColor: '#ff6b35',
    borderColor: '#ff6b35',
  },
  filterText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  filterTextActive: {
    color: '#fff',
  },
  liveIndicator: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ff6b35',
    marginRight: 6,
  },
  categoryOverlay: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    zIndex: 110,
  },
  categoryContent: {
    paddingTop: 12,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 2,
    marginBottom: 30,
  },
  categoryMain: {
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    color: '#ff6b35',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  categorySubtitle: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 20,
  },
  markerContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markerGlow: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff6b35',
    opacity: 0.3,
  },
  markerCore: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff6b35',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b35',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  }
});
