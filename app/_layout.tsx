import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, SplashScreen } from 'expo-router';
import { View, ActivityIndicator, LogBox } from 'react-native';
import { ErrorBoundary } from '../src/components/ErrorBoundary';
import { SubscriptionProvider } from '../src/contexts/SubscriptionContext';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ThemedView } from '@/components/ThemedView';
import 'react-native-reanimated';
import { ThemedText } from '@/components/ThemedText';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

LogBox.ignoreLogs(['Reanimated 2']);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        if (loaded) {
          console.log('Assets loaded, hiding splash screen...');
          await SplashScreen.hideAsync();
          setIsReady(true);
        }
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, [loaded]);

  if (!loaded || !isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator 
          size="large" 
          color="#9146FF"
        />
        <ThemedText style={{ marginTop: 10 }}>Loading...</ThemedText>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <SubscriptionProvider>
          <ThemedView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen 
                name="TodoDetailScreen" 
                options={{ headerShown: false }}
              />
            </Stack>
          </ThemedView>
        </SubscriptionProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </ErrorBoundary>
  );
}
