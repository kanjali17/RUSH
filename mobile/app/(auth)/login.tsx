import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';
import { X, Eye, EyeOff } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';

export default function LoginScreen() {
    const router = useRouter();
    const { login } = useApp();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = () => {
        // Simplified login for MVP/Demo - default to 'explorer' role for general login
        login(email || 'alex@utexas.edu', password || 'password123', 'explorer');
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <TouchableOpacity style={styles.closeBtn} onPress={() => { }}>
                    <X size={24} color="#f1f1f5" />
                </TouchableOpacity>

                <View style={styles.header}>
                    <View style={styles.secureAccessBox}>
                        <Text style={styles.secureAccessText}>SECURE ACCESS</Text>
                    </View>
                    <Text style={styles.logo}>RUSH</Text>
                    <Text style={styles.subLogo}>UNDERGROUND DINING</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>UNIVERSITY EMAIL</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@university.edu"
                            placeholderTextColor="#4b5563"
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
                                placeholderTextColor="#4b5563"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.eyeBtn}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} color="#4b5563" /> : <Eye size={20} color="#4b5563" />}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <RushButton
                        title="CONTINUE"
                        onPress={handleLogin}
                        style={styles.loginBtn}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>ACCESS RESTRICTED TO MEMBERS</Text>
                        <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                            <Text style={styles.joinText}>CREATE AN ACCOUNT</Text>
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
    content: {
        flex: 1,
        paddingHorizontal: 30,
    },
    closeBtn: {
        marginTop: 20,
        alignSelf: 'flex-start',
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 60,
    },
    secureAccessBox: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 4,
        marginBottom: 20,
    },
    secureAccessText: {
        color: '#f1f1f5',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 2,
    },
    logo: {
        fontSize: 72,
        fontWeight: '900',
        color: '#ff6b35', // RUSH ORANGE
        letterSpacing: -2,
    },
    subLogo: {
        fontSize: 12,
        fontWeight: '800',
        color: '#f1f1f5',
        letterSpacing: 4,
        marginTop: -5,
    },
    form: {
        gap: 30,
    },
    inputGroup: {
        gap: 8,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    forgotText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '800',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        color: '#f1f1f5',
        fontSize: 16,
        paddingVertical: 12,
    },
    passwordContainer: {
        position: 'relative',
    },
    eyeBtn: {
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    loginBtn: {
        height: 56,
        borderRadius: 12,
        marginTop: 10,
    },
    footer: {
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    footerText: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '700',
        letterSpacing: 1,
    },
    joinText: {
        color: '#ff6b35',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    bottomStatus: {
        position: 'absolute',
        bottom: 40,
        left: 0,
        right: 0,
        alignItems: 'center',
    },
    statusText: {
        color: '#1a1a1a',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
});
