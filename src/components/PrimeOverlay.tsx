import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import * as Haptics from 'expo-haptics';
import { TodoItem } from './TodoList';

interface PrimeOverlayProps {
  todo: TodoItem | null;
  onClose: () => void;
  visible: boolean;
}

export const PrimeOverlay: React.FC<PrimeOverlayProps> = ({ todo, onClose, visible }) => {
  if (!todo || !visible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{todo.title}</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#9146FF',
    borderRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
    marginVertical: 12,
  },
  linkButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#9146FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
