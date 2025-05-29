
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ProfileRegistrationHeader from "@/components/profile-registration/ProfileRegistrationHeader";
import WelcomeStep from "@/components/profile-registration/steps/WelcomeStep";
import PersonalInfoStep from "@/components/profile-registration/steps/PersonalInfoStep";
import InterestsStep from "@/components/profile-registration/steps/InterestsStep";
import CompletionStep from "@/components/profile-registration/steps/CompletionStep";

const ProfileRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    // Store registration completion status
    localStorage.setItem('registrationCompleted', 'true');
    navigate('/dashboard');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <WelcomeStep
            onNext={handleNext}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 2:
        return (
          <PersonalInfoStep
            onNext={handleNext}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
          />
        );
      case 3:
        return (
          <InterestsStep
            onNext={handleNext}
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
