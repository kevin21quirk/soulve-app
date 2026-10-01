
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { saveQuestionnaireResponse } from "@/services/questionnaireService";
import ProfileRegistrationHeader from "@/components/profile-registration/ProfileRegistrationHeader";
import WelcomeStep from "@/components/profile-registration/steps/WelcomeStep";
import PersonalInfoStep from "@/components/profile-registration/steps/PersonalInfoStep";
import InterestsStep from "@/components/profile-registration/steps/InterestsStep";
import CompletionStep from "@/components/profile-registration/steps/CompletionStep";

const ProfileRegistration = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, api, loading: authLoading } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingWaitlist, setIsCheckingWaitlist] = useState(true);
  const totalSteps = 4;

  // Check waitlist status on mount - only redirect if already completed questionnaire
  useEffect(() => {
    if (authLoading) return;
    const checkWaitlistStatus = async () => {
      try {
        if (!user) {
          navigate('/auth', { replace: true });
          return;
        }

        if (!api) {
          setIsCheckingWaitlist(false);
          return;
        }
        const me = await api.get<{ is_admin?: boolean; onboarding_completed?: boolean; waitlist_status?: string | null }>('/profiles/me');

        if (me.is_admin) {
          // Admin can access the page - skip all other checks
          setIsCheckingWaitlist(false);
          return;
        }

        if (me.onboarding_completed) {
          // User already completed onboarding - check where to redirect them
          const waitlistStatus = me.waitlist_status || 'pending';
          navigate(waitlistStatus === 'approved' ? '/dashboard' : '/waitlist', { replace: true });
          return;
        }

        // User hasn't completed questionnaire - let them proceed regardless of waitlist status
        setIsCheckingWaitlist(false);
      } catch (error) {
        console.error('Error checking waitlist status:', error);
        setIsCheckingWaitlist(false);
      }
    };

    checkWaitlistStatus();
  }, [navigate, user, authLoading]);

  // Store questionnaire data across steps
  const [questionnaireData, setQuestionnaireData] = useState({
    userType: "individual", // Store user type from step 1
    motivation: "",
    personalInfo: {},
    interests: [],
    skills: [],
    preferences: {}
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

      // Save via the Neon-backed API
      if (!api) throw new Error('Not authenticated');
      await saveQuestionnaireResponse(api, {
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

      // Check waitlist status and user status after profile completion
      if (user && api) {
        const me = await api.get<{ is_admin?: boolean; waitlist_status?: string | null }>('/profiles/me');

        if (me.is_admin) {
          toast({
            title: "Welcome to SouLVE! 🎉",
            description: "Your profile has been successfully created. Let's start building community together!",
          });
          navigate('/dashboard', { replace: true });
          return;
        }

        // Default to 'pending' if status is null/undefined to ensure waitlist enforcement
        const waitlistStatus = me.waitlist_status || 'pending';

        if (waitlistStatus === 'approved') {
          toast({
            title: "Welcome to SouLVE! 🎉",
            description: "Your profile has been successfully created. Let's start building community together!",
          });
          // User is approved, go to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          toast({
            title: "Profile Complete! ⏳",
            description: "Thank you for joining! Your application is under review. We'll notify you once you're approved.",
          });
          // Redirect to waitlist page (pending or denied)
          navigate('/waitlist', { replace: true });
        }
      }
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
            userType={questionnaireData.userType}
          />
        );
      case 3:
        return (
          <InterestsStep
            onNext={(data) => handleNext(data)}
            onPrevious={handlePrevious}
            currentStep={currentStep}
            totalSteps={totalSteps}
            userType={questionnaireData.userType}
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
            userType={questionnaireData.userType}
          />
        );
      default:
        return null;
    }
  };

  // Show loading state while checking waitlist
  if (isCheckingWaitlist) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <ProfileRegistrationHeader />
      {renderCurrentStep()}
    </div>
  );
};

export default ProfileRegistration;
