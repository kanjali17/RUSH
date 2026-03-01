import React from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import { useApp } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronLeft, Calendar, User, Clock, Trash2 } from 'lucide-react-native';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';

export default function NotificationsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { notifications, markNotificationRead } = useApp();

    const renderItem = ({ item, index }: { item: any; index: number }) => (
        <MotiView
            from={{ opacity: 0, translateX: -20 }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: index * 50 }}
            style={[styles.notificationCard, !item.read && styles.unreadCard]}
        >
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => {
                    markNotificationRead(item.id);
                    if (item.data?.popup_id) {
                        router.push(`/popup/${item.data.popup_id}`);
                    }
                }}
            >
                <View style={[styles.iconContainer, item.type === 'RSVP_REMINDER' ? styles.reminderIcon : styles.followIcon]}>
                    {item.type === 'RSVP_REMINDER' ? <Clock size={18} color="#fff" /> : <User size={18} color="#fff" />}
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.notifTitle}>{item.title}</Text>
                    <Text style={styles.notifMessage}>{item.message}</Text>
                    <Text style={styles.notifTime}>1 hour ago</Text>
                </View>
                {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
        </MotiView>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#f1f1f5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
                <View style={{ width: 44 }} />
            </View>

            <FlatList
                data={notifications}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Bell size={48} color="rgba(255,255,255,0.05)" />
                        <Text style={styles.emptyText}>You're all caught up!</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#f1f1f5',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    listContent: {
        padding: 16,
        gap: 12,
    },
    notificationCard: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 16,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    unreadCard: {
        backgroundColor: 'rgba(255, 107, 53, 0.05)',
        borderColor: 'rgba(255, 107, 53, 0.1)',
    },
    cardContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    followIcon: {
        backgroundColor: '#3b82f6',
    },
    reminderIcon: {
        backgroundColor: '#ff6b35',
    },
    textContainer: {
        flex: 1,
    },
    notifTitle: {
        color: '#f1f1f5',
        fontSize: 15,
        fontWeight: '700',
        marginBottom: 2,
    },
    notifMessage: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 13,
        lineHeight: 18,
        marginBottom: 4,
    },
    notifTime: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 11,
        fontWeight: '600',
    },
    unreadDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ff6b35',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        gap: 16,
    },
    emptyText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 14,
        fontWeight: '600',
    }
});
