import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { HelpCircle, X, ChevronRight, MapPin, Flame, Plus, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

interface TutorialOverlayProps {
    isVisible: boolean;
    onClose: () => void;
}

const STEPS = [
    {
        title: "LIVE CAMPUS MAP",
        description: "Discover real-time pop-up events across campus. Just tap a glowing marker to see what's cooking.",
        icon: <MapPin size={32} color="#ff6b35" />,
    },
    {
        title: "VIBE FILTERS",
        description: "Switch between 'LIVE NOW' for instant gratification or 'TRENDING' to see what everyone's raving about.",
        icon: <Flame size={32} color="#ff6b35" />,
    },
    {
        title: "CREATION HUB",
        description: "Tap the central '+' to drop a new Pop-up, share a Post, or start a Rumor to tease your next drop.",
        icon: <Plus size={32} color="#ff6b35" />,
    },
    {
        title: "STAY IN THE LOOP",
        description: "Keep an eye on notifications for RSVPs, interactions, and exclusive rumors from your favorite creators.",
        icon: <Bell size={32} color="#ff6b35" />,
    }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({ isVisible, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleClose();
        }
    };

    const handleClose = () => {
        onClose();
        setTimeout(() => setCurrentStep(0), 300);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={styles.overlay}
                >
                    <LinearGradient
                        colors={['rgba(0,0,0,0.85)', 'rgba(5,5,5,0.98)']}
                        style={styles.gradient}
                    />

                    <View style={styles.content}>
                        <TouchableOpacity style={styles.exitBtn} onPress={handleClose}>
                            <X size={24} color="rgba(255,255,255,0.4)" />
                        </TouchableOpacity>

                        <MotiView
                            key={currentStep}
                            from={{ opacity: 0, scale: 0.9, translateY: 10 }}
                            animate={{ opacity: 1, scale: 1, translateY: 0 }}
                            transition={{ type: 'timing', duration: 400 }}
                            style={styles.card}
                        >
                            <View style={styles.iconContainer}>
                                {STEPS[currentStep].icon}
                            </View>

                            <Text style={styles.stepIndicator}>STEP {currentStep + 1} OF {STEPS.length}</Text>
                            <Text style={styles.title}>{STEPS[currentStep].title}</Text>
                            <Text style={styles.description}>{STEPS[currentStep].description}</Text>

                            <View style={styles.footer}>
                                <TouchableOpacity style={styles.skipBtn} onPress={handleClose}>
                                    <Text style={styles.skipText}>SKIP</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
                                    <LinearGradient
                                        colors={['#ff6b35', '#ff9f42']}
                                        style={styles.nextGradient}
                                    >
                                        <Text style={styles.nextText}>
                                            {currentStep === STEPS.length - 1 ? 'GET STARTED' : 'NEXT'}
                                        </Text>
                                        {currentStep < STEPS.length - 1 && <ChevronRight size={18} color="#000" />}
                                    </LinearGradient>
                                </TouchableOpacity>
                            </View>
                        </MotiView>

                        <View style={styles.pagination}>
                            {STEPS.map((_, i) => (
                                <View
                                    key={i}
                                    style={[
                                        styles.dot,
                                        i === currentStep && styles.activeDot
                                    ]}
                                />
                            ))}
                        </View>
                    </View>
                </MotiView>
            )}
        </AnimatePresence>
    );
};

const styles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        ...StyleSheet.absoluteFillObject,
    },
    content: {
        width: '100%',
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    exitBtn: {
        position: 'absolute',
        top: -100,
        right: 24,
        padding: 8,
    },
    card: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        padding: 32,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.08)',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,107,53,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    stepIndicator: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 12,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 16,
    },
    description: {
        color: 'rgba(255,255,255,0.5)',
        fontSize: 15,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 32,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    skipBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    skipText: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontWeight: '800',
        letterSpacing: 1,
    },
    nextBtn: {
        borderRadius: 12,
        overflow: 'hidden',
        minWidth: 120,
    },
    nextGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        paddingHorizontal: 20,
        gap: 8,
    },
    nextText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    pagination: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 32,
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    activeDot: {
        width: 20,
        backgroundColor: '#ff6b35',
    }
});
