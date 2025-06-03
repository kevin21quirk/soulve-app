
import { useState } from "react";
import { CheckCircle, Sparkles, Users, Heart, Shield, ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface MobileCompletionStepProps {
  onComplete: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
}

const MobileCompletionStep = ({ onComplete, onPrevious, currentStep, totalSteps, isSubmitting }: MobileCompletionStepProps) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const handleComplete = () => {
    onComplete({
      agreeToTerms,
      preferences: {
        enableNotifications,
        publicProfile
      }
    });
  };

  const features = [
    {
      icon: <Users className="h-4 w-4 text-blue-600" />,
      title: "Smart Connections",
      description: "Connect with people who share your interests"
    },
    {
      icon: <Heart className="h-4 w-4 text-red-600" />,
      title: "Help Network",
      description: "Give and receive help in your community"
    },
    {
      icon: <Shield className="h-4 w-4 text-green-600" />,
      title: "Safe Space",
      description: "Anonymous peer support when you need it"
    },
    {
      icon: <Sparkles className="h-4 w-4 text-purple-600" />,
      title: "Impact Tracking",
      description: "See your positive impact grow over time"
    }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-900">You're all set! 🎉</h1>
        <p className="text-sm text-gray-600">
          Welcome to SouLVE - where community support meets action
        </p>
      </div>

      {/* Alpha Testing Notice */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
        <div className="flex items-start space-x-3">
          <CheckCircle className="h-5 w-5 text-purple-600 mt-1 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-purple-900 text-sm mb-1">Alpha Community! 🚀</h4>
            <p className="text-xs text-purple-800 mb-2">
              You're helping shape the future of community support. Your feedback is invaluable!
            </p>
            <div className="text-xs text-purple-700 bg-purple-100 p-2 rounded">
              <strong>What this means:</strong> Early access to features, direct team contact, and a voice in building something amazing.
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">What you can do:</h3>
        <div className="grid grid-cols-2 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
              <div className="mt-0.5">
                {feature.icon}
              </div>
              <div>
                <h4 className="text-xs font-medium text-gray-900">{feature.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">Quick Settings</h3>
        
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <Checkbox
              id="notifications"
              checked={enableNotifications}
              onCheckedChange={(checked) => setEnableNotifications(checked as boolean)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="notifications" className="text-sm font-medium">
                Enable notifications
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Get notified about help requests and messages
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Checkbox
              id="publicProfile"
              checked={publicProfile}
              onCheckedChange={(checked) => setPublicProfile(checked as boolean)}
              className="mt-0.5"
            />
            <div>
              <Label htmlFor="publicProfile" className="text-sm font-medium">
                Make profile discoverable
              </Label>
              <p className="text-xs text-gray-600 mt-1">
                Let others find and connect with you (recommended)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
        <h4 className="text-sm font-medium text-teal-900 mb-2">What's next?</h4>
        <ul className="text-xs text-teal-800 space-y-1">
          <li>• Explore your personalized dashboard</li>
          <li>• Check out help opportunities nearby</li>
          <li>• Connect with community members</li>
          <li>• Start making a positive impact!</li>
        </ul>
      </div>

      {/* Terms */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={agreeToTerms}
            onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="terms" className="text-xs text-gray-700 leading-relaxed">
            I agree to the{" "}
            <a href="/terms" className="text-teal-600 underline">Terms</a>{" "}
            and{" "}
            <a href="/privacy" className="text-teal-600 underline">Privacy Policy</a>
          </Label>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={isSubmitting}
          className="flex-1 h-12"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!agreeToTerms || isSubmitting}
          className="flex-1 bg-teal-600 hover:bg-teal-700 h-12"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              Complete Setup
              <Sparkles className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default MobileCompletionStep;
