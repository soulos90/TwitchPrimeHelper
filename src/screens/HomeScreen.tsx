import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { useColorScheme } from '@/hooks/useColorScheme';
import { StepStamp } from '@/src/components/StepStamp';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { theme } from '@/theme';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useSubscription } from '../contexts/SubscriptionContext';
import Checkbox from 'expo-checkbox';
import { Ionicons } from '@expo/vector-icons';

interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url: string;
}

const initialTodos: Todo[] = [
  { id: '1', title: 'Log in to Twitch', description: 'Sign in to your Twitch account to get started', completed: false, url: 'https://www.twitch.tv/login' },
  { id: '2', title: 'Link Twitch to Amazon Prime', description: 'Ensure your Twitch account is linked to Amazon Prime', completed: false, url: 'https://www.twitch.tv/prime' },
  { id: '3', title: 'Choose Channel to use Prime on', description: 'Select the channel to use your Twitch Prime on.', completed: false, url: 'https://www.twitch.tv/directory/following/channels' },
  { id: '4', title: 'Use Prime Subscription', description: 'Subscribe to your preferred channel using Prime', completed: false, url: 'https://www.twitch.tv/subs/{channel_name}' },
];

export const HomeScreen = () => {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const { daysUntilNextSubscription, tasks, markTaskComplete } = useSubscription();

  useEffect(() => {
    if (daysUntilNextSubscription === 0) {
      setTodos(prevTodos => prevTodos.map(todo => todo.id === '4' ? { ...todo, completed: false } : todo));
    }
  }, [daysUntilNextSubscription]);

  useEffect(() => {
    setTodos(prevTodos => prevTodos.map(todo => ({
      ...todo,
      completed: tasks[todo.id] || false,
    })));
  }, [tasks]);

  const toggleCompletion = async (id: string) => {
    await markTaskComplete(id);
    setTodos(prevTodos => prevTodos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const handleTodoSelect = (todo: Todo) => {
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
    <ThemedView style={styles.outerContainer}> 
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <ThemedText style={styles.title} type="title">Twitch Prime Helper</ThemedText>
          <ThemedText style={styles.description}>
            This app helps you manage your Twitch Prime subscription. A Prime must be manually renewed every 30 days, which can be cumbersome. This app guides you through the process step-by-step and provides timely reminders.
          </ThemedText>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {todos.map(todo => (
            <View key={todo.id} style={[styles.todoItem, { backgroundColor: todo.completed ? '#4A90E2' : '#357ABD' }]}> 
              <StepStamp step={parseInt(todo.id)} />
              <Checkbox
                value={todo.completed}
                onValueChange={() => toggleCompletion(todo.id)}
                color={todo.completed ? '#34C759' : '#AAAAAA'}
              />
              <TouchableOpacity 
                style={styles.todoButton}
                onPress={() => handleTodoSelect(todo)}
              >
                <ThemedText style={styles.todoTitle}>{todo.title}</ThemedText>
                <Ionicons name="chevron-forward" size={24} color="#32CD32" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#064635',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '10%',
  },
  innerContainer: {
    width: '90%',
    borderRadius: 20,
    backgroundColor: '#fff',
    padding: 20,
  },
  headerContainer: {
    backgroundColor: '#1E88E5',
    borderRadius: 15,
    padding: 15,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#fff',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#fff',
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 10,
    paddingTop: 10,
  },
  todoItem: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%',
    justifyContent: 'space-between',
    minHeight: 70, // Set minimum height to accommodate two lines of text
  },
  todoTitle: {
    fontSize: 18,
    color: '#fff',
    flex: 1,
  },
  todoButton:{
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
});
