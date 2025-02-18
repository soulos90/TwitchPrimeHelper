import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StepStampProps {
  step: number;
}

export const StepStamp: React.FC<StepStampProps> = ({ step }) => {
  return (
    <View style={styles.stampContainer}>
      <Text style={styles.stampText}>Step {step}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  stampContainer: {
    position: 'absolute',
    left: -5,
    top: -5,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    transform: [{ rotate: '-15deg' }],
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  stampText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});
