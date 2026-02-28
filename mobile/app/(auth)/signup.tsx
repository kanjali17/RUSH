import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { RushButton } from '../../components/rush/RushButton';

export default function SignupScreen() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

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

                    <RushButton
                        title="SEND VERIFICATION CODE"
                        onPress={() => router.push('/(auth)/verify')}
                        style={styles.continueBtn}
                    />

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
