import React, { useState } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, ScrollView, Image, SafeAreaView } from 'react-native';
import { useApp, Popup } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ticket, Calendar, MapPin, Bell, Navigation, ChevronRight } from 'lucide-react-native';
import { RushCard } from '../../components/rush/RushCard';
import { MotiView } from 'moti';

export default function RSVPsScreen() {
    const insets = useSafeAreaInsets();
    const { rsvps, popups, currentUser } = useApp();
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'trending'>('upcoming');

    const userRsvps = rsvps.filter(r => {
        const popup = popups.find(p => p.id === r.popup_id);
        const isUser = r.user_id === currentUser?.id;
        if (activeTab === 'upcoming') {
            return isUser && (popup?.status === 'active' || popup?.status === 'upcoming');
        }
        if (activeTab === 'past') {
            return isUser && popup?.status === 'past';
        }
        return false;
    });

    const TRENDING_POPUPS = [
        { id: '1', title: 'Midnight Ramen', location: 'Engineering Quad', rating: 4.9, score: '93%', rank: '#1', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=200' },
        { id: '2', title: 'Espresso Underground', location: 'Library Basement', rating: 4.7, score: '84%', rank: '#2', image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=200' },
        { id: '3', title: 'Neon Tacos', location: 'Student Union', rating: 4.5, score: '77%', rank: '#3', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865ef4?auto=format&fit=crop&q=80&w=200' },
    ];

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.topRow}>
                <TouchableOpacity style={styles.backBtn}>
                    <ChevronRight size={24} color="#f1f1f5" style={{ transform: [{ rotate: '180deg' }] }} />
                </TouchableOpacity>
                <Text style={styles.title}>My RSVPs</Text>
                <TouchableOpacity style={styles.iconBtn}>
                    <Bell size={20} color="#f1f1f5" />
                    <View style={styles.dot} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabs}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'upcoming' && styles.tabActive]}
                    onPress={() => setActiveTab('upcoming')}
                >
                    <Text style={[styles.tabText, activeTab === 'upcoming' && styles.tabTextActive]}>Upcoming</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'past' && styles.tabActive]}
                    onPress={() => setActiveTab('past')}
                >
                    <Text style={[styles.tabText, activeTab === 'past' && styles.tabTextActive]}>Past</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'trending' && styles.tabActive]}
                    onPress={() => setActiveTab('trending')}
                >
                    <Text style={[styles.tabText, activeTab === 'trending' && styles.tabTextActive]}>Trending</Text>
                </TouchableOpacity>
            </View>

            {activeTab === 'upcoming' && (
                <View style={styles.subHeader}>
                    <Text style={styles.subTitle}>UPCOMING FOOD DROPS</Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>2 SECURED</Text>
                    </View>
                </View>
            )}

            {activeTab === 'trending' && (
                <View style={styles.subHeader}>
                    <Text style={styles.subTitle}>POPULAR POP-UPS</Text>
                    <View style={styles.liveBadge}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE STATS</Text>
                    </View>
                </View>
            )}
        </View>
    );

    const renderTrendingItem = (item: any, index: number) => (
        <MotiView
            key={item.id}
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 100 }}
            style={styles.trendingCard}
        >
            <View style={styles.rankBox}>
                <Text style={styles.rankText}>{item.rank}</Text>
            </View>
            <Image source={{ uri: item.image }} style={styles.trendingThumb} />
            <View style={styles.trendingInfo}>
                <Text style={styles.trendingName}>{item.title}</Text>
                <Text style={styles.trendingLoc}>{item.location}</Text>
                <View style={styles.trendingMetrics}>
                    <Text style={styles.trendingScoreLabel}>TRENDING SCORE</Text>
                    <View style={styles.scoreBarContainer}>
                        <View style={[styles.scoreBar, { width: item.score }]} />
                    </View>
                </View>
            </View>
            <View style={styles.ratingBox}>
                <Text style={styles.starText}>★ {item.rating}</Text>
                <Text style={styles.scorePercent}>{item.score}</Text>
            </View>
        </MotiView>
    );

    const renderTrending = () => (
        <View style={styles.trendingContainer}>
            <View style={styles.trendingList}>
                {TRENDING_POPUPS.map((item, index) => renderTrendingItem(item, index))}
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.statsTitle}>DROP VOLUME (24H)</Text>
                <View style={styles.chart}>
                    {[40, 60, 45, 80, 55, 90, 70].map((h, i) => (
                        <View key={i} style={styles.chartCol}>
                            <View style={[styles.chartBar, { height: h }]} />
                            <Text style={styles.chartLabel}>{['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'][i]}</Text>
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => {
        const popup = popups.find(p => p.id === item.popup_id);
        if (!popup) return null;

        return (
            <MotiView
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.questCard}
            >
                <View style={styles.cardMain}>
                    <View style={styles.cardImage}>
                        <Image
                            source={{ uri: popup.image_url || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' }}
                            style={StyleSheet.absoluteFill}
                        />
                        <View style={styles.statusLabel}>
                            <Text style={styles.statusLabelText}>SECURED</Text>
                        </View>
                    </View>

                    <View style={styles.cardContent}>
                        <Text style={styles.cardTitle}>{popup.title}</Text>
                        <View style={styles.locationInfo}>
                            <MapPin size={12} color="#ff6b35" fill="#ff6b35" />
                            <Text style={styles.locationText}>{popup.location_name}</Text>
                        </View>
                        <Text style={styles.timeText}>10:30 PM • Booth #04</Text>

                        <View style={styles.orderSummary}>
                            <Text style={styles.summaryLabel}>PRE-ORDER SUMMARY</Text>
                            <View style={styles.summaryRow}>
                                <Text style={styles.itemText}>Spicy Miso Ramen</Text>
                                <Text style={styles.priceText}>$12.00</Text>
                            </View>
                            <View style={styles.summaryRow}>
                                <Text style={styles.itemText}>Crispy Gyoza (3pc)</Text>
                                <Text style={styles.priceText}>$6.00</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <TouchableOpacity style={styles.navigateBtn}>
                    <Navigation size={18} color="#000" fill="#000" />
                    <Text style={styles.navigateText}>Navigate</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.calendarLink}>
                    <Calendar size={14} color="rgba(255,255,255,0.4)" />
                    <Text style={styles.addCalendarText}>Add to Calendar</Text>
                </TouchableOpacity>
            </MotiView>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {activeTab === 'trending' ? (
                <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                    {renderHeader()}
                    {renderTrending()}
                </ScrollView>
            ) : (
                <FlatList
                    data={userRsvps}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    ListHeaderComponent={renderHeader}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Ticket size={48} color="#22223a" />
                            <Text style={styles.emptyText}>No RSVPs found for this section.</Text>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    header: {
        paddingVertical: 20,
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
    },
    title: {
        color: '#f1f1f5',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    iconBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    dot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff6b35',
        borderWidth: 2,
        borderColor: '#1a1a1a',
    },
    tabs: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 40,
    },
    tab: {
        paddingBottom: 8,
    },
    tabActive: {
        borderBottomWidth: 2,
        borderBottomColor: '#ff6b35',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '700',
        color: '#4b5563',
    },
    tabTextActive: {
        color: '#f1f1f5',
    },
    subHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    subTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    badge: {
        backgroundColor: 'rgba(255,107,53,0.1)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    badgeText: {
        color: '#ff6b35',
        fontSize: 8,
        fontWeight: '900',
    },
    liveBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ff6b35',
    },
    liveText: {
        color: '#ff6b35',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 1,
    },
    questCard: {
        backgroundColor: '#111',
        borderRadius: 24,
        padding: 16,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardMain: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 20,
    },
    cardImage: {
        width: 100,
        height: 120,
        borderRadius: 12,
        backgroundColor: '#222',
        overflow: 'hidden',
    },
    statusLabel: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: '#ff6b35',
        paddingHorizontal: 6,
        paddingVertical: 3,
        borderRadius: 4,
    },
    statusLabelText: {
        color: '#000',
        fontSize: 8,
        fontWeight: '900',
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        color: '#f1f1f5',
        fontSize: 18,
        fontWeight: '800',
        marginBottom: 6,
    },
    locationInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 2,
    },
    locationText: {
        color: '#f1f1f5',
        fontSize: 12,
        fontWeight: '700',
    },
    timeText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 12,
    },
    orderSummary: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 8,
        padding: 8,
    },
    summaryLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 8,
        fontWeight: '800',
        letterSpacing: 0.5,
        marginBottom: 6,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    itemText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        fontWeight: '600',
    },
    priceText: {
        color: '#f1f1f5',
        fontSize: 10,
        fontWeight: '700',
    },
    navigateBtn: {
        backgroundColor: '#ff6b35',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 50,
        borderRadius: 12,
        gap: 8,
        marginBottom: 16,
    },
    navigateText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900',
    },
    calendarLink: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    addCalendarText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '700',
        textDecorationLine: 'underline',
    },
    trendingContainer: {
        gap: 30,
    },
    trendingList: {
        gap: 16,
    },
    trendingCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        padding: 12,
        gap: 12,
    },
    rankBox: {
        width: 32,
        alignItems: 'center',
    },
    rankText: {
        color: '#ff6b35',
        fontSize: 16,
        fontWeight: '900',
        fontStyle: 'italic',
    },
    trendingThumb: {
        width: 60,
        height: 60,
        borderRadius: 10,
    },
    trendingInfo: {
        flex: 1,
    },
    trendingName: {
        color: '#f1f1f5',
        fontSize: 15,
        fontWeight: '800',
        marginBottom: 2,
    },
    trendingLoc: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        fontWeight: '600',
        marginBottom: 8,
    },
    trendingMetrics: {
        gap: 4,
    },
    trendingScoreLabel: {
        color: '#ff6b35',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 0.5,
        opacity: 0.7,
    },
    scoreBarContainer: {
        height: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 1.5,
    },
    scoreBar: {
        height: '100%',
        backgroundColor: '#ff6b35',
        borderRadius: 1.5,
    },
    ratingBox: {
        alignItems: 'flex-end',
        gap: 4,
    },
    starText: {
        color: '#ff6b35',
        fontSize: 14,
        fontWeight: '900',
    },
    scorePercent: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '700',
    },
    statsSection: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 20,
        padding: 20,
    },
    statsTitle: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
        marginBottom: 20,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
    },
    chartCol: {
        alignItems: 'center',
        gap: 8,
    },
    chartBar: {
        width: 12,
        backgroundColor: '#ff6b35',
        borderRadius: 6,
        opacity: 0.6,
    },
    chartLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 8,
        fontWeight: '700',
    },
    empty: {
        alignItems: 'center',
        marginTop: 60,
        gap: 16,
    },
    emptyText: {
        color: '#4b5563',
        fontSize: 14,
        fontWeight: '600',
    }
});
