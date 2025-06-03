
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveQuestionnaireResponse } from "@/services/questionnaireService";
import ProfileRegistrationHeader from "@/components/profile-registration/ProfileRegistrationHeader";
import WelcomeStep from "@/components/profile-registration/steps/WelcomeStep";
import PersonalInfoStep from "@/components/profile-registration/steps/PersonalInfoStep";
import InterestsStep from "@/components/profile-registration/steps/InterestsStep";
import CompletionStep from "@/components/profile-registration/steps/CompletionStep";

const ProfileRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalSteps = 4;

  // Store questionnaire data across steps
  const [questionnaireData, setQuestionnaireData] = useState({
    motivation: "",
    personalInfo: {},
    interests: [],
    skills: [],
    preferences: {},
    userType: "standard_user" // Default user type
  });

  const handleNext = (stepData?: any) => {
    // Store step data
    if (stepData) {
      setQuestionnaireData(prev => ({ ...prev, ...stepData }));
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
      // Combine all questionnaire data
      const completeData = {
        ...questionnaireData,
        ...finalStepData
      };

      // Save to Supabase
      await saveQuestionnaireResponse({
        user_type: completeData.userType,
        response_data: {
          motivation: completeData.motivation,
          personalInfo: completeData.personalInfo,
          interests: completeData.interests,
          skills: completeData.skills,
          preferences: completeData.preferences,
          completedSteps: totalSteps,
          platform: 'web'
        },
        motivation: completeData.motivation,
        agree_to_terms: completeData.agreeToTerms || true
      });

      // Store registration completion status locally as backup
      localStorage.setItem('onboardingCompleted', 'true');
      
      toast({
        title: "Welcome to SouLVE! 🎉",
        description: "Your profile has been successfully created. Let's start building community together!",
      });

      // Use replace to prevent going back to registration
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Error saving questionnaire:', error);
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
          <WelcomeStep
            onNext={(data) => handleNext(data)}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            onNext={(data) => handleNext(data)}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <InterestsStep
            onNext={(data) => handleNext(data)}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 4:
        return (
          <CompletionStep
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
      <ProfileRegistrationHeader />
      {renderCurrentStep()}
    </div>
  );
};

export default ProfileRegistration;
