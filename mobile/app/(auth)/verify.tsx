import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';

export default function VerifyScreen() {
    const router = useRouter();
    const [code, setCode] = useState(['', '', '', '']);
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleCodeChange = (text: string, index: number) => {
        const newCode = [...code];
        newCode[index] = text;
        setCode(newCode);
        // Auto-focus next input could be added here
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.content}
            >
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <ArrowLeft size={24} color="#f1f1f5" />
                    </TouchableOpacity>
                    <Text style={styles.stepText}>STEP 2 OF 4</Text>
                </View>

                <View style={styles.titleSection}>
                    <View style={styles.verificationBadge}>
                        <Text style={styles.verificationText}>VERIFICATION</Text>
                    </View>
                    <Text style={styles.title}>Verify & Secure</Text>
                    <Text style={styles.subtitle}>Enter the code sent to your .edu email to secure your campus access.</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>VERIFICATION CODE</Text>
                        <View style={styles.codeContainer}>
                            {code.map((digit, i) => (
                                <TextInput
                                    key={i}
                                    style={styles.codeBox}
                                    value={digit}
                                    onChangeText={(text) => handleCodeChange(text, i)}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    placeholder="•"
                                    placeholderTextColor="rgba(255,255,255,0.1)"
                                />
                            ))}
                        </View>
                        <TouchableOpacity style={styles.resendBtn}>
                            <Text style={styles.resendText}>RESEND CODE</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>NEW PASSWORD</Text>
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
                        title="VERIFY AND CONTINUE"
                        onPress={() => router.push('/(auth)/vibe')}
                        style={styles.continueBtn}
                    />

                    <View style={styles.encryptionInfo}>
                        <Lock size={12} color="#4b5563" />
                        <Text style={styles.encryptionText}>END-TO-END ENCRYPTED</Text>
                    </View>
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
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 20,
    },
    backBtn: {
        marginRight: 20,
    },
    stepText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    titleSection: {
        marginTop: 40,
        marginBottom: 40,
    },
    verificationBadge: {
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#ff6b35',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        marginBottom: 16,
    },
    verificationText: {
        color: '#ff6b35',
        fontSize: 8,
        fontWeight: '900',
        letterSpacing: 1,
    },
    title: {
        fontSize: 32,
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
    form: {
        gap: 30,
    },
    inputGroup: {
        gap: 12,
    },
    label: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
    },
    codeBox: {
        flex: 1,
        height: 60,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 12,
        textAlign: 'center',
        fontSize: 24,
        color: '#ff6b35',
        fontWeight: '900',
    },
    resendBtn: {
        alignSelf: 'flex-start',
    },
    resendText: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    passwordContainer: {
        position: 'relative',
    },
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        color: '#f1f1f5',
        fontSize: 16,
        paddingVertical: 12,
    },
    eyeBtn: {
        position: 'absolute',
        right: 0,
        bottom: 12,
    },
    continueBtn: {
        height: 56,
        borderRadius: 12,
        marginTop: 10,
    },
    encryptionInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        marginTop: 10,
    },
    encryptionText: {
        color: '#4b5563',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 1,
    },
});
