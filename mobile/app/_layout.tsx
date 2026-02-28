import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Slot } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider, useApp } from '../context/AppContext';
import LaunchScreen from './launch';

export const unstable_settings = {
  anchor: '(tabs)',
};

function RootContent() {
  const colorScheme = useColorScheme();
  const { currentUser, hasLaunched } = useApp();

  if (!hasLaunched) {
    return <LaunchScreen />;
  }

  // If no user is logged in, show the login screen
  if (!currentUser) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
      </Stack>
    );
  }

  // Otherwise, show the app tabs
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
