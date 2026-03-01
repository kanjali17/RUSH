import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { ChevronRight, MoreHorizontal, LogOut, User, ShieldCheck } from 'lucide-react-native';
import { useApp } from '../../context/AppContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { currentUser, posts } = useApp();
  const userPosts = posts.filter(p => p.user_id === currentUser?.id);

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
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => router.push('/settings' as any)}
          >
            <MoreHorizontal size={24} color="#f1f1f5" />
          </TouchableOpacity>
        </MotiView>

        <View style={styles.userSection}>
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            style={styles.avatarContainer}
          >
            <View style={styles.avatarGlow} />
            <View style={styles.avatarCircle}>
              <Image
                source={{ uri: currentUser?.profile_photo || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200' }}
                style={styles.avatarImage}
              />
            </View>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 200 }}
            style={styles.userInfo}
          >
            <Text style={styles.userName}>{currentUser?.display_name || 'Alex Rush'}</Text>
            <Text style={styles.userHandle}>@{currentUser?.instagram_handle || 'alex_rush'}</Text>
            <Text style={styles.userBio}>
              {currentUser?.bio || 'Fueling late night architecture studio sessions. Collector of rare snacks and underground pop-ups.'}
            </Text>
          </MotiView>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>POPUPS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userPosts.length}</Text>
              <Text style={styles.statLabel}>POSTS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>850</Text>
              <Text style={styles.statLabel}>FOLLOWING</Text>
            </View>
          </View>
        </View>

        <View style={styles.gridSection}>
          {userPosts.length > 0 ? (
            <View style={styles.gridContainer}>
              {userPosts.map((post) => (
                <View key={post.id} style={styles.gridItem}>
                  <Image
                    source={{ uri: post.image_url }}
                    style={styles.gridImage}
                  />
                </View>
              ))}
              {/* Fill remaining space to maintain 3-column look if needed */}
              {userPosts.length % 3 !== 0 &&
                Array(3 - (userPosts.length % 3)).fill(0).map((_, i) => (
                  <View key={`empty-${i}`} style={styles.gridItem} />
                ))
              }
            </View>
          ) : (
            <View style={styles.emptyGrid}>
              <Text style={styles.emptyGridText}>NO POSTS YET</Text>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    paddingHorizontal: 0, // Wide content for grid and stats row
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
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
    marginBottom: 20,
  },
  avatarContainer: {
    width: 120,
    height: 120,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarGlow: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#ff6b35',
    shadowColor: '#ff6b35',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  avatarCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#000',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  userInfo: {
    alignItems: 'center',
    paddingHorizontal: 40,
    marginBottom: 30,
  },
  userName: {
    color: '#f1f1f5',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  userHandle: {
    color: '#ff6b35',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 16,
  },
  userBio: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    color: '#f1f1f5',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 2,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  gridSection: {
    marginTop: 20,
    paddingHorizontal: 1,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 2,
  },
  gridItem: {
    width: '33.1%',
    aspectRatio: 1,
    backgroundColor: '#050505',
    position: 'relative',
  },
  gridImage: {
    width: '100%',
    height: '100%',
  },
  emptyGrid: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyGridText: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },
  gridActiveDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff6b35',
  }
});
