import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Linking, Platform, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Clock, MapPin, Users, Heart, Share2, ChevronRight, Zap, ArrowRight, Flame } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function PopupDetailScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { quests, profiles, rsvp, followUser, currentUser, rsvps, posts } = useApp();

    const quest = quests.find(q => q.quest_id === id);
    const creator = quest ? profiles.find(u => u.id === quest.creator_id) : null;
    const existingRsvp = quest ? rsvps.find(r => r.user_id === currentUser?.id && r.quest_id === quest.quest_id) : null;
    const isFollowing = creator && currentUser?.id && profiles.find(u => u.id === currentUser.id)?.following_count; // Simplified for now, or use follows table

    if (!quest) return null;

    const openInMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${quest.location?.lat},${quest.location?.lng}`;
        const label = quest.location_name;
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
                            source={{ uri: quest.flyer_image_url || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800' }}
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
                            {quest.is_live && (
                                <View style={styles.activeNowBadge}>
                                    <Text style={styles.activeNowText}>ACTIVE NOW</Text>
                                </View>
                            )}
                            <Text style={styles.heroTitle}>{quest.title.toUpperCase()}</Text>
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
                            onPress={() => router.push(`/creator/${quest.creator_id}` as any)}
                        >
                            <View style={styles.creatorAvatar}>
                                <Text style={styles.avatarEmoji}>{creator?.profile_photo_url ? '' : '👨‍🍳'}</Text>
                                {creator?.profile_photo_url && <Image source={{ uri: creator.profile_photo_url }} style={styles.creatorImage} />}
                            </View>
                            <View>
                                <Text style={styles.curatedByLabel}>CURATED BY</Text>
                                <Text style={styles.creatorName}>{creator?.full_name}</Text>
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
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.menuScroll}
                        >
                            {quest.menu_items?.map((item: any) => (
                                <View key={item.menu_item_id} style={styles.menuItem}>
                                    <Text style={styles.menuItemName}>{item.name}</Text>
                                    <Text style={styles.menuItemPrice}>${item.price}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <QuestStats quest={quest} />

                    <View style={styles.infoSection}>
                        <View style={styles.infoRow}>
                            <Clock size={18} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.infoText}>{new Date(quest.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(quest.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                        </View>
                        <TouchableOpacity style={styles.infoRow} onPress={openInMaps}>
                            <MapPin size={18} color="rgba(255,255,255,0.4)" />
                            <Text style={[styles.infoText, { color: '#ff6b35' }]}>{quest.location_name}</Text>
                        </TouchableOpacity>
                        <View style={styles.infoRow}>
                            <Users size={18} color="rgba(255,255,255,0.4)" />
                            <Text style={styles.infoText}>{quest.stats?.rsvp_count || 0} RSVPs • {quest.capacity_limit ? `Limit ${quest.capacity_limit}` : 'Open Capacity'}</Text>
                        </View>
                    </View>

                    <View style={styles.infoColumn}>
                        <View style={styles.infoGroup}>
                            <Text style={styles.columnLabel}>WHERE</Text>
                            <Text style={styles.infoValue}>{quest.location_name}</Text>
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
                                <Text style={{ color: '#ff6b35', fontWeight: '900' }}>{quest.stats?.rsvp_count}</Text> / {quest.capacity_limit || 60} JOINED
                            </Text>
                            <View style={styles.capacityTrack}>
                                <MotiView
                                    from={{ width: 0 }}
                                    animate={{ width: `${((quest.stats?.rsvp_count || 0) / (quest.capacity_limit || 60)) * 100}%` }}
                                    transition={{ type: 'timing', duration: 1000 }}
                                    style={styles.capacityFill}
                                />
                            </View>
                        </View>
                    </View>

                    {/* RSVP Action */}
                    <View style={styles.rsvpSection}>
                        <RushButton
                            title={existingRsvp ? (existingRsvp.status === 'going' ? 'YOU ARE GOING' : 'INTERESTED') : 'RSVP FOR SIDEQUEST'}
                            onPress={() => rsvp(quest.quest_id, 'going')}
                            variant={existingRsvp?.status === 'going' ? 'secondary' : 'primary'}
                        />

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

function QuestStats({ quest }: { quest: any }) {
    return (
        <View style={styles.statsContainer}>
            <View style={styles.statBox}>
                <Flame size={16} color="#ff6b35" fill="#ff6b35" />
                <Text style={styles.statValue}>{quest.stats?.engagement_score.toFixed(0) || 0}</Text>
                <Text style={styles.statLabel}>VIBE</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
                <Zap size={16} color="#d640ff" fill="#d640ff" />
                <Text style={styles.statValue}>{quest.stats?.rumor_count || 0}</Text>
                <Text style={styles.statLabel}>RUMORS</Text>
            </View>
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
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: 'hidden',
    },
    creatorImage: {
        width: '100%',
        height: '100%',
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
    menuScroll: {
        paddingVertical: 10,
    },
    menuItemName: {
        color: '#f1f1f5',
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
    },
    menuItemPrice: {
        color: '#ff6b35',
        fontSize: 16,
        fontFamily: 'Outfit-Bold',
    },
    infoSection: {
        marginTop: 20,
        gap: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    infoText: {
        color: '#f1f1f5',
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
    },
    detailsGrid: {
        flexDirection: 'row',
        gap: 40,
        marginTop: 20,
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
        backgroundColor: 'rgba(255,255,255,0.05)',
        padding: 16,
        borderRadius: 12,
        marginRight: 12,
        minWidth: 140,
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
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
        color: '#f1f1f5',
        fontSize: 10,
        fontWeight: '700',
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 20,
        borderRadius: 20,
        marginTop: 30,
    },
    statBox: {
        alignItems: 'center',
        gap: 4,
    },
    statValue: {
        color: '#f1f1f5',
        fontSize: 18,
        fontWeight: '900',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
});
