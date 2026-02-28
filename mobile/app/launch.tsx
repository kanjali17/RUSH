import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { ChevronUp } from 'lucide-react-native';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const TypewriterText = ({ text, delay = 50 }: { text: string, delay?: number }) => {
    const [currentText, setCurrentText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setCurrentText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, delay);
            return () => clearTimeout(timeout);
        }
    }, [currentIndex, text, delay]);

    return <Text style={styles.subtitle}>{currentText}</Text>;
};

export default function LaunchScreen() {
    const router = useRouter();
    const { setHasLaunched } = useApp();
    const fadeAnim = new Animated.Value(0);

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    }, []);

    const handleEnter = () => {
        setHasLaunched(true);
    };

    return (
        <View style={styles.container}>
            {/* Dark Cinematic Background */}
            <LinearGradient
                colors={['#000000', '#0a0a0f', '#000000']}
                style={styles.background}
            />

            {/* Subtle Vignette Overlay */}
            <LinearGradient
                colors={['rgba(255,107,53,0.05)', 'transparent', 'rgba(0,0,0,0.8)']}
                style={styles.vignette}
            />

            <SafeAreaView style={styles.safeArea}>
                <View style={styles.centerSection}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 1500 }}
                        style={styles.logoWrapper}
                    >
                        {/* Dynamic Neon Glow */}
                        <MotiView
                            from={{ opacity: 0.1, scale: 1 }}
                            animate={{ opacity: 0.3, scale: 1.2 }}
                            transition={{
                                type: 'timing',
                                duration: 2000,
                                loop: true,
                                repeatReverse: true
                            }}
                            style={styles.glow}
                        />
                        <Text style={styles.logoText}>RUSH</Text>
                    </MotiView>

                    <MotiView
                        from={{ height: 0, opacity: 0 }}
                        animate={{ height: 40, opacity: 1 }}
                        transition={{ delay: 1000, duration: 1000 }}
                        style={styles.dividerContainer}
                    >
                        <View style={styles.verticalLine} />
                    </MotiView>

                    <TypewriterText text="THE CAMPUS KITCHEN IS OPEN." delay={80} />
                </View>

                <Animated.View style={[styles.bottomSection, { opacity: fadeAnim }]}>
                    <MotiView
                        from={{ translateY: 20, opacity: 0 }}
                        animate={{ translateY: 0, opacity: 1 }}
                        transition={{ delay: 2500, type: 'spring' }}
                        style={{ width: '100%' }}
                    >
                        <TouchableOpacity
                            style={styles.enterBtn}
                            onPress={handleEnter}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#ff9d42', '#ff6b35', '#e65a2a']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.btnGradient}
                            >
                                <Text style={styles.enterText}>ENTER THE HALL</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </MotiView>

                    <MotiView
                        from={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 3000, duration: 1000 }}
                        style={styles.scrollIndicator}
                    >
                        <MotiView
                            animate={{ translateY: [0, -5, 0] }}
                            transition={{ loop: true, duration: 2000 }}
                        >
                            <ChevronUp size={20} color="rgba(255,157,66,0.3)" />
                        </MotiView>
                        <View style={styles.smallLine} />
                    </MotiView>
                </Animated.View>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    background: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    vignette: {
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 60,
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 300,
        height: 120,
        backgroundColor: '#ff6b35',
        borderRadius: 60,
        opacity: 0.2,
        transform: [{ scaleX: 1.4 }],
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 50,
        elevation: 20,
    },
    logoText: {
        fontSize: 100,
        fontWeight: '900',
        color: '#ff8c42',
        fontStyle: 'italic',
        letterSpacing: -6,
        textShadowColor: 'rgba(255, 107, 53, 0.9)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 30,
    },
    dividerContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    verticalLine: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 157, 66, 0.4)',
    },
    subtitle: {
        color: '#f1f1f5',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 4,
        marginTop: 10,
        opacity: 0.8,
        textAlign: 'center',
    },
    bottomSection: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 40,
        gap: 30,
    },
    enterBtn: {
        width: '100%',
        height: 60,
        borderRadius: 14,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    btnGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    enterText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    scrollIndicator: {
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    smallLine: {
        width: 40,
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 1,
    }
});
