import React, { createContext, useContext, useState, useEffect } from 'react';
import { Dimensions, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ANIMATION_DURATION = 300;

type Position = {
  x: number;
  y: number;
};

type OverlayContextType = {
  isVisible: boolean;
  position: Position;
  isExpanded: boolean;
  setIsVisible: (visible: boolean) => void;
  setPosition: (position: Position) => void;
  setIsExpanded: (expanded: boolean) => void;
};

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

const POSITION_STORAGE_KEY = '@overlay_position';

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false); // Set initial state to false
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultPosition = {
    x: Dimensions.get('window').width - 80,
    y: Dimensions.get('window').height / 2,
  };
  const [position, setPosition] = useState(defaultPosition);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load saved position
    const loadPosition = async () => {
      try {
        const savedPosition = await AsyncStorage.getItem(POSITION_STORAGE_KEY);
        // Fade in animation when position is loaded
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: ANIMATION_DURATION,
          useNativeDriver: true,
        }).start();

        if (savedPosition) {
          setPosition(JSON.parse(savedPosition));
        }
      } catch (error) {
        console.warn('Failed to load overlay position:', error);
      }
    };
    loadPosition();
  }, []);

  const handleSetPosition = async (newPosition: Position) => {
    setPosition(newPosition);
    await AsyncStorage.setItem(POSITION_STORAGE_KEY, JSON.stringify(newPosition));
  };

  return (
    <OverlayContext.Provider
      value={{
        isVisible,
        position,
        isExpanded,
        setIsVisible,
        setPosition: handleSetPosition,
        setIsExpanded,
      }}>
      {children}
    </OverlayContext.Provider>
  );
}

export function useOverlay() {
  const context = useContext(OverlayContext);
  if (context === undefined) {
    throw new Error('useOverlay must be used within an OverlayProvider');
  }
  return context;
}
