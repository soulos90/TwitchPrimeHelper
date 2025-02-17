import React, { useState, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { TodoList, TodoItem } from '../components/TodoList';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

const initialTodos: TodoItem[] = [
  {
    id: '1',
    title: 'Log in to Twitch',
    description: 'Sign in to your Twitch account to get started',
    completed: false,
    url: 'https://www.twitch.tv/login'
  },
  {
    id: '2',
    title: 'Link Twitch to Amazon Prime',
    description: 'Ensure your Twitch account is linked to Amazon Prime',
    completed: false,
    url: 'https://www.twitch.tv/prime'
  },
  {
    id: '3',
    title: 'Use Prime Subscription',
    description: 'Subscribe to your preferred channel using Prime',
    completed: false,
    url: 'https://www.twitch.tv/subs/{channel_name}'
  },
];

export const HomeScreen = () => {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [selectedTodo, setSelectedTodo] = useState<TodoItem | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { updateSubscriptionDate, daysUntilNextSubscription } = useSubscription();

  useEffect(() => {
    if (daysUntilNextSubscription === 0) {
      setTodos(prevTodos => prevTodos.map(todo => 
        todo.id === '3' ? { ...todo, completed: false } : todo
      ));
    }
  }, [daysUntilNextSubscription]);

  const handleTodoSelect = (todo: TodoItem) => {
    router.push({
      pathname: '/(tabs)/tododetail',
      params: {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        url: todo.url,
      },
    });
  };   

  return (
    <ThemedView style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      <ThemedText style={styles.title} type="title">Twitch Prime Helper</ThemedText>
      <ThemedText style={styles.description}>
        This app helps you manage your Twitch Prime subscriptions. Twitch Prime subscriptions must be manually renewed every 30 days, which can be cumbersome. This app guides you through the process step-by-step and provides timely reminders.
      </ThemedText>
      <TodoList items={todos} onItemSelect={handleTodoSelect} />
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
  description: {
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  helpText: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    opacity: 0.8,
  },
});
