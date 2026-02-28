import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Settings, ChevronRight, User, Bell, CreditCard, HelpCircle, LogOut, Verified, ShieldCheck, Heart, Plus, Cog } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RushCard } from '../../components/rush/RushCard';
import { RushButton } from '../../components/rush/RushButton';
import { useRouter } from 'expo-router';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, logout } = useApp();

  const MENU_ITEMS = [
    { id: '1', title: 'Profile Details', sub: 'Name, email, and social handle', icon: <User size={18} color="#9ca3af" /> },
    { id: '2', title: 'Set Preferences', sub: 'Notifications, security, and privacy', icon: <ShieldCheck size={18} color="#9ca3af" /> },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={styles.topHeader}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
            <ChevronRight size={24} color="#f1f1f5" style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>PROFILE</Text>
          <TouchableOpacity style={styles.headerBtn}>
            <Cog size={22} color="#f1f1f5" />
          </TouchableOpacity>
        </MotiView>

        <View style={styles.userSection}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            style={styles.avatarWrapper}
          >
            <View style={styles.avatarCircle}>
              <LinearGradient
                colors={['#ff6b35', '#ff9f42']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              <View style={styles.avatarInner}>
                <Image
                  source={{ uri: currentUser?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                  style={styles.avatarImage}
                />
              </View>
              <View style={styles.statusBadge}>
                <MotiView animate={{ scale: [1, 1.2, 1] }} transition={{ loop: true, duration: 1500 }}>
                  <Flame size={12} color="#000" fill="#000" />
                </MotiView>
              </View>
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            style={styles.userInfo}
          >
            <Text style={styles.userName}>Alex Rush</Text>
            <View style={styles.badgeRow}>
              <Text style={styles.badgeText}>ELITE MEMBER</Text>
              <Text style={styles.badgeDivider}>•</Text>
              <Text style={styles.badgeText}>PRO VOYAGER</Text>
            </View>
            <Text style={styles.userBio}>
              Fueling late night architecture studio sessions. Collector of rare snacks.
            </Text>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 400 }}
          style={styles.section}
        >
          <RushCard variant="glass" style={styles.personalizationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBoxSmall}>
                <Utensils size={14} color="#ff6b35" />
              </View>
              <Text style={styles.sectionLabel}>PERSONALIZATION</Text>
            </View>
            <Text style={styles.cardTitle}>Refine your Cravings</Text>
            <Text style={styles.cardDesc}>
              Take the Personality Quiz to unlock a customized campus food map.
            </Text>
            <TouchableOpacity style={styles.actionBtn}>
              <LinearGradient
                colors={['#ff6b35', '#ff9f42']}
                style={styles.gradientBtn}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.actionBtnText}>REFINE TASTE PROFILE</Text>
                <ChevronRight size={18} color="#000" strokeWidth={3} />
              </LinearGradient>
            </TouchableOpacity>
          </RushCard>
        </MotiView>

        <View style={styles.section}>
          <Text style={styles.sectionHeaderLabel}>ACCOUNT MANAGEMENT</Text>
          <RushCard variant="glass" style={styles.menuCard}>
            {MENU_ITEMS.map((item, idx) => (
              <View key={item.id}>
                <TouchableOpacity style={styles.menuItem}>
                  <View style={styles.menuIconBox}>
                    {item.icon}
                  </View>
                  <View style={styles.menuTextContent}>
                    <Text style={styles.menuItemTitle}>{item.title}</Text>
                    <Text style={styles.menuItemSub}>{item.sub}</Text>
                  </View>
                  <ChevronRight size={18} color="rgba(255,255,255,0.1)" />
                </TouchableOpacity>
                {idx < MENU_ITEMS.length - 1 && <View style={styles.divider} />}
              </View>
            ))}
          </RushCard>
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => {
            logout();
            router.replace('/(auth)/login');
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <LogOut size={18} color="#f87171" />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

import { Flame, Utensils } from 'lucide-react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginBottom: 20,
  },
  headerBtn: {
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
  userSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrapper: {
    marginBottom: 24,
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: 52,
    padding: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    backgroundColor: '#000',
    padding: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 48,
    backgroundColor: '#1a1a1a',
  },
  statusBadge: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: '#ff6b35',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#000',
    zIndex: 10,
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userName: {
    color: '#f1f1f5',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -1,
    marginBottom: 4,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  badgeText: {
    color: '#ff6b35',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  badgeDivider: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
  },
  userBio: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
    paddingHorizontal: 10,
  },
  logoutText: {
    color: '#f87171',
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    marginBottom: 30,
  },
  personalizationCard: {
    padding: 20,
    backgroundColor: 'rgba(255, 107, 53, 0.03)',
    borderColor: 'rgba(255, 107, 53, 0.1)',
    borderRadius: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },
  iconBoxSmall: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: 'rgba(255,107,53,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionLabel: {
    color: '#ff6b35',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  cardTitle: {
    color: '#f1f1f5',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 24,
    fontWeight: '600',
  },
  actionBtn: {
    height: 54,
    borderRadius: 14,
    overflow: 'hidden',
  },
  gradientBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  actionBtnText: {
    color: '#000',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionHeaderLabel: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 16,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
    borderRadius: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 16,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.02)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuTextContent: {
    flex: 1,
  },
  menuItemTitle: {
    color: '#f1f1f5',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  menuItemSub: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginHorizontal: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 10,
    paddingVertical: 12,
  },
});
