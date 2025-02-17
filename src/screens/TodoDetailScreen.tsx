import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Linking, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useLocalSearchParams } from 'expo-router';

const taskInstructions = {
  '1': {
    title: 'Log in to Twitch',
    description: 'Guide users to log into Twitch via an in-app browser. Provide instructions to handle login difficulties.',
    link: 'https://www.twitch.tv/login',
  },
  '2': {
    title: 'Check Amazon Prime Linkage to Twitch',
    description: 'Verify if the user’s Twitch account is linked to Amazon Prime. Provide a walkthrough for linking Twitch and Prime if necessary.',
    link: 'https://www.twitch.tv/prime',
  },
  '3': {
    title: 'Access Followed Channels List',
    description: 'Display a user’s followed Twitch channels. Allow the user to select a preferred channel for Prime subscriptions.',
    link: 'https://www.twitch.tv/directory/following',
  },
  '4': {
    title: 'Navigate to the Subscription Page',
    description: 'Guide users to their selected channel’s subscription page. Provide iOS and Android-specific images to reduce confusion.',
    link: 'https://www.twitch.tv/subs/{channel_name}',
  },
  '5': {
    title: 'Subscribe with Prime',
    description: 'Assist users in selecting "Subscribe with Prime" and confirming the subscription. Provide troubleshooting steps for common issues.',
  },
  '6': {
    title: 'Set Subscription Reminder',
    description: 'Once a Prime subscription is used, trigger a 30-day countdown. Send a push notification and add a red dot to the app icon as a reminder.',
  },
};

export const TodoDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const { id } = params;
  const task = taskInstructions[id as keyof typeof taskInstructions];

  if (!task) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={styles.title} type="title">Task Not Found</ThemedText>
        <ThemedText style={styles.description}>The requested task does not exist.</ThemedText>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedText style={styles.title} type="title">{task.title}</ThemedText>
        <ThemedText style={styles.description}>{task.description}</ThemedText>
        {'link' in task && task.link && (
          <TouchableOpacity onPress={() => Linking.openURL(task.link)} style={styles.linkButton}>
            <Text style={styles.linkButtonText}>Open Guide</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    alignItems: 'center',
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    marginBottom: 16,
    fontSize: 16,
    textAlign: 'center',
  },
  linkButton: {
    backgroundColor: '#9146FF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
