import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView } from 'react-native';
import { X, ChevronRight, User, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../context/AppContext';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function SettingsScreen() {
    const router = useRouter();
    const { currentUser, logout } = useApp();

    const MENU_ITEMS = [
        {
            id: '1',
            title: 'Profile Details',
            sub: 'Edit personal information',
            icon: <User size={22} color="#ff6b35" />,
            action: () => router.push('/edit-profile' as any)
        },
        {
            id: '2',
            title: 'Preferences',
            sub: 'App settings & notifications',
            icon: <ShieldCheck size={22} color="#ff6b35" />,
            action: () => { } // Placeholder
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <X size={24} color="#f1f1f5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>SETTINGS</Text>
                <View style={{ width: 44 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.userSection}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarGlow} />
                        <View style={styles.avatarCircle}>
                            <Image
                                source={{ uri: currentUser?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                                style={styles.avatarImage}
                            />
                        </View>
                    </View>
                    <Text style={styles.userName}>{(currentUser?.display_name || 'Alex Rush').toUpperCase()}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>ACCOUNT MANAGEMENT</Text>
                    {MENU_ITEMS.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.menuItem}
                            onPress={item.action}
                        >
                            <View style={styles.menuIconBox}>
                                {item.icon}
                            </View>
                            <View style={styles.menuTextContent}>
                                <Text style={styles.menuItemTitle}>{item.title}</Text>
                                <Text style={styles.menuItemSub}>{item.sub}</Text>
                            </View>
                            <ChevronRight size={20} color="rgba(255,255,255,0.2)" />
                        </TouchableOpacity>
                    ))}
                </View>

                <TouchableOpacity
                    style={styles.signOutBtn}
                    onPress={() => {
                        logout();
                        router.replace('/(auth)/login');
                    }}
                >
                    <Text style={styles.signOutText}>SIGN OUT</Text>
                </TouchableOpacity>

                <Text style={styles.versionText}>RUSH V2.5.0-UNDERGROUND</Text>
            </ScrollView>
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
        paddingVertical: 10,
        paddingHorizontal: 24,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#ff6b35',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
        textShadowColor: 'rgba(255, 107, 53, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 10,
    },
    scrollContent: {
        paddingHorizontal: 24,
        paddingTop: 40,
        alignItems: 'center',
    },
    userSection: {
        alignItems: 'center',
        marginBottom: 60,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarGlow: {
        position: 'absolute',
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 2,
        borderColor: '#ff6b35',
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 15,
    },
    avatarCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: '#000',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
    },
    userName: {
        color: '#f1f1f5',
        fontSize: 22,
        fontWeight: '900',
        letterSpacing: 1,
    },
    section: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
        marginBottom: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 20,
        gap: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    menuIconBox: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuTextContent: {
        flex: 1,
    },
    menuItemTitle: {
        color: '#f1f1f5',
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2,
    },
    menuItemSub: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        fontWeight: '500',
    },
    signOutBtn: {
        width: '100%',
        height: 56,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(248, 113, 113, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    signOutText: {
        color: '#f87171',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    versionText: {
        color: 'rgba(255,255,255,0.1)',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    }
});
