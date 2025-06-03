
import { useState } from "react";
import { Sparkles, Users, Heart, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileWelcomeStepProps {
  onNext: (data?: any) => void;
  currentStep: number;
  totalSteps: number;
}

const MobileWelcomeStep = ({ onNext, currentStep, totalSteps }: MobileWelcomeStepProps) => {
  const [selectedMotivation, setSelectedMotivation] = useState("");

  const motivations = [
    {
      id: "help-others",
      title: "Help Others",
      description: "Make a positive impact in my community",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600 bg-red-50"
    },
    {
      id: "find-help",
      title: "Find Help",
      description: "Get support when I need it",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: "build-connections",
      title: "Build Connections",
      description: "Connect with like-minded people",
      icon: <Target className="h-5 w-5" />,
      color: "text-green-600 bg-green-50"
    },
    {
      id: "organization",
      title: "Organization",
      description: "Represent a group helping community",
      icon: <Sparkles className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const handleNext = () => {
    onNext({ motivation: selectedMotivation });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to SouLVE! 🌟</h1>
        <p className="text-gray-600">What brings you here today?</p>
      </div>

      <div className="space-y-3">
        {motivations.map((motivation) => (
          <button
            key={motivation.id}
            onClick={() => setSelectedMotivation(motivation.id)}
            className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
              selectedMotivation === motivation.id
                ? "border-teal-500 bg-teal-50 shadow-md"
                : "border-gray-200 bg-white"
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${
                selectedMotivation === motivation.id
                  ? "bg-teal-500 text-white"
                  : motivation.color
              }`}>
                {motivation.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {motivation.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {motivation.description}
                </p>
              </div>
              {selectedMotivation === motivation.id && (
                <ChevronRight className="h-5 w-5 text-teal-600" />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
        <p className="text-sm text-gray-700">
          <strong>💡 Quick Setup:</strong> This will only take 2 minutes! We'll help you set up your profile so you can start connecting with your community right away.
        </p>
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedMotivation}
        className="w-full bg-teal-600 hover:bg-teal-700 h-12"
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default MobileWelcomeStep;
