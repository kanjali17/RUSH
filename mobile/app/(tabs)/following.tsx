import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { Bell, Flame, ChevronRight, Info, User, Ticket, Clock, MapPin } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RushCard } from '../../components/rush/RushCard';
import { useRouter } from 'expo-router';

const FILTERS = ['All Feed'];

export default function FollowingScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { popups, creators } = useApp();

    const feedItems = popups.filter(p => p.status === 'upcoming' || p.status === 'active');

    const renderHeader = () => (
        <View style={styles.header}>
            <View style={styles.headerTop}>
                <View style={styles.followingTitleGroup}>
                    <View style={styles.followingIcon}>
                        <User size={16} color="#ff6b35" />
                    </View>
                    <Text style={styles.headerTitle}>Following</Text>
                </View>
                <TouchableOpacity
                    style={styles.notificationBtn}
                    onPress={() => router.push('/notifications')}
                >
                    <Bell size={22} color="#f1f1f5" />
                    <View style={styles.badge} />
                </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterBar}>
                {FILTERS.map((f, i) => (
                    <TouchableOpacity key={f} style={[styles.filterChip, i === 0 && styles.filterChipActive]}>
                        <Text style={[styles.filterText, i === 0 && styles.filterTextActive]}>{f}</Text>
                        <ChevronRight size={14} color={i === 0 ? "#ff6b35" : "#9ca3af"} />
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <RushCard variant="accent" style={styles.rumorCard}>
                <View style={styles.rumorRow}>
                    <Info size={16} color="#ff6b35" />
                    <Text style={styles.rumorText}>
                        <Text style={{ fontWeight: '900', color: '#ff6b35' }}>RUMOR: </Text>
                        Chef Kaito is dropping a secret menu item at 11 PM tonight. Keep notifications on.
                    </Text>
                </View>
            </RushCard>
        </View>
    );

    const renderItem = ({ item }: { item: any }) => {
        const creator = creators.find(c => c.id === item.creator_id);
        return (
            <TouchableOpacity
                style={styles.feedCard}
                activeOpacity={0.9}
                onPress={() => router.push(`/popup/${item.id}`)}
            >
                <View style={styles.imagePlaceholder}>
                    <Flame size={48} color="rgba(255,255,255,0.1)" />
                    {(item.attendance > 40) && (
                        <View style={styles.capacityTag}>
                            <Text style={styles.capacityText}>FEW BOWL LEFT</Text>
                        </View>
                    )}
                </View>

                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <TouchableOpacity onPress={() => router.push(`/creator/${item.creator_id}` as any)}>
                        <Text style={styles.cardSubtitle}>by {creator?.name} • {item.location_name}</Text>
                    </TouchableOpacity>
                    <Text style={styles.cardDescription} numberOfLines={2}>
                        {item.description || "Fresh ingredients and amazing vibes guaranteed."}
                    </Text>

                    <View style={styles.cardFooter}>
                        <View style={styles.avatarStack}>
                            {[1, 2, 3].map((i) => (
                                <View key={i} style={[styles.stackAvatar, { left: i * -8 }]} />
                            ))}
                            <Text style={styles.stackText}>+12 joined</Text>
                        </View>
                        <TouchableOpacity style={styles.rsvpBtn} onPress={() => router.push(`/popup/${item.id}`)}>
                            <Text style={styles.rsvpBtnText}>RSVP Now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <FlatList
                data={feedItems}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                ListHeaderComponent={renderHeader}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0f',
    },
    listContent: {
        paddingBottom: 40,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    followingTitleGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    followingIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255, 107, 53, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#f1f1f5',
        fontSize: 24,
        fontWeight: '700',
    },
    notificationBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#1a1a2e',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    badge: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff6b35',
        borderWidth: 1,
        borderColor: '#1a1a2e',
    },
    filterBar: {
        marginBottom: 20,
    },
    filterChip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a2e',
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        gap: 4,
    },
    filterChipActive: {
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 53, 0.3)',
    },
    filterText: {
        color: '#9ca3af',
        fontSize: 14,
        fontWeight: '600',
    },
    filterTextActive: {
        color: '#ff6b35',
    },
    rumorCard: {
        marginBottom: 25,
        padding: 12,
        paddingHorizontal: 16,
    },
    rumorRow: {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
    },
    rumorText: {
        flex: 1,
        color: '#f1f1f5',
        fontSize: 13,
        lineHeight: 18,
    },
    feedCard: {
        backgroundColor: '#1a1a2e',
        marginHorizontal: 20,
        marginBottom: 24,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    imagePlaceholder: {
        height: 200,
        backgroundColor: '#22223a',
        justifyContent: 'center',
        alignItems: 'center',
    },
    capacityTag: {
        position: 'absolute',
        top: 16,
        right: 16,
        backgroundColor: '#ff6b35',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
    },
    capacityText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '900',
    },
    cardContent: {
        padding: 20,
    },
    cardTitle: {
        color: '#f1f1f5',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    cardSubtitle: {
        color: '#ff8c5a',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 10,
    },
    cardDescription: {
        color: '#9ca3af',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 20,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    avatarStack: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    stackAvatar: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#ffb997',
        borderWidth: 2,
        borderColor: '#1a1a2e',
    },
    stackText: {
        color: '#9ca3af',
        fontSize: 12,
        marginLeft: 10,
    },
    rsvpBtn: {
        backgroundColor: '#ff6b35',
        paddingHorizontal: 18,
        paddingVertical: 10,
        borderRadius: 12,
    },
    rsvpBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    }
});
