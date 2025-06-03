import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveQuestionnaireResponse } from "@/services/questionnaireService";
import MobileOnboardingHeader from "./MobileOnboardingHeader";
import MobileWelcomeStep from "./MobileWelcomeStep";
import MobilePersonalInfoStep from "./MobilePersonalInfoStep";
import MobileInterestsStep from "./MobileInterestsStep";
import MobileCompletionStep from "./MobileCompletionStep";

const MobileOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  const [onboardingData, setOnboardingData] = useState({
    motivation: "",
    personalInfo: {},
    interests: [],
    skills: [],
    preferences: {},
    userType: "standard_user"
  });

  const handleNext = (stepData?: any) => {
    if (stepData) {
      setOnboardingData(prev => ({ ...prev, ...stepData }));
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async (finalStepData?: any) => {
    setIsSubmitting(true);
    
    try {
      const completeData = {
        ...onboardingData,
        ...finalStepData
      };

      await saveQuestionnaireResponse({
        user_type: completeData.userType,
        response_data: {
          motivation: completeData.motivation,
          personalInfo: completeData.personalInfo,
          interests: completeData.interests,
          skills: completeData.skills,
          preferences: completeData.preferences,
          completedSteps: totalSteps,
          platform: 'mobile'
        },
        motivation: completeData.motivation,
        agree_to_terms: completeData.agreeToTerms || true
      });

      localStorage.setItem('onboardingCompleted', 'true');
      
      toast({
        title: "Welcome to SouLVE! 🎉",
        description: "Your profile is ready. Let's start building community together!",
      });

      // Use replace to prevent going back to onboarding
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving onboarding:', error);
      toast({
        title: "Setup Error",
        description: "We couldn't complete your setup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <MobileWelcomeStep
            onNext={(data) => handleNext(data)}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <MobilePersonalInfoStep
            onNext={(data) => handleNext(data)}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <MobileInterestsStep
            onNext={(data) => handleNext(data)}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return (
          <MobileCompletionStep
            onComplete={handleComplete}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <MobileOnboardingHeader currentStep={currentStep} totalSteps={totalSteps} />
      {renderCurrentStep()}
    </div>
  );
};

export default MobileOnboarding;
