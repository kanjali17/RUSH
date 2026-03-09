import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, TextInput, Linking, Platform, ScrollView, FlatList, Image } from 'react-native';
import MapView, { Marker, UrlTile, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Search, LocateFixed, SlidersHorizontal, X, Flame, Plus, Menu, Search as SearchIcon, Utensils, Bell } from 'lucide-react-native';
import { useApp, Quest } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RushCard } from '../../components/rush/RushCard';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { TutorialOverlay } from '../../components/rush/TutorialOverlay';
import { HelpCircle } from 'lucide-react-native';

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { quests, currentUser, campuses } = useApp();

  const [userLocation, setUserLocation] = useState<any>(null);
  const [region, setRegion] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState('LIVE NOW');
  const [loading, setLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);

  const campus = campuses.find((c) => c.campus_id === currentUser?.campus_id);

  const filteredQuests = useMemo(() => {
    let base = quests.filter(q => !campus || q.campus_id === campus.campus_id);
    if (activeFilter === 'LIVE NOW') {
      return base.filter(q => q.is_live);
    }
    if (activeFilter === 'TRENDING') {
      return base.sort((a, b) => (b.stats?.engagement_score || 0) - (a.stats?.engagement_score || 0));
    }
    return base;
  }, [quests, campus, activeFilter]);

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
          latitude: campus?.location.lat || 30.2849,
          longitude: campus?.location.lng || -97.7341,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        region={region}
        customMapStyle={DARK_MAP_STYLE}
      >
        {filteredQuests.map((quest) => (
          <Marker
            key={quest.quest_id}
            coordinate={{ latitude: quest.location?.lat || 0, longitude: quest.location?.lng || 0 }}
            onPress={() => router.push(`/popup/${quest.quest_id}`)}
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
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setShowTutorial(true)}
          >
            <HelpCircle size={20} color="#f1f1f5" strokeWidth={2.5} />
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



      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#ff6b35" />
        </View>
      )}

      <TutorialOverlay
        isVisible={showTutorial}
        onClose={() => setShowTutorial(false)}
      />
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
