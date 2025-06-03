
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
  userType?: string;
}

const MobileCompletionStep = ({ onComplete, onPrevious, currentStep, totalSteps, isSubmitting, userType = "individual" }: MobileCompletionStepProps) => {
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [enableNotifications, setEnableNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(userType !== "individual");

  const handleComplete = () => {
    onComplete({
      agreeToTerms,
      preferences: {
        enableNotifications,
        publicProfile
      }
    });
  };

  const getContentForUserType = () => {
    switch (userType) {
      case "charity":
        return {
          title: "Your charity profile is ready! 🎉",
          subtitle: "Welcome to SouLVE - where charitable organizations connect with community support",
          features: [
            {
              icon: <Users className="h-4 w-4 text-blue-600" />,
              title: "Find Volunteers",
              description: "Connect with skilled volunteers who share your passion"
            },
            {
              icon: <Heart className="h-4 w-4 text-red-600" />,
              title: "Expand Reach",
              description: "Reach more people who need your services"
            },
            {
              icon: <Shield className="h-4 w-4 text-green-600" />,
              title: "Build Trust",
              description: "Showcase your impact and build community trust"
            },
            {
              icon: <Sparkles className="h-4 w-4 text-purple-600" />,
              title: "Collaborate",
              description: "Partner with other organizations and businesses"
            }
          ],
          nextSteps: [
            "• Set up your organization profile",
            "• Post volunteer opportunities",
            "• Connect with local partners",
            "• Track and share your impact"
          ]
        };
      case "business":
        return {
          title: "Your business profile is ready! 🎉",
          subtitle: "Welcome to SouLVE - where businesses build meaningful community connections",
          features: [
            {
              icon: <Users className="h-4 w-4 text-blue-600" />,
              title: "Employee Engagement",
              description: "Connect employees with volunteer opportunities"
            },
            {
              icon: <Heart className="h-4 w-4 text-red-600" />,
              title: "CSR Impact",
              description: "Make measurable community contributions"
            },
            {
              icon: <Sparkles className="h-4 w-4 text-purple-600" />,
              title: "Partnerships",
              description: "Build relationships with local organizations"
            },
            {
              icon: <Shield className="h-4 w-4 text-green-600" />,
              title: "Brand Purpose",
              description: "Align your brand with social impact"
            }
          ],
          nextSteps: [
            "• Create corporate volunteering programs",
            "• Partner with local charities",
            "• Share your CSR initiatives",
            "• Build authentic stakeholder relationships"
          ]
        };
      default:
        return {
          title: "You're all set! 🎉",
          subtitle: "Welcome to SouLVE - where community support meets action",
          features: [
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
          ],
          nextSteps: [
            "• Explore your personalized dashboard",
            "• Check out help opportunities nearby",
            "• Connect with community members",
            "• Start making a positive impact!"
          ]
        };
    }
  };

  const content = getContentForUserType();

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-900">{content.title}</h1>
        <p className="text-sm text-gray-600">{content.subtitle}</p>
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
          {content.features.map((feature, index) => (
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
                {userType === "individual" 
                  ? "Get notified about help requests and messages"
                  : "Get notified about volunteer opportunities and partnership requests"
                }
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
                {userType === "individual"
                  ? "Let others find and connect with you (recommended)"
                  : "Let community members discover your organization (recommended)"
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
        <h4 className="text-sm font-medium text-teal-900 mb-2">What's next?</h4>
        <ul className="text-xs text-teal-800 space-y-1">
          {content.nextSteps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
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
