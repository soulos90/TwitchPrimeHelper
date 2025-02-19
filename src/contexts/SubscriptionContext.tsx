import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SubscriptionState {
  lastSubscriptionDate: string | null;
  preferredChannel: string;
  nextAvailableDate: string | null;
  tasks: { [key: string]: boolean };
}

interface SubscriptionContextType extends SubscriptionState {
  updateSubscriptionDate: (date: string) => Promise<void>;
  updatePreferredChannel: (channel: string) => Promise<void>;
  clearSubscriptionData: () => Promise<void>;
  markTaskComplete: (id: string) => Promise<void>;
  daysUntilNextSubscription: number;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LAST_SUB_DATE: '@subscription_last_date',
  PREFERRED_CHANNEL: '@subscription_preferred_channel',
  TASKS: '@subscription_tasks',
};

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SubscriptionState>({
    lastSubscriptionDate: null,
    preferredChannel: 'northdeltagames',
    nextAvailableDate: null,
    tasks: {},
  });

  useEffect(() => {
    loadStoredData();
  }, []);

  const loadStoredData = async () => {
    try {
      const [lastDate, channel, tasks] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LAST_SUB_DATE),
        AsyncStorage.getItem(STORAGE_KEYS.PREFERRED_CHANNEL),
        AsyncStorage.getItem(STORAGE_KEYS.TASKS),
      ]);

      const parsedTasks = tasks ? JSON.parse(tasks) : {};
      const parsedLastDate = lastDate && !isNaN(Date.parse(lastDate)) ? lastDate : null;
      const nextAvailable = parsedLastDate ? calculateNextDate(parsedLastDate) : null;

      setState(prev => ({
        ...prev,
        lastSubscriptionDate: parsedLastDate,
        preferredChannel: channel || 'northdeltagames',
        nextAvailableDate: nextAvailable,
        tasks: parsedTasks,
      }));
    } catch (error) {
      console.error('Error loading subscription data:', error);
    }
  };

  const calculateNextDate = (lastDate: string): string => {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString();
  };

  const updateSubscriptionDate = async (date: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_SUB_DATE, date);
      setState(prev => ({
        ...prev,
        lastSubscriptionDate: date,
        nextAvailableDate: calculateNextDate(date),
      }));
    } catch (error) {
      console.error('Error saving subscription date:', error);
    }
  };

  const markTaskComplete = async (id: string) => {
    const updatedTasks = { ...state.tasks, [id]: !state.tasks[id] };
    await AsyncStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(updatedTasks));
    setState(prev => ({
      ...prev,
      tasks: updatedTasks,
    }));
  };

  const updatePreferredChannel = async (channel: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.PREFERRED_CHANNEL, channel);
      setState(prev => ({
        ...prev,
        preferredChannel: channel,
      }));
    } catch (error) {
      console.error('Error saving preferred channel:', error);
    }
  };

  const clearSubscriptionData = async () => {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.LAST_SUB_DATE,
        STORAGE_KEYS.PREFERRED_CHANNEL,
        STORAGE_KEYS.TASKS,
      ]);
      setState({
        lastSubscriptionDate: null,
        preferredChannel: 'northdeltagames',
        nextAvailableDate: null,
        tasks: {},
      });
    } catch (error) {
      console.error('Error clearing subscription data:', error);
    }
  };

  const getDaysUntilNextSubscription = (): number => {
    if (!state.nextAvailableDate) return 0;
    const now = new Date();
    const next = new Date(state.nextAvailableDate);
    const diffTime = next.getTime() - now.getTime();
    return Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 0);
  };

  return (
    <SubscriptionContext.Provider
      value={{
        ...state,
        updateSubscriptionDate,
        updatePreferredChannel,
        clearSubscriptionData,
        markTaskComplete,
        daysUntilNextSubscription: getDaysUntilNextSubscription(),
      }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}
