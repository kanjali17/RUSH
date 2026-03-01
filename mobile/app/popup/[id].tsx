import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Linking, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Clock, MapPin, Users, Heart, Share2, ChevronRight, Zap, ArrowRight } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function PopupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { popups, creators, rsvp, getUserRsvp, followCreator, currentUser } = useApp();

    const popup = popups.find(p => p.id === id);
    const creator = popup ? creators.find(c => c.id === popup.creator_id) : null;
    const existingRsvp = popup ? getUserRsvp(popup.id) : null;
    const isFollowing = creator && currentUser?.following.includes(creator.id);

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
                            <View style={styles.activeNowBadge}>
                                <Text style={styles.activeNowText}>ACTIVE NOW</Text>
                            </View>
                            <Text style={styles.heroTitle}>{popup.title.toUpperCase()}</Text>
                        </View>
                    </MotiView>
                </View>

                <View style={styles.content}>
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 200 }}
                        style={styles.creatorCard}
                    >
                        <TouchableOpacity
                            style={styles.creatorContent}
                            onPress={() => router.push(`/creator/${popup.creator_id}` as any)}
                        >
                            <View style={styles.creatorAvatar}>
                                <Text style={styles.avatarEmoji}>{creator?.avatar || '👨‍🍳'}</Text>
                            </View>
                            <View>
                                <Text style={styles.curatedByLabel}>CURATED BY</Text>
                                <Text style={styles.creatorName}>{creator?.name}</Text>
                            </View>
                        </TouchableOpacity>
                        <ChevronRight size={16} color="rgba(255,255,255,0.2)" />
                    </MotiView>

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
                                    <View style={styles.menuDash} />
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
                                <ArrowRight size={20} color="#000" strokeWidth={3} />
                            </LinearGradient>
                        </TouchableOpacity>

                        <Text style={styles.communityHeader}>COMMUNITY MEMBERS JOINING</Text>

                        <View style={styles.attendeeStack}>
                            {/* Dummy Attendee Icons */}
                            <View style={[styles.attendeeCircle, { backgroundColor: '#2a2a3e' }]}><Text style={styles.attendeeInit}>JD</Text></View>
                            <View style={[styles.attendeeCircle, { backgroundColor: '#3a2a1e', marginLeft: -10 }]}><Text style={styles.attendeeInit}>AS</Text></View>
                            <View style={[styles.attendeeCircle, { backgroundColor: '#1a2a3e', marginLeft: -10 }]}><Text style={styles.attendeeInit}>MK</Text></View>
                            <View style={[styles.attendeeCircle, { backgroundColor: 'rgba(255,255,255,0.05)', marginLeft: -10 }]}><Text style={styles.attendeeCount}>+39</Text></View>
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
    activeNowBadge: {
        backgroundColor: '#ff6b35',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    activeNowText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    heroTitle: {
        fontSize: 44,
        color: '#fff',
        fontWeight: '900',
        lineHeight: 48,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    content: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    creatorCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 18,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        marginBottom: 30,
        width: 200, // Compact as per mockup
    },
    creatorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    creatorAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    curatedByLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 8,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    creatorName: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    avatarEmoji: {
        fontSize: 14,
    },
    description: {
        color: 'rgba(255,255,255,0.4)',
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
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 24,
    },
    menuItem: {
        marginBottom: 40,
    },
    menuItemName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginBottom: 4,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    menuDash: {
        width: 24,
        height: 2,
        backgroundColor: '#ff6b35',
        marginBottom: 12,
    },
    menuItemDesc: {
        color: 'rgba(255,255,255,0.3)',
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
        borderRadius: 12,
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
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
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
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 15,
        elevation: 8,
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
    communityHeader: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginTop: 40,
        marginBottom: 16,
        textAlign: 'center',
    },
    attendeeStack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    attendeeCircle: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#0a0a0c',
        justifyContent: 'center',
        alignItems: 'center',
    },
    attendeeInit: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '700',
    },
    attendeeCount: {
        color: '#fff',
        fontSize: 8,
        fontWeight: '700',
    },
});
