import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView, SafeAreaView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Image as ImageIcon, MapPin, Clock, Info, Users, Ticket, ChevronRight, Plus, Minus, Flame, Camera, Map } from 'lucide-react-native';
import { RushButton } from '../components/rush/RushButton';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function CreateEventScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { createPopup, currentUser } = useApp();

    const [title, setTitle] = useState('');
    const [locationName, setLocationName] = useState('');
    const [menuItems, setMenuItems] = useState([
        { id: '1', name: 'Signature Tonkotsu', price: '14.00' },
        { id: '2', name: 'Spicy Miso Add-on', price: '2.00' }
    ]);

    const addMenuItem = () => {
        setMenuItems([...menuItems, { id: Date.now().toString(), name: '', price: '' }]);
    };

    const removeMenuItem = (id: string) => {
        setMenuItems(menuItems.filter(item => item.id !== id));
    };

    const updateMenuItem = (id: string, field: 'name' | 'price', value: string) => {
        setMenuItems(menuItems.map(item => item.id === id ? { ...item, [field]: value } : item));
    };

    const handlePublish = () => {
        createPopup({
            creator_id: currentUser?.creator_id || 'curr_user',
            campus_id: currentUser?.campus_id || 'ut_austin',
            title,
            location_name: locationName,
            time_range: '10:30 PM',
            description: '',
            lat: 30.2849,
            lng: -97.7341,
            status: 'upcoming',
            attendance: 0,
            menu: menuItems.map(item => ({
                id: item.id,
                name: item.name,
                price: parseFloat(item.price) || 0
            }))
        });
        router.push('/(tabs)');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
                    <X size={24} color="#f1f1f5" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Create Pop-up</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
                {/* Upload Image Section */}
                <View style={styles.imageSection}>
                    <Text style={styles.sectionLabel}>UPLOAD COVER IMAGE</Text>
                    <TouchableOpacity style={styles.imageUploadBox}>
                        <LinearGradient
                            colors={['rgba(255,107,53,0.05)', 'rgba(0,0,0,0)']}
                            style={styles.uploadGradient}
                        >
                            <View style={styles.cameraCircle}>
                                <Camera size={28} color="#ff6b35" />
                            </View>
                            <Text style={styles.uploadText}>Add a photo of your food</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Info Fields */}
                <View style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.fieldLabel}>EVENT NAME</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. Midnight Ramen Session"
                            placeholderTextColor="rgba(255,255,255,0.2)"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.fieldLabel}>LOCATION</Text>
                        <TouchableOpacity style={styles.locationSelector}>
                            <Text style={styles.locationPlaceholder}>
                                {locationName || 'Select on map...'}
                            </Text>
                            <Map size={20} color="#ff6b35" />
                        </TouchableOpacity>
                    </View>

                    {/* Menu Section */}
                    <View style={styles.menuSection}>
                        <View style={styles.menuHeader}>
                            <Text style={styles.fieldLabel}>MENU & PRICING</Text>
                            <TouchableOpacity style={styles.addBtn} onPress={addMenuItem}>
                                <Plus size={14} color="#ff6b35" />
                                <Text style={styles.addBtnText}>ADD ITEM</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.menuList}>
                            <View style={styles.menuTableHead}>
                                <Text style={styles.headLabel}>ITEM DESCRIPTION</Text>
                                <Text style={styles.headLabel}>PRICE (USD)</Text>
                            </View>
                            {menuItems.map((item, index) => (
                                <View key={item.id} style={styles.menuItemRow}>
                                    <TextInput
                                        style={styles.itemInput}
                                        value={item.name}
                                        onChangeText={(val) => updateMenuItem(item.id, 'name', val)}
                                        placeholder="Item name"
                                        placeholderTextColor="rgba(255,255,255,0.1)"
                                    />
                                    <View style={styles.priceColumn}>
                                        <TextInput
                                            style={styles.priceInput}
                                            value={item.price}
                                            onChangeText={(val) => updateMenuItem(item.id, 'price', val)}
                                            keyboardType="decimal-pad"
                                            placeholder="0.00"
                                            placeholderTextColor="rgba(255,255,255,0.1)"
                                        />
                                        {menuItems.length > 2 && (
                                            <TouchableOpacity onPress={() => removeMenuItem(item.id)} style={styles.removeBtn}>
                                                <X size={14} color="#f87171" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            ))}
                            {menuItems.length < 5 && (
                                <TouchableOpacity style={styles.addBlankRow} onPress={addMenuItem}>
                                    <Text style={styles.addBlankText}>Add another item...</Text>
                                    <Minus size={14} color="rgba(255,255,255,0.1)" />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={styles.launchBtn}
                    onPress={handlePublish}
                >
                    <LinearGradient
                        colors={['#ff6b35', '#ff9f42']}
                        style={styles.launchGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <Text style={styles.launchBtnText}>LAUNCH POP-UP</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#050505',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    closeBtn: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: '#f1f1f5',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1,
    },
    scroll: {
        flex: 1,
    },
    imageSection: {
        paddingHorizontal: 24,
        marginTop: 10,
        marginBottom: 32,
    },
    sectionLabel: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
        marginBottom: 16,
    },
    imageUploadBox: {
        height: 200,
        borderRadius: 2,
        overflow: 'hidden',
        borderWidth: 1.5,
        borderColor: '#ff6b35',
        borderStyle: 'dashed',
    },
    uploadGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    cameraCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(255,107,53,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadText: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '600',
    },
    form: {
        paddingHorizontal: 24,
        gap: 32,
    },
    inputGroup: {
        gap: 12,
    },
    fieldLabel: {
        color: '#ff6b35',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    input: {
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 4,
        height: 58,
        paddingHorizontal: 16,
        color: '#f1f1f5',
        fontSize: 15,
        fontWeight: '600',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    locationSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 4,
        height: 58,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    locationPlaceholder: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 15,
        fontWeight: '600',
    },
    menuSection: {
        gap: 16,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    addBtnText: {
        color: '#ff6b35',
        fontSize: 9,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    menuList: {
        backgroundColor: 'rgba(255,255,255,0.02)',
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    menuTableHead: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    headLabel: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 9,
        fontWeight: '800',
        letterSpacing: 0.8,
    },
    menuItemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.04)',
    },
    itemInput: {
        flex: 1,
        color: '#f1f1f5',
        fontSize: 14,
        fontWeight: '700',
    },
    priceColumn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    priceInput: {
        color: '#f1f1f5',
        fontSize: 14,
        fontWeight: '700',
        textAlign: 'right',
        width: 70,
    },
    removeBtn: {
        padding: 4,
    },
    addBlankRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 54,
    },
    addBlankText: {
        color: 'rgba(255,255,255,0.1)',
        fontSize: 13,
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0, left: 0, right: 0,
        paddingHorizontal: 24,
        backgroundColor: 'rgba(5,5,5,0.9)',
    },
    launchBtn: {
        height: 60,
        borderRadius: 4,
        overflow: 'hidden',
    },
    launchGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    launchBtnText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '900',
        letterSpacing: 1.5,
    }
});
