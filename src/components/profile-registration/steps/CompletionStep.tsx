
import { useState } from "react";
import { CheckCircle, Sparkles, Users, Heart, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import RegistrationStep from "../RegistrationStep";

interface CompletionStepProps {
  onComplete: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
}

const CompletionStep = ({ onComplete, onPrevious, currentStep, totalSteps, isSubmitting }: CompletionStepProps) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  const [directMessages, setDirectMessages] = useState(true);

  const handleComplete = () => {
    onComplete({
      agreeToTerms,
      preferences: {
        enableNotifications,
        publicProfile,
        directMessages
      }
    });
  };

  const features = [
    {
      icon: <Users className="h-5 w-5 text-blue-600" />,
      title: "Smart Connections",
      description: "Connect with like-minded people in your area who share your interests"
    },
    {
      icon: <Heart className="h-5 w-5 text-red-600" />,
      title: "Help & Support",
      description: "Give and receive help through our trusted community network"
    },
    {
      icon: <Shield className="h-5 w-5 text-green-600" />,
      title: "Safe Space",
      description: "Access anonymous peer support when you need someone to talk to"
    },
    {
      icon: <Sparkles className="h-5 w-5 text-purple-600" />,
      title: "Impact Tracking",
      description: "See your positive impact grow as you help others and build trust"
    }
  ];

  const platformInsight = {
    title: "Welcome to SouLVE!",
    description: "You're now part of a community that believes in the power of people helping people. Your profile is your starting point - you can always update it as you discover new interests and ways to contribute.",
    icon: <Sparkles className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="You're all set! 🎉"
      subtitle="Welcome to SouLVE - where community support meets meaningful action."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleComplete}
      onPrevious={onPrevious}
      isNextEnabled={agreeToTerms}
      platformInsight={platformInsight}
    >
      <div className="space-y-8">
        {/* Features Overview */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What you can do on SouLVE:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex-shrink-0 mt-1">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy & Preferences */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Privacy & Preferences</h3>
          </div>
          
          <div className="space-y-4 pl-7">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="notifications"
                checked={enableNotifications}
                onCheckedChange={(checked) => setEnableNotifications(checked as boolean)}
                className="mt-1"
              />
              <div>
                <Label htmlFor="notifications" className="text-sm font-medium">
                  Enable notifications
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Get notified about help requests, messages, and community updates
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="publicProfile"
                checked={publicProfile}
                onCheckedChange={(checked) => setPublicProfile(checked as boolean)}
                className="mt-1"
              />
              <div>
                <Label htmlFor="publicProfile" className="text-sm font-medium">
                  Make my profile discoverable
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Allow others to find and connect with you (recommended)
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="directMessages"
                checked={directMessages}
                onCheckedChange={(checked) => setDirectMessages(checked as boolean)}
                className="mt-1"
              />
              <div>
                <Label htmlFor="directMessages" className="text-sm font-medium">
                  Allow direct messages
                </Label>
                <p className="text-xs text-gray-600 mt-1">
                  Let community members send you private messages
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alpha Testing Notice */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-purple-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-purple-900 mb-2">You're in our Alpha Community! 🚀</h4>
              <p className="text-sm text-purple-800 mb-3">
                As an alpha tester, you're helping shape the future of community support. Your feedback is invaluable in making SouLVE the best it can be.
              </p>
              <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
                <strong>What this means:</strong> You'll see new features first, have direct access to our team, and play a crucial role in building something amazing together.
              </div>
            </div>
          </div>
        </div>

        {/* Terms Agreement */}
        <div className="border-t pt-6">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="terms"
              checked={agreeToTerms}
              onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
              className="mt-1"
            />
            <Label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
              I agree to the{" "}
              <a href="/terms" className="text-teal-600 hover:text-teal-700 underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
                Privacy Policy
              </a>
              . I understand that SouLVE uses verification processes to ensure community safety and trust.
            </Label>
          </div>
        </div>

        {/* Next Steps Preview */}
        <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
          <h4 className="font-medium text-teal-900 mb-2">What happens next?</h4>
          <ul className="text-sm text-teal-800 space-y-1">
            <li>• Explore your personalized dashboard</li>
            <li>• Check out help opportunities in your area</li>
            <li>• Connect with community members who share your interests</li>
            <li>• Start making a positive impact right away!</li>
          </ul>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default CompletionStep;
