import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, ChevronRight, MapPin } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';

const VIBES = [
    'LATE NIGHT', 'VEGAN', 'SPICY', 'CAFFEINE', 'BUDGET', 'HALAL', 'GLUTEN FREE', 'DESSERT'
];

export default function VibeCheckScreen() {
    const router = useRouter();
    const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
    const [location, setLocation] = useState('');
    const [zip, setZip] = useState('');

    const toggleVibe = (vibe: string) => {
        if (selectedVibes.includes(vibe)) {
            setSelectedVibes(selectedVibes.filter(v => v !== vibe));
        } else {
            setSelectedVibes([...selectedVibes, vibe]);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color="#f1f1f5" />
                    </TouchableOpacity>
                    <View style={styles.onboardingBadge}>
                        <Text style={styles.onboardingText}>ONBOARDING STATUS</Text>
                    </View>
                    <Text style={styles.stepText}>STEP 3 OF 4</Text>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.title}>What's the vibe right now?</Text>
                    <Text style={styles.subtitle}>Curating your underground feed based on your current cravings.</Text>
                </View>

                <View style={styles.vibeGrid}>
                    {VIBES.map((vibe) => (
                        <TouchableOpacity
                            key={vibe}
                            style={[styles.vibeChip, selectedVibes.includes(vibe) && styles.vibeChipActive]}
                            onPress={() => toggleVibe(vibe)}
                        >
                            <Text style={[styles.vibeText, selectedVibes.includes(vibe) && styles.vibeTextActive]}>{vibe}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <View style={styles.locationSection}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CURRENT LOCATION</Text>
                        <View style={styles.locationInputGroup}>
                            <TextInput
                                style={styles.input}
                                placeholder="CAMPUS OR BUILDING NAME"
                                placeholderTextColor="#4b5563"
                                value={location}
                                onChangeText={setLocation}
                            />
                            <MapPin size={16} color="#4b5563" />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>POSTAL CODE</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="ENTER ZIP CODE"
                            placeholderTextColor="#4b5563"
                            value={zip}
                            onChangeText={setZip}
                            keyboardType="number-pad"
                        />
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.scanningBanner}>
                        <View style={styles.scanningIndicator} />
                        <Text style={styles.scanningText}>SCANNING NEARBY HUBS</Text>
                    </View>
                    <RushButton
                        title="CONTINUE"
                        onPress={() => router.push('/(auth)/final-touches')}
                        style={styles.continueBtn}
                        icon={<ChevronRight size={18} color="#fff" />}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
        justifyContent: 'space-between',
    },
    backBtn: {
        marginRight: 10,
    },
    onboardingBadge: {
        borderWidth: 1,
        borderColor: '#ff6b35',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    onboardingText: {
        color: '#ff6b35',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
    },
    stepText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    titleSection: {
        marginTop: 40,
        marginBottom: 30,
    },
    title: {
        fontSize: 28,
        fontWeight: '900',
        color: '#f1f1f5',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 8,
        lineHeight: 20,
    },
    vibeGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 40,
    },
    vibeChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    vibeChipActive: {
        backgroundColor: 'rgba(255, 107, 53, 0.15)',
        borderColor: '#ff6b35',
    },
    vibeText: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    vibeTextActive: {
        color: '#ff6b35',
    },
    locationSection: {
        gap: 24,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    locationInputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
    },
    input: {
        flex: 1,
        color: '#f1f1f5',
        fontSize: 14,
        paddingVertical: 12,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 30,
        right: 30,
        gap: 20,
    },
    scanningBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 53, 0.2)',
        borderRadius: 12,
    },
    scanningIndicator: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#ff6b35',
        shadowColor: '#ff6b35',
        shadowRadius: 4,
        shadowOpacity: 1,
    },
    scanningText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    continueBtn: {
        height: 56,
        borderRadius: 12,
    },
});
