
import { useState, useEffect } from "react";
import { CheckCircle, Sparkles, Users, TrendingUp, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import RegistrationStep from "../RegistrationStep";

interface CompletionStepProps {
  onComplete: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const CompletionStep = ({ onComplete, onPrevious, currentStep, totalSteps }: CompletionStepProps) => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    setShowAnimation(true);
  }, []);

  const benefits = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Smart Connections",
      description: "Get matched with helpers and opportunities based on your interests"
    },
    {
      icon: <TrendingUp className="h-5 w-5" />,
      title: "Impact Tracking",
      description: "See your community impact grow with our gamified point system"
    },
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Trust & Safety",
      description: "Verified profiles and rating system ensure safe interactions"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "AI-Powered Feed",
      description: "Social media that prioritizes real-world action over endless scrolling"
    }
  ];

  const platformInsight = {
    title: "You're All Set! 🎉",
    description: "Welcome to the SouLVE community! You've unlocked access to a platform where social media meets social good. Start exploring local opportunities, connect with amazing people, and make a real difference in your community.",
    icon: <CheckCircle className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Welcome to SouLVE!"
      subtitle="You're now part of a community that turns social connections into social action."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onComplete}
      onPrevious={onPrevious}
      isNextEnabled={true}
      platformInsight={platformInsight}
    >
      <div className="space-y-8">
        {/* Success Animation */}
        <div className={`text-center transition-all duration-1000 ${showAnimation ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full mb-4">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Created Successfully!
          </h3>
          <p className="text-gray-600">
            You've unlocked the full SouLVE experience
          </p>
        </div>

        {/* Platform Benefits */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-gray-900 text-center mb-6">
            What you can do now:
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit.title}
                className={`p-4 rounded-lg border border-gray-200 transition-all duration-500 hover:shadow-lg ${
                  showAnimation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-teal-100 rounded-lg text-teal-600">
                    {benefit.icon}
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-1">
                      {benefit.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="p-6 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
          <h4 className="font-semibold text-teal-800 mb-3 flex items-center">
            <Sparkles className="h-5 w-5 mr-2" />
            Your First Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-teal-500 hover:bg-teal-600">
              Community Member
            </Badge>
            <Badge className="bg-blue-500 hover:bg-blue-600">
              Profile Complete
            </Badge>
            <Badge className="bg-purple-500 hover:bg-purple-600">
              Ready to Help
            </Badge>
          </div>
          <p className="text-sm text-teal-700 mt-2">
            Earn more badges by helping others and engaging with the community!
          </p>
        </div>

        {/* Call to Action */}
        <div className="text-center pt-4">
          <p className="text-gray-600 mb-4">
            Ready to start making a difference?
          </p>
          <Button
            onClick={onComplete}
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            Enter SouLVE Dashboard
          </Button>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default CompletionStep;
