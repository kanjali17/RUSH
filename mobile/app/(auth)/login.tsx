import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';

export default function LoginScreen() {
    const router = useRouter();
    const { login, setHasLaunched } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        login(email || 'alex@utexas.edu', password || 'password123', 'explorer');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => {
                    setHasLaunched(false);
                    router.replace('/');
                }}>
                    <X size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.secureHeader}>
                    <Text style={styles.secureText}>SECURE ACCESS</Text>
                </View>
                <View style={{ width: 24 }} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <Text style={styles.logo}>RUSH</Text>
                    <Text style={styles.subLogo}>UNDERGROUND DINING</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>UNIVERSITY EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@university.edu"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>PASSWORD</Text>
                            <TouchableOpacity>
                                <Text style={styles.forgotText}>FORGOT?</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="rgba(255,255,255,0.2)"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} color="rgba(255,255,255,0.2)" /> : <Eye size={20} color="rgba(255,255,255,0.2)" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.continueBtn}
                        onPress={handleLogin}
                        activeOpacity={0.8}
                    >
                        <LinearGradient
                            colors={['#ff8c42', '#ff6b35']}
                            style={styles.continueGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.continueText}>CONTINUE</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>ACCESS RESTRICTED TO MEMBERS</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.joinText}>JOIN THE RUSH</Text>
                            <View style={styles.underline} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.bottomStatus}>
                    <Text style={styles.statusText}>VERIFIED CAMPUS NETWORK</Text>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    secureHeader: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 4,
    },
    secureText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 80,
    },
    logo: {
        fontSize: 84,
        fontWeight: '900',
        color: '#ff6b35',
        letterSpacing: -2,
        textShadowColor: 'rgba(255, 107, 53, 0.4)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subLogo: {
        fontSize: 12,
        fontWeight: '800',
        color: '#ff6b35',
        letterSpacing: 4,
        marginTop: 5,
    },
    form: {
        gap: 40,
    },
    inputGroup: {
        gap: 12,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    forgotText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        color: '#fff',
        fontSize: 18,
        paddingVertical: 12,
        fontWeight: '500',
    },
    passwordContainer: {
        position: 'relative',
    },
    eyeBtn: {
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    continueBtn: {
        height: 64,
        borderRadius: 32,
        marginTop: 20,
        overflow: 'hidden',
    },
    continueGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    continueText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 2,
    },
    footer: {
        alignItems: 'center',
        gap: 12,
        marginTop: 20,
    },
    footerText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    joinText: {
        color: '#ff6b35',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    underline: {
        height: 1,
        backgroundColor: '#ff6b35',
        width: '100%',
        marginTop: 2,
    },
    bottomStatus: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    statusText: {
        color: 'rgba(255,255,255,0.05)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
    },
});
