import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView, Dimensions, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { ChevronUp } from 'lucide-react-native';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

export default function LaunchScreen() {
    const router = useRouter();
    const { setHasLaunched } = useApp();

    useEffect(() => {
        const timer = setTimeout(() => {
            setHasLaunched(true);
            router.replace('/(auth)/login');
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <MotiView
                    from={{ opacity: 0, translateY: -20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ type: 'timing', duration: 1000 }}
                    style={styles.topSection}
                >
                    <Text style={styles.nowServing}>NOW SERVING</Text>
                </MotiView>

                <View style={styles.centerSection}>
                    <MotiView
                        from={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'timing', duration: 1500 }}
                        style={styles.logoWrapper}
                    >
                        {/* Dynamic Neon Glow */}
                        <MotiView
                            from={{ opacity: 0.1, scale: 1 }}
                            animate={{ opacity: 0.4, scale: 1.2 }}
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
                        from={{ opacity: 0, translateY: 20 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 1000, duration: 1000 }}
                        style={styles.taglineWrapper}
                    >
                        <Text style={styles.tagline}>
                            THE CAMPUS IS {'\n'}
                            <Text style={styles.taglineAccent}>WHISPERING.</Text>
                        </Text>
                    </MotiView>
                </View>

                <MotiView
                    from={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2000, duration: 1000 }}
                    style={styles.bottomSection}
                >
                    <Text style={styles.restrictedText}>RESTRICTED ACCESS</Text>
                </MotiView>
            </SafeAreaView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    safeArea: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 50,
    },
    topSection: {
        marginTop: 20,
    },
    nowServing: {
        color: '#ff6b35',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 8,
        textAlign: 'center',
    },
    centerSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 60,
    },
    logoWrapper: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    glow: {
        position: 'absolute',
        width: 320,
        height: 140,
        backgroundColor: '#ff6b35',
        borderRadius: 70,
        opacity: 0.25,
        transform: [{ scaleX: 1.3 }],
        shadowColor: '#ff6b35',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 60,
        elevation: 20,
    },
    logoText: {
        fontSize: 120,
        fontWeight: '900',
        color: '#ff6b35',
        fontStyle: 'italic',
        letterSpacing: -4,
        textShadowColor: 'rgba(255, 107, 53, 0.8)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 40,
    },
    taglineWrapper: {
        alignItems: 'center',
    },
    tagline: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        letterSpacing: 2,
        textAlign: 'center',
        lineHeight: 32,
    },
    taglineAccent: {
        color: '#ff6b35',
        fontStyle: 'italic',
    },
    bottomSection: {
        marginBottom: 20,
    },
    restrictedText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 4,
        textAlign: 'center',
    }
});
