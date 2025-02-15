import React, { createContext, useContext, useState } from 'react';

export interface GuideStep {
  id: string;
  title: string;
  description: string;
  targetSelector?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  action?: () => void;
  verificationUrl?: string;
}

interface GuidedBrowserContextType {
  currentStep: GuideStep | null;
  steps: GuideStep[];
  isGuideVisible: boolean;
  setCurrentStep: (step: GuideStep | null) => void;
  setSteps: (steps: GuideStep[]) => void;
  setIsGuideVisible: (visible: boolean) => void;
  nextStep: () => void;
  previousStep: () => void;
}

const GuidedBrowserContext = createContext<GuidedBrowserContextType | undefined>(undefined);

export function GuidedBrowserProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<GuideStep | null>(null);
  const [steps, setSteps] = useState<GuideStep[]>([]);
  const [isGuideVisible, setIsGuideVisible] = useState(false);

  const nextStep = () => {
    if (!currentStep) return;
    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    } else {
      setCurrentStep(null);
      setIsGuideVisible(false);
    }
  };

  const previousStep = () => {
    if (!currentStep) return;
    const currentIndex = steps.findIndex(step => step.id === currentStep.id);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <GuidedBrowserContext.Provider
      value={{
        currentStep,
        steps,
        isGuideVisible,
        setCurrentStep,
        setSteps,
        setIsGuideVisible,
        nextStep,
        previousStep,
      }}>
      {children}
    </GuidedBrowserContext.Provider>
  );
}

export function useGuidedBrowser() {
  const context = useContext(GuidedBrowserContext);
  if (!context) {
    throw new Error('useGuidedBrowser must be used within a GuidedBrowserProvider');
  }
  return context;
}
