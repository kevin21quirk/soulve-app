
import { useState } from "react";
import { Building2, Heart, Users, Briefcase, Church, Target, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileWelcomeStepProps {
  onNext: (data?: any) => void;
  currentStep: number;
  totalSteps: number;
}

const MobileWelcomeStep = ({ onNext, currentStep, totalSteps }: MobileWelcomeStepProps) => {
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedMotivation, setSelectedMotivation] = useState("");

  const userTypes = [
    {
      id: "individual",
      title: "Individual",
      description: "Looking to help or get help in my community",
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: "charity",
      title: "Charity",
      description: "Non-profit focused on community causes",
      icon: <Heart className="h-5 w-5" />,
      color: "text-red-600 bg-red-50"
    },
    {
      id: "business",
      title: "Business",
      description: "Company wanting to contribute via CSR",
      icon: <Briefcase className="h-5 w-5" />,
      color: "text-green-600 bg-green-50"
    },
    {
      id: "community_group",
      title: "Community Group",
      description: "Local group or association",
      icon: <Target className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-50"
    }
  ];

  const getMotivationsForType = (type: string) => {
    switch (type) {
      case "individual":
        return [
          { id: "help_others", title: "Help Others", description: "Make a positive impact" },
          { id: "find_help", title: "Find Help", description: "Get support when needed" },
          { id: "build_connections", title: "Connect", description: "Meet like-minded people" }
        ];
      case "charity":
        return [
          { id: "expand_reach", title: "Expand Reach", description: "Connect with more people" },
          { id: "find_volunteers", title: "Find Volunteers", description: "Recruit dedicated helpers" },
          { id: "collaborate", title: "Collaborate", description: "Partner with others" }
        ];
      case "business":
        return [
          { id: "csr_impact", title: "CSR Impact", description: "Meaningful contribution" },
          { id: "employee_engagement", title: "Engage Staff", description: "Employee volunteering" },
          { id: "local_partnerships", title: "Partnerships", description: "Local relationships" }
        ];
      default:
        return [
          { id: "serve_community", title: "Serve Community", description: "Better serve members" },
          { id: "coordinate_efforts", title: "Coordinate", description: "Organize initiatives" },
          { id: "build_network", title: "Network", description: "Connect with others" }
        ];
    }
  };

  const motivations = selectedUserType ? getMotivationsForType(selectedUserType) : [];

  const handleNext = () => {
    onNext({ 
      userType: selectedUserType,
      motivation: selectedMotivation 
    });
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Welcome to SouLVE! 🌟</h1>
        <p className="text-gray-600">Let's personalize your experience</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">What best describes you?</h3>
        
        <div className="space-y-3">
          {userTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedUserType(type.id);
                setSelectedMotivation(""); // Reset motivation
              }}
              className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedUserType === type.id
                  ? "border-teal-500 bg-teal-50 shadow-md"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  selectedUserType === type.id
                    ? "bg-teal-500 text-white"
                    : type.color
                }`}>
                  {type.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {type.title}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </p>
                </div>
                {selectedUserType === type.id && (
                  <ChevronRight className="h-5 w-5 text-teal-600" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedUserType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">What's your main goal?</h3>
          
          <div className="space-y-3">
            {motivations.map((motivation) => (
              <button
                key={motivation.id}
                onClick={() => setSelectedMotivation(motivation.id)}
                className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                  selectedMotivation === motivation.id
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-gray-200 bg-white"
                }`}
              >
                <h4 className="font-medium text-gray-900">
                  {motivation.title}
                </h4>
                <p className="text-sm text-gray-600 mt-1">
                  {motivation.description}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
        <p className="text-sm text-gray-700">
          <strong>💡 Quick Setup:</strong> This personalized approach will only take 2 minutes and helps us connect you with the right opportunities!
        </p>
      </div>

      <Button
        onClick={handleNext}
        disabled={!selectedUserType || !selectedMotivation}
        className="w-full bg-teal-600 hover:bg-teal-700 h-12"
      >
        Continue
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  );
};

export default MobileWelcomeStep;
