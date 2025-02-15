import { useCallback } from 'react';
import { useGuidedBrowser } from '../contexts/GuidedBrowserContext';
import BrowserService from '../services/BrowserService';
import OverlayManager from '../services/OverlayManager';

export const useGuidedBrowserFlow = () => {
  const { setSteps, setCurrentStep, setIsGuideVisible } = useGuidedBrowser();
  const { setIsVisible } = OverlayManager;

  const initializeGuide = (steps: { id: string; title: string; description: string; action?: () => void }[]) => {
    console.log('Initializing Guide');
    setSteps(steps);
    console.log('Setting current step');
    setCurrentStep(steps[0]);
    console.log('Setting guide visible');
    setIsGuideVisible(true);
    console.log('Guide initialized');
  };

  const executeStep = async (step: { id: string; title: string; description: string; action?: () => void }) => {
    if (step.action) {
      console.log(`Executing action for step: ${step.id}`);
      await step.action();
    }
    console.log('Showing overlay...');
    setIsVisible(true);
  };

  const startPrimeLinkFlow = useCallback(async () => {
    console.log('Starting Prime Link Flow');
    const steps = [
      {
        id: 'login',
        title: 'Sign in to Twitch',
        description: 'First, sign in to your Twitch account.',
        action: async () => {
          console.log('Executing action: Opening Twitch login');
          await BrowserService.openURL('https://www.twitch.tv/login');
        },
      },
      {
        id: 'prime-link',
        title: 'Link Amazon Prime',
        description: 'Connect your Amazon Prime account to get Twitch Prime benefits.',
        action: async () => {
          console.log('Executing action: Opening Twitch settings');
          await BrowserService.openURL('https://www.twitch.tv/settings/connections');
        },
      },
      {
        id: 'verify',
        title: 'Verify Connection',
        description: 'Make sure your accounts are properly linked.',
        action: async () => {
          console.log('Executing action: Opening Amazon Gaming');
          await BrowserService.openURL('https://gaming.amazon.com');
        },
      },
    ];

    initializeGuide(steps);

    // Execute the first step and show the overlay
    await executeStep(steps[0]);
  }, []);

  const startSubscribeFlow = useCallback(async (channelName: string) => {
    const steps = [
      {
        id: 'sub-page',
        title: 'Subscribe Page',
        description: `You are about to subscribe to ${channelName}`,
        action: async () => {
          console.log(`Executing action: Opening subscribe page for ${channelName}`);
          await BrowserService.openURL(`https://www.twitch.tv/${channelName}/subscribe`);
        },
      },
      {
        id: 'select-prime',
        title: 'Select Prime Subscription',
        description: 'Click on "Subscribe Free with Prime" to use your Prime subscription.',
      },
      {
        id: 'confirm',
        title: 'Confirm Subscription',
        description: 'Review and confirm your Prime subscription.',
      },
    ];

    initializeGuide(steps);

    // Execute the first step and show the overlay
    await executeStep(steps[0]);
  }, []);

  return {
    startPrimeLinkFlow,
    startSubscribeFlow,
  };
};
