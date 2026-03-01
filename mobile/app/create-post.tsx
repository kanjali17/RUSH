import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, TextInput, SafeAreaView, KeyboardAvoidingView, Platform, Image, ScrollView } from 'react-native';
import { X, Camera, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { MotiView } from 'moti';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreatePostScreen() {
    const router = useRouter();
    const { createPost } = useApp();
    const [image, setImage] = useState<string | null>(null);
    const [caption, setCaption] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!image) {
            alert('Please select an image first');
            return;
        }
        setIsPosting(true);
        try {
            createPost({
                image_url: image,
                caption,
            });
            router.back();
        } catch (error) {
            console.error(error);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
                    <X size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>NEW POST</Text>
                <TouchableOpacity onPress={handlePost} disabled={isPosting || !image}>
                    <Text style={[styles.postBtnText, (isPosting || !image) && styles.disabledBtn]}>POST</Text>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <TouchableOpacity
                        style={styles.imageSelector}
                        onPress={pickImage}
                        activeOpacity={0.8}
                    >
                        {image ? (
                            <Image source={{ uri: image }} style={styles.selectedImage} />
                        ) : (
                            <View style={styles.uploadPlaceholder}>
                                <View style={styles.iconCircle}>
                                    <Camera size={32} color="#ff6b35" />
                                </View>
                                <Text style={styles.uploadText}>UPLOAD PHOTO</Text>
                            </View>
                        )}
                        <View style={styles.dashedBorder} pointerEvents="none" />
                    </TouchableOpacity>

                    <View style={styles.inputSection}>
                        <Text style={styles.label}>CAPTION</Text>
                        <TextInput
                            style={styles.captionInput}
                            placeholder="What's cooking?"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            multiline
                            value={caption}
                            onChangeText={setCaption}
                        />
                    </View>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    headerBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 4,
    },
    postBtnText: {
        color: '#ff6b35',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    disabledBtn: {
        opacity: 0.5,
    },
    scrollContent: {
        padding: 24,
    },
    imageSelector: {
        width: '100%',
        aspectRatio: 1,
        backgroundColor: 'rgba(255,107,53,0.03)',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        marginBottom: 40,
    },
    dashedBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: '#ff6b35',
        borderStyle: 'dashed',
        opacity: 0.3,
    },
    selectedImage: {
        width: '100%',
        height: '100%',
    },
    uploadPlaceholder: {
        alignItems: 'center',
        gap: 16,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,107,53,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,107,53,0.2)',
    },
    uploadText: {
        color: '#ff6b35',
        fontSize: 12,
        fontWeight: '900',
        letterSpacing: 2,
    },
    inputSection: {
        gap: 16,
    },
    label: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        opacity: 0.8,
    },
    captionInput: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 20,
        padding: 20,
        color: '#fff',
        fontSize: 18,
        minHeight: 120,
        textAlignVertical: 'top',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    }
});
