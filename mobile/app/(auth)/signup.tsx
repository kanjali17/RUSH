import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';
import { useApp } from '../../context/AppContext';

export default function SignupScreen() {
    const router = useRouter();
    const { signup } = useApp();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

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
                    <Text style={styles.stepText}>STEP 1 OF 4</Text>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.logo}>RUSH</Text>
                    <Text style={styles.subtitle}>Create your account</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>FULL NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter full name"
                            placeholderTextColor="#4b5563"
                            value={name}
                            onChangeText={setName}
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>SCHOOL EMAIL</Text>
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
                        <Text style={styles.label}>PASSWORD</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor="#4b5563"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <RushButton
                        title="CREATE ACCOUNT"
                        onPress={async () => {
                            const trimmedEmail = email.trim();
                            const trimmedName = name.trim();

                            if (!trimmedName || !trimmedEmail || !password) {
                                Alert.alert('Error', 'Please fill in all fields');
                                return;
                            }

                            // Use a more robust regex that allows for subdomains if needed
                            const utexasRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]*utexas\.edu$/i;

                            if (!utexasRegex.test(trimmedEmail)) {
                                Alert.alert('Error', 'Please use your official .utexas.edu email address.');
                                return;
                            }

                            router.push({
                                pathname: '/(auth)/vibe',
                                params: { name: trimmedName, email: trimmedEmail, password }
                            } as any);
                        }}
                        style={styles.continueBtn}
                        loading={isLoading}
                    />

                    <TouchableOpacity
                        style={styles.bypassBtn}
                        onPress={() => router.push('/(tabs)')}
                    >
                        <Text style={styles.bypassText}>DEBUG BYPASS (SKIP TO MAP)</Text>
                    </TouchableOpacity>

                    <Text style={styles.termsText}>
                        BY SIGNING UP YOU AGREE TO OUR TERMS
                    </Text>
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
        paddingHorizontal: 20,
    },
    bypassBtn: {
        marginTop: -10,
        alignItems: 'center',
        padding: 10,
    },
    bypassText: {
        color: 'rgba(255,107,53,0.3)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
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
        marginTop: 60,
        marginBottom: 60,
    },
    logo: {
        fontSize: 32,
        fontWeight: '900',
        color: '#f1f1f5',
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        marginTop: 4,
    },
    form: {
        gap: 30,
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
    input: {
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        color: '#f1f1f5',
        fontSize: 16,
        paddingVertical: 12,
    },
    continueBtn: {
        height: 56,
        borderRadius: 12,
        marginTop: 20,
    },
    termsText: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'center',
        letterSpacing: 1,
        marginTop: 20,
    },
});
