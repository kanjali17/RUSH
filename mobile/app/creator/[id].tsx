import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, FlatList } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, Instagram, Mail, MapPin, Flame } from 'lucide-react-native';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreatorProfileScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { getCreator, popups } = useApp();

    const creator = getCreator(id as string);
    const creatorPopups = popups.filter(p => p.creator_id === creator?.id);

    if (!creator) return null;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                    colors={['#ff6b35', '#000']}
                    style={styles.headerBg}
                >
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ChevronLeft size={24} color="#000" />
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.content}>
                    <View style={styles.avatarBox}>
                        <Image source={{ uri: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }} style={styles.avatar} />
                        <View style={styles.statusBadge}>
                            <Flame size={12} color="#000" fill="#000" />
                        </View>
                    </View>

                    <View style={styles.infoSection}>
                        <Text style={styles.name}>{creator.name}</Text>
                        <Text style={styles.bio}>{creator.bio}</Text>

                        <View style={styles.socialRows}>
                            {creator.email && (
                                <View style={styles.socialRow}>
                                    <Mail size={16} color="rgba(255,255,255,0.4)" />
                                    <Text style={styles.socialText}>{creator.email}</Text>
                                </View>
                            )}
                            {creator.instagram_handle && (
                                <View style={styles.socialRow}>
                                    <Instagram size={16} color="rgba(255,255,255,0.4)" />
                                    <Text style={styles.socialText}>{creator.instagram_handle}</Text>
                                </View>
                            )}
                        </View>

                        <View style={styles.statsRow}>
                            <View style={styles.stat}>
                                <Text style={styles.statVal}>{creator.followers.length}</Text>
                                <Text style={styles.statLabel}>FOLLOWERS</Text>
                            </View>
                            <View style={styles.statDivider} />
                            <View style={styles.stat}>
                                <Text style={styles.statVal}>{creatorPopups.length}</Text>
                                <Text style={styles.statLabel}>DROPS</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.popupsSection}>
                        <Text style={styles.sectionLabel}>LATEST DROPS</Text>
                        {creatorPopups.map((popup) => (
                            <TouchableOpacity
                                key={popup.id}
                                style={styles.popupCard}
                                onPress={() => router.push(`/popup/${popup.id}`)}
                            >
                                <Image source={{ uri: popup.image_url || 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400' }} style={styles.popupImage} />
                                <View style={styles.popupInfo}>
                                    <Text style={styles.popupTitle}>{popup.title}</Text>
                                    <View style={styles.popupLoc}>
                                        <MapPin size={10} color="#ff6b35" fill="#ff6b35" />
                                        <Text style={styles.popupLocText}>{popup.location_name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    headerBg: {
        height: 160,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backBtn: {
        width: 44,
        height: 44,
        backgroundColor: '#fff',
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        paddingHorizontal: 24,
        marginTop: -50,
    },
    avatarBox: {
        position: 'relative',
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#000',
    },
    statusBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ff6b35',
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#000',
    },
    infoSection: {
        marginBottom: 40,
    },
    name: {
        color: '#f1f1f5',
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
    },
    bio: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 14,
        lineHeight: 20,
        marginBottom: 24,
    },
    socialRows: {
        gap: 12,
        marginBottom: 30,
    },
    socialRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    socialText: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 14,
        fontWeight: '600',
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        padding: 20,
        borderRadius: 20,
        gap: 30,
    },
    stat: {
        flex: 1,
        alignItems: 'center',
    },
    statVal: {
        color: '#f1f1f5',
        fontSize: 20,
        fontWeight: '900',
    },
    statLabel: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    popupsSection: {
        gap: 16,
        paddingBottom: 40,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    popupCard: {
        flexDirection: 'row',
        backgroundColor: '#111',
        borderRadius: 16,
        overflow: 'hidden',
        height: 80,
        alignItems: 'center',
    },
    popupImage: {
        width: 80,
        height: '100%',
    },
    popupInfo: {
        flex: 1,
        paddingHorizontal: 16,
        gap: 4,
    },
    popupTitle: {
        color: '#f1f1f5',
        fontSize: 15,
        fontWeight: '700',
    },
    popupLoc: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    popupLocText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '600',
    }
});
