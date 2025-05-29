import { useState } from "react";
import { Heart, Zap, Users2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RegistrationStep from "../RegistrationStep";

interface InterestsStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const InterestsStep = ({ onNext, onPrevious, currentStep, totalSteps }: InterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestCategories = [
    {
      title: "Community Support",
      interests: ["Senior Care", "Youth Mentoring", "Food Banks", "Homeless Support", "Mental Health"]
    },
    {
      title: "Environment & Nature",
      interests: ["Tree Planting", "Beach Cleanup", "Recycling", "Wildlife Conservation", "Gardening"]
    },
    {
      title: "Education & Skills",
      interests: ["Tutoring", "Teaching", "Computer Skills", "Language Exchange", "Career Guidance"]
    },
    {
      title: "Arts & Culture",
      interests: ["Music", "Art Projects", "Theater", "Photography", "Cultural Events"]
    },
    {
      title: "Health & Wellness",
      interests: ["Fitness Support", "Nutrition", "First Aid", "Therapy Support", "Medical Assistance"]
    },
    {
      title: "Practical Help",
      interests: ["Moving Help", "Home Repairs", "Transportation", "Pet Care", "Technology Support"]
    }
  ];

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const handleNext = () => {
    onNext({ interests: selectedInterests });
  };

  const platformInsight = {
    title: "Smart Matching",
    description: "Our AI-powered matching system uses your interests to suggest relevant opportunities and connect you with people who share similar passions. The more interests you select, the better we can personalize your experience!",
    icon: <Zap className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="What interests you?"
      subtitle="Select areas where you'd like to help or receive support. This helps us match you with the right opportunities."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={onPrevious}
      isNextEnabled={selectedInterests.length >= 3}
      platformInsight={platformInsight}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            Select at least 3 areas of interest
          </p>
          <div className="flex items-center space-x-2">
            <Badge variant={selectedInterests.length >= 3 ? "default" : "secondary"}>
              {selectedInterests.length} selected
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {interestCategories.map((category) => (
            <div key={category.title} className="space-y-3">
              <h3 className="font-medium text-gray-900 flex items-center">
                <Heart className="h-4 w-4 mr-2 text-teal-600" />
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.interests.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-2 rounded-full text-sm border transition-all duration-200 hover:scale-105 ${
                      selectedInterests.includes(interest)
                        ? "bg-teal-500 text-white border-teal-500 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-teal-300"
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {selectedInterests.length > 0 && (
          <div className="mt-6 p-4 bg-teal-50 rounded-lg">
            <h4 className="font-medium text-teal-800 mb-2">Your Selected Interests:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest) => (
                <Badge key={interest} className="bg-teal-500">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </RegistrationStep>
  );
};

export default InterestsStep;
