import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export interface TodoItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  url?: string;
}

interface TodoListProps {
  items: TodoItem[];
  onItemSelect: (item: TodoItem) => void;
}

export const TodoList: React.FC<TodoListProps> = ({ items, onItemSelect }) => {
  const colorScheme = useColorScheme();

  return (
    <ScrollView style={styles.container}>
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.item,
            {
              backgroundColor: Colors[colorScheme ?? 'light'].background,
              borderColor: item.completed ? '#4CAF50' : '#9146FF',
            },
          ]}
          onPress={() => onItemSelect(item)}
        >
          <View style={styles.itemContent}>
            <View style={styles.titleRow}>
              <ThemedText type="defaultSemiBold" style={styles.title}>
                {item.title}
              </ThemedText>
              {item.completed && (
                <View style={styles.checkmark}>
                  <ThemedText style={styles.checkmarkText}>✓</ThemedText>
                </View>
              )}
            </View>
            <ThemedText style={styles.description}>{item.description}</ThemedText>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  item: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  itemContent: {
    gap: 8,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
  },
  description: {
    opacity: 0.7,
  },
  checkmark: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
