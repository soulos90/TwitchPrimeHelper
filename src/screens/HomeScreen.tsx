import React, { useEffect, useState } from 'react';
import { StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/theme';
import { Colors } from '@/constants/Colors';
import OverlayManager from '../services/OverlayManager';
import { useOverlay } from '../contexts/OverlayContext';
import { useGuidedBrowserFlow } from '../hooks/useGuidedBrowserFlow';

export const HomeScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const { setIsVisible } = useOverlay();
  const { startPrimeLinkFlow } = useGuidedBrowserFlow();

  const openTwitch = async () => {
    try {
      console.log('Starting openTwitch function');
      setIsLoading(true);
      await startPrimeLinkFlow();
      console.log('Finished startPrimeLinkFlow');
    } catch (error) {
      console.error('Error opening Twitch:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('Initializing overlay...');
    const initializeOverlay = async () => {
      const hasPermission = await OverlayManager.requestOverlayPermission();
      if (hasPermission) {
        console.log('Overlay permission granted, showing overlay...');
        setIsVisible(false); // Ensure this line is uncommented to show the overlay
      }
    };
    setTimeout(initializeOverlay, 1000); // Add a small delay to ensure proper initialization
  }, []);

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedText style={styles.title} type="title">Twitch Prime Helper</ThemedText>
      <ThemedText type="subtitle">Manage Your Twitch Prime Subscriptions</ThemedText>
      <Pressable 
        style={[styles.button, { backgroundColor: '#9146FF' }]} 
        onPress={openTwitch}
        disabled={isLoading}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <ThemedText style={styles.buttonText}>Open Twitch</ThemedText>
        )}
      </Pressable>
      <ThemedText style={styles.helpText}>
        Open Twitch in your browser and sign in with your account.
      </ThemedText>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg
  },
  title: {
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  helpText: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    opacity: 0.8,
  },
});
