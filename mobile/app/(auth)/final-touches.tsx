import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Camera, Plus } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { RushButton } from '../../components/rush/RushButton';
import { useApp } from '../../context/AppContext';

export default function FinalTouchesScreen() {
    const router = useRouter();
    const { login, updateProfile } = useApp();
    const [bio, setBio] = useState('');
    const [instaHandle, setInstaHandle] = useState('');
    const [image, setImage] = useState<string | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission Denied', 'We need access to your gallery to upload a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handleFinish = () => {
        // Complete the signup and log in
        updateProfile({ bio, profile_photo: image, instagram: instaHandle });
        login('newuser@university.edu', 'password123', 'explorer');
        router.push('/(tabs)');
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
                    <Text style={styles.stepText}>STEP 4 OF 4</Text>
                </View>

                <View style={styles.titleSection}>
                    <Text style={styles.badge}>SIGNUP</Text>
                    <Text style={styles.title}>FINAL TOUCHES</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.avatarSection}>
                        <TouchableOpacity style={styles.avatarCircle} onPress={pickImage}>
                            {image ? (
                                <Image source={{ uri: image }} style={styles.avatarImage} />
                            ) : (
                                <Camera size={40} color="rgba(255,255,255,0.2)" />
                            )}
                            <View style={styles.plusBtn}>
                                <Plus size={16} color="#000" />
                            </View>
                        </TouchableOpacity>
                        <Text style={styles.avatarLabel}>UPLOAD PROFILE PHOTO</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>INSTA HANDLE</Text>
                        <View style={styles.instaInputWrapper}>
                            <Text style={styles.instaPrefix}>@</Text>
                            <TextInput
                                style={styles.instaInput}
                                placeholder="your.handle"
                                placeholderTextColor="#4b5563"
                                value={instaHandle}
                                onChangeText={setInstaHandle}
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>BIO / DESCRIPTION</Text>
                            <Text style={styles.charCount}>{bio.length}/120</Text>
                        </View>
                        <TextInput
                            style={styles.bioInput}
                            placeholder="Tell the campus your food philosophy..."
                            placeholderTextColor="#4b5563"
                            multiline
                            maxLength={120}
                            value={bio}
                            onChangeText={setBio}
                        />
                    </View>

                    <RushButton
                        title="CREATE ACCOUNT"
                        onPress={handleFinish}
                        style={styles.finishBtn}
                    />

                    <Text style={styles.disclaimer}>
                        BY TAPPING CREATE ACCOUNT YOU AGREE TO OUR COMMUNITY GUIDELINES
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
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    badge: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#f1f1f5',
        letterSpacing: -1,
    },
    form: {
        gap: 40,
    },
    avatarSection: {
        alignItems: 'center',
        gap: 16,
    },
    avatarCircle: {
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#ff6b35',
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
    },
    avatarImage: {
        width: '100%',
        height: '100%',
        borderRadius: 70,
    },
    plusBtn: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#ff6b35',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    inputGroup: {
        gap: 12,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    label: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    charCount: {
        color: '#4b5563',
        fontSize: 10,
        fontWeight: '800',
    },
    bioInput: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        padding: 16,
        color: '#f1f1f5',
        fontSize: 14,
        height: 100,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    instaInputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.1)',
        paddingVertical: 8,
    },
    instaPrefix: {
        color: '#ff6b35',
        fontSize: 16,
        fontWeight: '900',
        marginRight: 4,
    },
    instaInput: {
        flex: 1,
        color: '#f1f1f5',
        fontSize: 16,
        fontWeight: '600',
    },
    finishBtn: {
        height: 56,
        borderRadius: 12,
    },
    disclaimer: {
        color: '#4b5563',
        fontSize: 9,
        fontWeight: '800',
        textAlign: 'center',
        lineHeight: 14,
        paddingHorizontal: 20,
    },
});
