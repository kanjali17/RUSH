import { Tabs, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Camera, Rocket, X, Users, Compass, Ticket, User, Plus, Ghost } from 'lucide-react-native';
import { View, StyleSheet, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(10, 10, 12, 0.95)',
            borderTopWidth: 1,
            borderTopColor: 'rgba(255, 255, 255, 0.05)',
            height: 65 + insets.bottom,
            paddingTop: 10,
            position: 'absolute',
          },
          tabBarActiveTintColor: '#ff6b35',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.3)',
          tabBarLabelStyle: {
            fontSize: 8,
            fontWeight: '900',
            letterSpacing: 0.5,
            marginTop: 4,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'DISCOVER',
            tabBarIcon: ({ color }) => <Compass size={24} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="following"
          options={{
            title: 'FOLLOWING',
            tabBarIcon: ({ color }) => <Users size={24} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="create_tab_dummy"
          options={{
            title: 'CREATE',
            tabBarIcon: ({ focused }) => (
              <View style={styles.createBtnWrapper}>
                <MotiView
                  animate={{ scale: focused ? 1.1 : 1 }}
                  style={styles.createBtnGlow}
                />
                <LinearGradient
                  colors={['#ff6b35', '#ff9f42']}
                  style={styles.createBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Plus size={28} color="#000" strokeWidth={3} />
                </LinearGradient>
              </View>
            ),
            tabBarLabel: ({ focused }) => (
              <Text style={[styles.createLabel, { color: focused ? '#ff6b35' : 'rgba(255, 255, 255, 0.3)' }]}>
                CREATE
              </Text>
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              setShowCreateModal(true);
            },
          })}
        />
        <Tabs.Screen
          name="rsvps"
          options={{
            title: 'RSVP',
            tabBarIcon: ({ color }) => <Ticket size={24} color={color} strokeWidth={2.5} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'PROFILE',
            tabBarIcon: ({ color }) => <User size={24} color={color} strokeWidth={2.5} />,
          }}
        />
      </Tabs>

      <Modal
        visible={showCreateModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowCreateModal(false)}
        >
          <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>CREATE NEW</Text>
              <TouchableOpacity onPress={() => setShowCreateModal(false)} style={styles.modalCloseBtn}>
                <X size={20} color="rgba(255,255,255,0.4)" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalOptions}>
              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  router.push('/create');
                }}
              >
                <LinearGradient
                  colors={['rgba(255,107,53,0.1)', 'rgba(255,107,53,0.05)']}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIconBox}>
                    <Rocket size={24} color="#ff6b35" />
                  </View>
                  <View style={styles.optionTextContent}>
                    <Text style={styles.optionTitle}>ANNOUNCE POPUP</Text>
                    <Text style={styles.optionSub}>Share your location and menu</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  router.push('/create-post' as any);
                }}
              >
                <LinearGradient
                  colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.02)']}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIconBox}>
                    <Camera size={24} color="#fff" />
                  </View>
                  <View style={styles.optionTextContent}>
                    <Text style={styles.optionTitle}>POST TO FEED</Text>
                    <Text style={styles.optionSub}>Share a vibe or highlight</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionBtn}
                onPress={() => {
                  setShowCreateModal(false);
                  router.push('/start-rumor' as any);
                }}
              >
                <LinearGradient
                  colors={['rgba(214,64,255,0.1)', 'rgba(214,64,255,0.05)']}
                  style={styles.optionGradient}
                >
                  <View style={styles.optionIconBox}>
                    <Ghost size={24} color="#d640ff" />
                  </View>
                  <View style={styles.optionTextContent}>
                    <Text style={styles.optionTitle}>START A RUMOR</Text>
                    <Text style={styles.optionSub}>Tease an upcoming drop</Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  createBtnWrapper: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createBtnGlow: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6b35',
    opacity: 0.2,
  },
  createBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  createLabel: {
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 2,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOptions: {
    gap: 16,
  },
  optionBtn: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  optionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 16,
  },
  optionIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextContent: {
    flex: 1,
  },
  optionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  optionSub: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '500',
  }
});
