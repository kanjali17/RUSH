import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import { useApp } from '../context/AppContext';
import { useRouter } from 'expo-router';
import { ChevronLeft, Camera, User, Mail, Instagram, Check } from 'lucide-react-native';
import { RushButton } from '../components/rush/RushButton';

export default function EditProfileScreen() {
    const router = useRouter();
    const { currentUser, updateProfile } = useApp();

    const [name, setName] = useState(currentUser?.display_name || '');
    const [email, setEmail] = useState(currentUser?.email || '');
    const [insta, setInsta] = useState(currentUser?.instagram_handle || '');
    const [photo, setPhoto] = useState(currentUser?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200');

    const handleSave = () => {
        updateProfile({
            display_name: name,
            email: email,
            instagram_handle: insta,
            profile_photo: photo
        });
        router.back();
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ChevronLeft size={24} color="#f1f1f5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>EDIT PROFILE</Text>
                <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
                    <Check size={24} color="#ff6b35" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.avatarSection}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: photo }} style={styles.avatar} />
                            <TouchableOpacity style={styles.cameraIcon}>
                                <Camera size={20} color="#000" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.changePhotoText}>Tap to change photo</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>DISPLAY NAME</Text>
                            <View style={styles.inputWrapper}>
                                <User size={18} color="rgba(255,255,255,0.2)" />
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    placeholder="Enter your name"
                                    placeholderTextColor="rgba(255,255,255,0.1)"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>EMAIL ADDRESS</Text>
                            <View style={styles.inputWrapper}>
                                <Mail size={18} color="rgba(255,255,255,0.2)" />
                                <TextInput
                                    style={styles.input}
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholder="Enter your email"
                                    placeholderTextColor="rgba(255,255,255,0.1)"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>INSTAGRAM HANDLE</Text>
                            <View style={styles.inputWrapper}>
                                <Instagram size={18} color="rgba(255,255,255,0.2)" />
                                <TextInput
                                    style={styles.input}
                                    value={insta}
                                    onChangeText={setInsta}
                                    placeholder="@handle"
                                    placeholderTextColor="rgba(255,255,255,0.1)"
                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                    </View>

                    <View style={{ height: 40 }} />
                    <RushButton title="SAVE CHANGES" onPress={handleSave} variant="primary" />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    backBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtn: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#f1f1f5',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 2,
    },
    scrollContent: {
        padding: 24,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatarWrapper: {
        position: 'relative',
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1a1a1a',
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#ff6b35',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#000',
    },
    changePhotoText: {
        color: '#ff6b35',
        fontSize: 12,
        fontWeight: '700',
    },
    form: {
        gap: 24,
    },
    inputGroup: {
        gap: 10,
    },
    label: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1.5,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#111',
        borderRadius: 12,
        paddingHorizontal: 16,
        gap: 12,
        height: 56,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    input: {
        flex: 1,
        color: '#f1f1f5',
        fontSize: 15,
        fontWeight: '600',
    }
});
