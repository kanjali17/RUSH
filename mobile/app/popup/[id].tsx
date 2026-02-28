import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Linking, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Clock, MapPin, Users, Heart, Share2, ChevronRight, Zap } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function PopupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { popups, creators, rsvp, getUserRsvp } = useApp();

    const popup = popups.find(p => p.id === id);
    const creator = popup ? creators.find(c => c.id === popup.creator_id) : null;
    const existingRsvp = popup ? getUserRsvp(popup.id) : null;

    if (!popup) return null;

    const openInMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${popup.lat},${popup.lng}`;
        const label = popup.location_name;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        if (url) Linking.openURL(url);
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Hero Card */}
                <View style={styles.heroContainer}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.heroCard}
                    >
                        <Image
                            source={{ uri: popup.image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' }}
                            style={styles.heroImage}
                        />
                        <LinearGradient
                            colors={['transparent', 'rgba(0,0,0,0.8)']}
                            style={styles.heroGradient}
                        />

                        <TouchableOpacity
                            style={[styles.closeBtn, { top: 20 }]}
                            onPress={() => router.back()}
                        >
                            <X size={20} color="#fff" />
                        </TouchableOpacity>

                        <View style={styles.heroContent}>
                            <View style={styles.liveQuestBadge}>
                                <View style={styles.badgeDot} />
                                <Text style={styles.liveQuestText}>LIVE QUEST</Text>
                            </View>
                            <Text style={styles.title}>{popup.title}</Text>
                        </View>
                    </MotiView>
                </View>

                {/* Info Section */}
                <View style={styles.content}>
                    <View style={styles.featuredTag}>
                        <Text style={styles.featuredTagText}>FEATURED EVENT</Text>
                    </View>

                    <Text style={styles.description}>
                        A curated side-quest for the refined palate.
                        We've sourced the finest local grains and secret reductions for a one-time campus gathering.
                    </Text>

                    <View style={styles.detailsGrid}>
                        {/* Menu Selection */}
                        <View style={styles.menuColumn}>
                            <Text style={styles.columnLabel}>MENU SELECTION</Text>
                            {popup.menu?.map(item => (
                                <View key={item.id} style={styles.menuItem}>
                                    <Text style={styles.menuItemName}>{item.name}</Text>
                                    <Text style={styles.menuItemDesc}>
                                        {item.description || "Wild forest mushrooms, essence of white truffle oil, hand-picked herbs."}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        {/* Right Info Column */}
                        <View style={styles.infoColumn}>
                            <View style={styles.infoGroup}>
                                <Text style={styles.columnLabel}>WHEN</Text>
                                <Text style={styles.infoValue}>12:30 PM — 2:00 PM</Text>
                            </View>

                            <View style={styles.infoGroup}>
                                <Text style={styles.columnLabel}>WHERE</Text>
                                <Text style={styles.infoValue}>{popup.location_name}</Text>
                                <TouchableOpacity style={styles.miniMap} onPress={openInMaps}>
                                    <Image
                                        source={{ uri: `https://api.mapbox.com/styles/v1/mapbox/dark-v10/static/-97.7341,30.2849,15,0/100x60?access_token=${process.env.EXPO_PUBLIC_MAPBOX_TOKEN || 'PLACEHOLDER'}` }}
                                        style={styles.mapImage}
                                    />
                                    <View style={styles.mapMarker}>
                                        <MapPin size={12} color="#ff6b35" />
                                    </View>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.infoGroup}>
                                <Text style={styles.columnLabel}>CAPACITY</Text>
                                <Text style={styles.capacityValue}>
                                    <Text style={{ color: '#ff6b35', fontWeight: '900' }}>{popup.attendance}</Text> / {popup.capacity || 60} JOINED
                                </Text>
                                <View style={styles.capacityTrack}>
                                    <MotiView
                                        from={{ width: 0 }}
                                        animate={{ width: `${(popup.attendance / (popup.capacity || 60)) * 100}%` }}
                                        transition={{ type: 'timing', duration: 1000 }}
                                        style={styles.capacityFill}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* RSVP Action */}
                    <View style={styles.rsvpSection}>
                        <TouchableOpacity
                            style={styles.rsvpBtn}
                            onPress={() => rsvp(popup.id, 'going')}
                        >
                            <LinearGradient
                                colors={['#ff6b35', '#ff9f42']}
                                style={styles.rsvpGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <Text style={styles.rsvpBtnText}>
                                    {existingRsvp ? "RSVP'D TO GATHERING" : "RSVP TO THE GATHERING"}
                                </Text>
                                <Zap size={18} color="#000" fill="#000" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.limitText}>LIMITED COMMUNITY SLOT</Text>

                        <View style={styles.attendeeStack}>
                            {/* Dummy Attendee Icons */}
                            <View style={[styles.attendeeCircle, { backgroundColor: '#2a2a3e' }]}><Text style={styles.attendeeInit}>JD</Text></View>
                            <View style={[styles.attendeeCircle, { backgroundColor: '#3a2a1e', marginLeft: -10 }]}><Text style={styles.attendeeInit}>AS</Text></View>
                            <View style={[styles.attendeeCircle, { backgroundColor: 'rgba(255,255,255,0.1)', marginLeft: -10 }]}><Text style={styles.attendeeCount}>+39</Text></View>
                        </View>
                    </View>
                </View>

                <View style={{ height: insets.bottom + 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0c',
    },
    scroll: {
        flex: 1,
    },
    heroContainer: {
        paddingHorizontal: 16,
        paddingTop: 10,
    },
    heroCard: {
        height: 480,
        borderRadius: 40,
        overflow: 'hidden',
        position: 'relative',
    },
    heroImage: {
        width: '100%',
        height: '100%',
    },
    heroGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    closeBtn: {
        position: 'absolute',
        right: 20,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroContent: {
        position: 'absolute',
        bottom: 40,
        left: 30,
        right: 30,
    },
    liveQuestBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 12,
    },
    badgeDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ff6b35',
    },
    liveQuestText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    title: {
        fontSize: 48,
        color: '#fff',
        fontWeight: '800',
        lineHeight: 52,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 30,
    },
    featuredTag: {
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginBottom: 16,
    },
    featuredTagText: {
        color: '#ff6b35',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    description: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 22,
        fontWeight: '500',
        marginBottom: 40,
    },
    detailsGrid: {
        flexDirection: 'row',
        gap: 40,
    },
    menuColumn: {
        flex: 1,
    },
    columnLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
        marginBottom: 24,
    },
    menuItem: {
        marginBottom: 32,
    },
    menuItemName: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 8,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    menuItemDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        lineHeight: 18,
        fontWeight: '500',
    },
    infoColumn: {
        width: 120,
        gap: 40,
    },
    infoGroup: {
        gap: 8,
    },
    infoValue: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '700',
        lineHeight: 20,
    },
    miniMap: {
        width: 100,
        height: 60,
        borderRadius: 8,
        marginTop: 8,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    mapMarker: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -6,
        marginLeft: -6,
    },
    capacityValue: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        fontWeight: '700',
    },
    capacityTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 3,
        marginTop: 8,
        overflow: 'hidden',
    },
    capacityFill: {
        height: '100%',
        backgroundColor: '#ff6b35',
    },
    rsvpSection: {
        marginTop: 60,
        alignItems: 'center',
    },
    rsvpBtn: {
        width: '100%',
        height: 64,
        borderRadius: 20,
        overflow: 'hidden',
    },
    rsvpGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    rsvpBtnText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    limitText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginTop: 20,
        marginBottom: 16,
    },
    attendeeStack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    attendeeCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#0a0a0c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    attendeeInit: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    },
    attendeeCount: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '700',
    }
});
