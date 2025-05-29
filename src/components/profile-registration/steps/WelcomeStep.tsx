import { useState } from "react";
import { Sparkles, Users, Heart, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import RegistrationStep from "../RegistrationStep";

interface WelcomeStepProps {
  onNext: (data?: any) => void;
  currentStep: number;
  totalSteps: number;
}

const WelcomeStep = ({ onNext, currentStep, totalSteps }: WelcomeStepProps) => {
  const [selectedMotivation, setSelectedMotivation] = useState("");

  const motivations = [
    {
      id: "help-others",
      title: "Help Others",
      description: "I want to make a positive impact in my community",
      icon: <Heart className="h-6 w-6" />
    },
    {
      id: "find-help",
      title: "Find Help",
      description: "I'm looking for support and assistance when I need it",
      icon: <Users className="h-6 w-6" />
    },
    {
      id: "build-connections",
      title: "Build Connections",
      description: "I want to connect with like-minded people in my area",
      icon: <Target className="h-6 w-6" />
    },
    {
      id: "organization",
      title: "Organization/Group",
      description: "I represent an organization that wants to help the community",
      icon: <Sparkles className="h-6 w-6" />
    }
  ];

  const handleNext = () => {
    onNext({ motivation: selectedMotivation });
  };

  const platformInsight = {
    title: "Welcome to SouLVE!",
    description: "SouLVE transforms social media from endless scrolling into meaningful social action. By understanding your motivation, we can personalize your experience and connect you with opportunities that matter to you.",
    icon: <Sparkles className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Welcome to SouLVE! 🌟"
      subtitle="Let's start by understanding what brings you here today."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={() => {}}
      isNextEnabled={!!selectedMotivation}
      showPrevious={false}
      platformInsight={platformInsight}
    >
      <div className="space-y-4">
        <p className="text-gray-600 mb-6">
          What's your primary motivation for joining our community?
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {motivations.map((motivation) => (
            <button
              key={motivation.id}
              onClick={() => setSelectedMotivation(motivation.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 ${
                selectedMotivation === motivation.id
                  ? "border-teal-500 bg-teal-50 shadow-md"
                  : "border-gray-200 hover:border-teal-300"
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedMotivation === motivation.id
                    ? "bg-teal-500 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}>
                  {motivation.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {motivation.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {motivation.description}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </RegistrationStep>
  );
};

export default WelcomeStep;
