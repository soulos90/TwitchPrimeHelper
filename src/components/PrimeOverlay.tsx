import React from 'react';
import { View, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions, Platform } from 'react-native';
import { useOverlay } from '../contexts/OverlayContext';
import { ThemedText } from '../../components/ThemedText';
import * as Haptics from 'expo-haptics';
const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);
import BrowserService from '../services/BrowserService';
import { useGuidedBrowserFlow } from '../hooks/useGuidedBrowserFlow';

const OVERLAY_SIZE = 60;

export const PrimeOverlay = () => {
  const { isVisible, position, isExpanded, setPosition, setIsExpanded } = useOverlay();
  const pan = React.useRef(new Animated.ValueXY()).current;
  const { startPrimeLinkFlow, startSubscribeFlow } = useGuidedBrowserFlow();

  const keepInBounds = (x: number, y: number) => {
    const window = Dimensions.get('window');
    const maxX = window.width - (isExpanded ? 250 : OVERLAY_SIZE);
    const maxY = window.height - (isExpanded ? 200 : OVERLAY_SIZE);
    
    return {
      x: Math.min(Math.max(0, x), maxX),
      y: Math.min(Math.max(0, y), maxY),
    };
  };

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Only start pan if movement is significant
        return Math.abs(gestureState.dx) > 5 || Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Prevent expanding while dragging
        if (isExpanded) {
          setIsExpanded(false);
        }
        const newPosition = keepInBounds(
          position.x + gestureState.dx,
          position.y + gestureState.dy
        );
        pan.setValue({
          x: newPosition.x - position.x,
          y: newPosition.y - position.y,
        });
      },
      onPanResponderRelease: (_, gestureState) => {
        const newPosition = keepInBounds(
          position.x + gestureState.dx,
          position.y + gestureState.dy
        );
        setPosition(newPosition);
        pan.setValue({ x: 0, y: 0 });
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
    })
  ).current;

  // Adjust position when expanding to prevent going off screen
  React.useEffect(() => {
    if (isExpanded) {
      const newPosition = keepInBounds(position.x, position.y);
      setPosition(newPosition);
    }
  }, [isExpanded]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          position: 'absolute',
          elevation: 1000,
          zIndex: Platform.OS === 'ios' ? 1000 : undefined,
          transform: [
            { translateX: pan.x }, 
            { translateY: pan.y },
          ],
          left: position.x,
          top: position.y,
        },
      ]}
    >
      <AnimatedTouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setIsExpanded(!isExpanded);
        }}
        style={[styles.button, isExpanded && styles.expandedButton]}
        {...panResponder.panHandlers}
      >
        {isExpanded ? (
          <View style={styles.expandedContent}>
            <ThemedText style={styles.title}>Link Amazon Prime</ThemedText>
            <TouchableOpacity 
              onPress={() => startPrimeLinkFlow()}
              style={styles.linkButton}
            >
              <ThemedText style={styles.linkButtonText}>Open Twitch Settings</ThemedText>
            </TouchableOpacity>
            <ThemedText style={styles.instructions}>
              1. Go to Twitch Settings{'\n'}
              2. Select 'Connections'{'\n'}
              3. Find Amazon Prime{'\n'}
              4. Click 'Connect'
            </ThemedText>
          </View>
        ) : (
          <ThemedText style={styles.buttonText}>🎮</ThemedText>
        )}
      </AnimatedTouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
    elevation: Platform.OS === 'android' ? 1000 : undefined,
    width: OVERLAY_SIZE,
    height: OVERLAY_SIZE,
  },
  button: {
    width: OVERLAY_SIZE,
    height: OVERLAY_SIZE,
    borderRadius: OVERLAY_SIZE / 2,
    backgroundColor: '#9146FF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expandedButton: {
    width: 250,
    height: 'auto',
    borderRadius: 12,
    padding: 16,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 24,
  },
  expandedContent: {
    gap: 12,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  instructions: {
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 20,
  },
  linkButton: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: 'center',
  },
  linkButtonText: {
    color: '#9146FF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
