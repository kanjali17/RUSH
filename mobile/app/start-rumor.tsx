import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { X, Ghost, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function StartRumorScreen() {
    const router = useRouter();
    const { startRumor } = useApp();
    const [content, setContent] = useState('');
    const [timeframe, setTimeframe] = useState('SOON');
    const [isBroadcasting, setIsBroadcasting] = useState(false);

    const timeOptions = ['TONIGHT', 'TOMORROW', 'THIS WEEKEND', 'SOON'];

    const handleBroadcast = async () => {
        if (!content.trim()) {
            alert('What is the rumor?');
            return;
        }
        setIsBroadcasting(true);
        try {
            startRumor({
                content,
                timeframe,
            });
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setIsBroadcasting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <X size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>RUMOR MILL</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        style={styles.rumorCard}
                    >
                        <LinearGradient
                            colors={['rgba(214,64,255,0.15)', 'rgba(0,0,0,0)']}
                            style={styles.rumorGradient}
                        >
                            <View style={styles.ghostIconBox}>
                                <Ghost size={40} color="#d640ff" strokeWidth={1.5} />
                            </View>

                            <Text style={styles.label}>UPCOMING TEA</Text>
                            <TextInput
                                style={styles.rumorInput}
                                placeholder="Whisper something to your followers..."
                                placeholderTextColor="rgba(214,64,255,0.3)"
                                multiline
                                value={content}
                                onChangeText={setContent}
                                autoFocus
                            />
                        </LinearGradient>
                    </MotiView>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>WHEN?</Text>
                        <View style={styles.timeGrid}>
                            {timeOptions.map((opt) => (
                                <TouchableOpacity
                                    key={opt}
                                    style={[styles.timeChip, timeframe === opt && styles.activeChip]}
                                    onPress={() => setTimeframe(opt)}
                                >
                                    <Text style={[styles.timeChipText, timeframe === opt && styles.activeChipText]}>
                                        {opt}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.broadcastBtn}
                        onPress={handleBroadcast}
                        disabled={isBroadcasting || !content.trim()}
                    >
                        <LinearGradient
                            colors={['#d640ff', '#8a2be2']}
                            style={styles.broadcastGradient}
                        >
                            <Text style={styles.broadcastBtnText}>
                                {isBroadcasting ? 'BROADCASTING...' : 'BROADCAST RUMOR'}
                            </Text>
                            <Send size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>

                    <Text style={styles.footerNote}>
                        Rumors notify your followers instantly without appearing on the public map.
                    </Text>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(214,64,255,0.1)',
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 6,
    },
    scrollContent: {
        padding: 24,
    },
    rumorCard: {
        width: '100%',
        backgroundColor: '#111',
        borderRadius: 32,
        borderWidth: 1,
        borderColor: 'rgba(214,64,255,0.2)',
        overflow: 'hidden',
        marginBottom: 32,
    },
    rumorGradient: {
        padding: 32,
        alignItems: 'center',
    },
    ghostIconBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(214,64,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: 'rgba(214,64,255,0.3)',
    },
    label: {
        color: '#d640ff',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 3,
        marginBottom: 16,
    },
    rumorInput: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '700',
        textAlign: 'center',
        width: '100%',
        minHeight: 120,
    },
    section: {
        marginBottom: 40,
    },
    sectionLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 16,
    },
    timeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    timeChip: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeChip: {
        backgroundColor: 'rgba(214,64,255,0.1)',
        borderColor: '#d640ff',
    },
    timeChipText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    activeChipText: {
        color: '#d640ff',
    },
    broadcastBtn: {
        width: '100%',
        borderRadius: 24,
        overflow: 'hidden',
        marginBottom: 24,
    },
    broadcastGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        gap: 12,
    },
    broadcastBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    footerNote: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        textAlign: 'center',
        lineHeight: 18,
        paddingHorizontal: 20,
    }
});
