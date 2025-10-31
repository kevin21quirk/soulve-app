import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { tutorialService, type TutorialProgress } from '@/services/tutorialService';
import { useToast } from '@/hooks/use-toast';

interface TutorialStep {
  id: string;
  title: string;
  description: string;
  targetElement?: string;
  content: ReactNode;
  canSkip?: boolean;
}

interface TutorialContextType {
  isActive: boolean;
  currentStep: number;
  totalSteps: number;
  userType: string;
  steps: TutorialStep[];
  progress: TutorialProgress | null;
  startTutorial: (userType: string, steps: TutorialStep[]) => Promise<void>;
  nextStep: () => Promise<void>;
  previousStep: () => void;
  skipTutorial: () => Promise<void>;
  completeTutorial: () => Promise<void>;
  dismissPermanently: () => Promise<void>;
  restartTutorial: () => Promise<void>;
  setSteps: (steps: TutorialStep[]) => void;
}

const TutorialContext = createContext<TutorialContextType | undefined>(undefined);

export function TutorialProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userType, setUserType] = useState('');
  const [steps, setSteps] = useState<TutorialStep[]>([]);
  const [progress, setProgress] = useState<TutorialProgress | null>(null);

  const startTutorial = async (type: string, tutorialSteps: TutorialStep[]) => {
    if (!user) return;

    try {
      setUserType(type);
      setSteps(tutorialSteps);
      setCurrentStep(0);

      // Check if tutorial already exists
      const existingProgress = await tutorialService.getTutorialProgress(user.id, 'initial_onboarding');
      
      if (existingProgress && !existingProgress.is_completed && !existingProgress.dismissed) {
        // Resume existing tutorial
        setProgress(existingProgress);
        setCurrentStep(existingProgress.current_step - 1);
      } else {
        // Start new tutorial
        const newProgress = await tutorialService.startTutorial(
          user.id,
          type,
          'initial_onboarding',
          tutorialSteps.length
        );
        if (newProgress) {
          setProgress({
            ...newProgress,
            steps_completed: (newProgress.steps_completed as string[]) || [],
          } as TutorialProgress);
        }
      }

      setIsActive(true);
    } catch (error) {
      console.error('Error starting tutorial:', error);
      toast({
        title: 'Error',
        description: 'Failed to start tutorial',
        variant: 'destructive',
      });
    }
  };

  const nextStep = async () => {
    if (!user || !progress) return;

    const newStep = currentStep + 1;
    
    try {
      // Update progress in database
      await tutorialService.updateProgress(
        user.id,
        'initial_onboarding',
        steps[currentStep].id,
        newStep + 1
      );

      if (newStep >= steps.length) {
        await completeTutorial();
      } else {
        setCurrentStep(newStep);
      }
    } catch (error) {
      console.error('Error updating tutorial progress:', error);
    }
  };

  const previousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skipTutorial = async () => {
    if (!user) return;

    try {
      await tutorialService.dismissTutorial(user.id, 'initial_onboarding', false);
      setIsActive(false);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error skipping tutorial:', error);
    }
  };

  const completeTutorial = async () => {
    if (!user) return;

    try {
      await tutorialService.completeTutorial(user.id, 'initial_onboarding');
      setIsActive(false);
      setCurrentStep(0);
      
      toast({
        title: 'Tutorial Complete!',
        description: "You're all set! Start exploring the platform.",
      });
    } catch (error) {
      console.error('Error completing tutorial:', error);
    }
  };

  const dismissPermanently = async () => {
    if (!user) return;

    try {
      await tutorialService.dismissTutorial(user.id, 'initial_onboarding', true);
      setIsActive(false);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error dismissing tutorial:', error);
    }
  };

  const restartTutorial = async () => {
    if (!user) return;

    try {
      await tutorialService.resetTutorial(user.id, 'initial_onboarding');
      await startTutorial(userType, steps);
    } catch (error) {
      console.error('Error restarting tutorial:', error);
    }
  };

  return (
    <TutorialContext.Provider
      value={{
        isActive,
        currentStep,
        totalSteps: steps.length,
        userType,
        steps,
        progress,
        startTutorial,
        nextStep,
        previousStep,
        skipTutorial,
        completeTutorial,
        dismissPermanently,
        restartTutorial,
        setSteps,
      }}
    >
      {children}
    </TutorialContext.Provider>
  );
}

export function useTutorial() {
  const context = useContext(TutorialContext);
  if (context === undefined) {
    throw new Error('useTutorial must be used within a TutorialProvider');
  }
  return context;
}
