import * as WebBrowser from 'expo-web-browser';
import { Linking, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import { WebBrowserPresentationStyle } from 'expo-web-browser';
import { GuideStep } from '../contexts/GuidedBrowserContext';

class BrowserService {
  static async openURL(url: string, onComplete?: () => void) {
    try {
      console.log(`Opening URL: ${url}`);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      console.log('Opening browser...');
      const result = await WebBrowser.openBrowserAsync(url, {
        toolbarColor: '#9146FF',
        controlsColor: 'white',
        presentationStyle: Platform.OS === 'ios' ? WebBrowserPresentationStyle.PAGE_SHEET : undefined,
      });

      console.log(`Browser opened with result: ${JSON.stringify(result)}`);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (onComplete) {
        console.log('Executing onComplete callback...');
        onComplete();
      }

      console.log('Returning result...');
      return result;
    } catch (error) {
      console.error('Error opening browser:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      // Fallback to external browser with error handling
      const canOpen = await Linking.canOpenURL(url);
      console.log(`Can open URL with Linking: ${canOpen}`);
      if (canOpen) {
        console.log('Opening URL with Linking...');
        await Linking.openURL(url);
      }
    }
  }

  static createGuideSteps(steps: Partial<GuideStep>[]): GuideStep[] {
    return steps.map((step, index) => ({
      id: `step-${index}`,
      title: step.title || '',
      description: step.description || '',
      ...step,
    }));
  }
}

export default BrowserService;
