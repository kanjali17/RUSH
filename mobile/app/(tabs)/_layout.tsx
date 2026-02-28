import { Tabs } from 'expo-router';
import React from 'react';
import { Map, Users, Plus, Ticket, User, Compass, Flame } from 'lucide-react-native';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
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
            navigation.navigate('create');
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
  }
});
