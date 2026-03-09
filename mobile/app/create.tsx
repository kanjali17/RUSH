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
    const { createQuest, currentUser, quests } = useApp();

    const [step, setStep] = useState<'selection' | 'form'>('selection');
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

    const handleSaveDraft = () => {
        alert('Draft saving is currently disabled in this version.');
    };

    const applyTemplate = (source: any) => {
        setTitle(source.title);
        setLocationName(source.location_name);
        setMenuItems(source.menu_items?.map((m: any) => ({
            id: m.menu_item_id,
            name: m.name,
            price: m.price.toString()
        })) || []);
        setStep('form');
    };

    const userTemplates = quests.filter(q => q.creator_id === currentUser?.id);

    const handlePublish = async () => {
        await createQuest({
            title,
            location_name: locationName,
            start_time: new Date().toISOString(),
            end_time: new Date(Date.now() + 3 * 3600000).toISOString(),
            description: '',
            location: { lat: 30.2849, lng: -97.7341 },
            menu_items: menuItems.map(item => ({
                name: item.name,
                price: parseFloat(item.price) || 0,
                description: ''
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
                <Text style={styles.headerTitle}>{step === 'selection' ? 'Choose Origin' : 'Create Pop-up'}</Text>
                {step === 'form' ? (
                    <TouchableOpacity onPress={handleSaveDraft} style={styles.draftBtn}>
                        <Text style={styles.draftBtnText}>DRAFT</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={{ width: 40 }} />
                )}
            </View>

            {step === 'selection' ? (
                <MotiView
                    from={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    style={styles.selectionView}
                >
                    <Text style={styles.selectionHint}>How would you like to start?</Text>

                    <TouchableOpacity
                        style={styles.selectionOption}
                        onPress={() => setStep('form')}
                    >
                        <LinearGradient
                            colors={['rgba(255,107,53,0.15)', 'rgba(255,107,53,0.05)']}
                            style={styles.selectionGradient}
                        >
                            <Plus size={32} color="#ff6b35" />
                            <View>
                                <Text style={styles.optionTitle}>START FRESH</Text>
                                <Text style={styles.optionDesc}>Build a new experience from scratch</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>

                    {userTemplates.length === 0 ? (
                        <MotiView
                            from={{ opacity: 0, translateY: 10 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            style={styles.emptyCard}
                        >
                            <LinearGradient
                                colors={['rgba(255,255,255,0.03)', 'rgba(255,255,255,0.01)']}
                                style={styles.emptyGradient}
                            >
                                <Info size={24} color="rgba(255,255,255,0.2)" />
                                <Text style={styles.emptyText}>No previous events to use as origin.</Text>
                            </LinearGradient>
                        </MotiView>
                    ) : (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.templateList}
                        >
                            {userTemplates.map((source) => (
                                <TouchableOpacity
                                    key={source.quest_id}
                                    style={styles.templateCard}
                                    onPress={() => applyTemplate(source)}
                                >
                                    <LinearGradient
                                        colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.03)']}
                                        style={styles.templateGradient}
                                    />
                                    <Text style={styles.templateTitle} numberOfLines={1}>{source.title}</Text>
                                    <Text style={styles.templateDetail}>{source.location_name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}
                </MotiView>
            ) : (
                <>
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
                </>
            )}
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
    },
    draftBtn: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    draftBtnText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: '800',
        letterSpacing: 1,
    },
    selectionView: {
        flex: 1,
        padding: 24,
        gap: 24,
    },
    selectionHint: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        fontWeight: '600',
        textAlign: 'center',
        marginBottom: 8,
    },
    selectionOption: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    selectionGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 24,
        gap: 20,
    },
    optionTitle: {
        color: '#ff6b35',
        fontSize: 14,
        fontWeight: '900',
        letterSpacing: 1.5,
    },
    optionDesc: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 11,
        fontWeight: '500',
        marginTop: 4,
    },
    templatesSection: {
        flex: 1,
        marginTop: 12,
    },
    templatesLabel: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 2,
        marginBottom: 16,
    },
    templateItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 12,
        marginBottom: 12,
    },
    templateInfo: {
        flex: 1,
    },
    templateName: {
        color: '#f1f1f5',
        fontSize: 16,
        fontFamily: 'Outfit-Medium',
        marginBottom: 4,
    },
    templateType: {
        color: 'rgba(241,241,245,0.5)',
        fontSize: 12,
        fontFamily: 'Outfit-Regular',
        textTransform: 'uppercase',
    },
    emptyCard: {
        marginTop: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    emptyGradient: {
        padding: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        borderStyle: 'dashed',
        borderRadius: 16,
    },
    emptyText: {
        color: 'rgba(241,241,245,0.4)',
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        marginTop: 12,
        textAlign: 'center',
    },
    templateList: {
        paddingVertical: 10,
    },
    templateCard: {
        width: 160,
        height: 100,
        marginRight: 12,
        borderRadius: 16,
        padding: 16,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },
    templateGradient: {
        ...StyleSheet.absoluteFillObject,
    },
    templateTitle: {
        color: '#f1f1f5',
        fontSize: 15,
        fontFamily: 'Outfit-Bold',
        marginBottom: 4,
    },
    templateDetail: {
        color: 'rgba(241,241,245,0.6)',
        fontSize: 11,
        fontFamily: 'Outfit-Regular',
    },
});
