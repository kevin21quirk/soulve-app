
import { CheckCircle, Sparkles, Users, Target } from "lucide-react";
import RegistrationStep from "../RegistrationStep";

interface CompletionStepProps {
  onComplete: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting?: boolean;
}

const CompletionStep = ({ onComplete, onPrevious, currentStep, totalSteps, isSubmitting = false }: CompletionStepProps) => {
  const handleComplete = () => {
    onComplete({ completedAt: new Date().toISOString() });
  };

  const platformInsight = {
    title: "You're All Set!",
    description: "Your profile is now ready! You'll be able to discover opportunities, connect with others, and start making a positive impact in your community right away.",
    icon: <CheckCircle className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Welcome to the SouLVE Community! 🎉"
      subtitle="Your registration is complete. You're now ready to start making meaningful connections and positive impact."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleComplete}
      onPrevious={onPrevious}
      isNextEnabled={!isSubmitting}
      platformInsight={platformInsight}
    >
      <div className="space-y-8">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Registration Complete!
          </h3>
          <p className="text-gray-600 mb-8">
            You're now part of a community that's working together to create positive change.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 rounded-lg bg-teal-50">
            <div className="w-12 h-12 bg-teal-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Connect</h4>
            <p className="text-sm text-gray-600">
              Find people who share your interests and values
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-blue-50">
            <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Discover</h4>
            <p className="text-sm text-gray-600">
              Explore opportunities to help and be helped
            </p>
          </div>

          <div className="text-center p-4 rounded-lg bg-purple-50">
            <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-3 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Impact</h4>
            <p className="text-sm text-gray-600">
              Make a real difference in your community
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-6 text-center">
          <p className="text-sm text-gray-700">
            Ready to start your journey? Click below to enter your dashboard and begin exploring!
          </p>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default CompletionStep;
