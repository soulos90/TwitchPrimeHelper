import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { ThemedText } from '../../components/ThemedText';
import { useGuidedBrowser } from '../contexts/GuidedBrowserContext';
import * as Haptics from 'expo-haptics';

export const WebBrowserOverlay: React.FC = () => {
  const { currentStep, isGuideVisible, nextStep, previousStep } = useGuidedBrowser();
  const fadeAnimation = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: isGuideVisible ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isGuideVisible]);

  if (!isGuideVisible || !currentStep) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
      <View style={styles.overlay}>
        <View style={styles.guideBox}>
          <ThemedText style={styles.title}>{currentStep.title}</ThemedText>
          <ThemedText style={styles.description}>{currentStep.description}</ThemedText>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                previousStep();
              }}>
              <ThemedText style={styles.buttonText}>Previous</ThemedText>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={async () => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                if (currentStep.action) {
                  console.log(`Executing action for step: ${currentStep.id}`);
                  await currentStep.action();
                }
                nextStep();
              }}>
              <ThemedText style={styles.buttonText}>Next</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    color: '#333333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#EEEEEE',
    flex: 1,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#9146FF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
