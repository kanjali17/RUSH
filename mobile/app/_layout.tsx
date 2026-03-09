import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useApp } from '../context/AppContext';


// Remove unstable_settings to ensure app/index.tsx (splash) is the true entry point
/*
export const unstable_settings = {
  anchor: '(tabs)',
};
*/

function RootContent() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { currentUser, hasLaunched, loading } = useApp();

  useEffect(() => {
    if (loading) return;

    if (currentUser) {
      router.replace('/(tabs)');
    } else if (hasLaunched) {
      router.replace('/(auth)/login');
    }
  }, [currentUser, hasLaunched, loading]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#ff6b35" />
      </View>
    );
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/signup" />
        <Stack.Screen name="(auth)/verify" />
        <Stack.Screen name="(auth)/vibe" />
        <Stack.Screen name="(auth)/final-touches" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AppProvider>
      <RootContent />
    </AppProvider>
  );
}
