
import { useState } from "react";
import { Building2, Heart, Users, Briefcase, Church, Target } from "lucide-react";
import RegistrationStep from "../RegistrationStep";

interface WelcomeStepProps {
  onNext: (data?: any) => void;
  currentStep: number;
  totalSteps: number;
}

const WelcomeStep = ({ onNext, currentStep, totalSteps }: WelcomeStepProps) => {
  const [selectedUserType, setSelectedUserType] = useState("");
  const [selectedMotivation, setSelectedMotivation] = useState("");

  const userTypes = [
    {
      id: "individual",
      title: "Individual",
      description: "I'm joining as a person looking to help or get help",
      icon: <Users className="h-6 w-6" />,
      color: "text-blue-600"
    },
    {
      id: "charity",
      title: "Charity/Non-Profit",
      description: "We're an organization focused on community causes",
      icon: <Heart className="h-6 w-6" />,
      color: "text-red-600"
    },
    {
      id: "business",
      title: "Business",
      description: "We want to contribute to our community through CSR",
      icon: <Briefcase className="h-6 w-6" />,
      color: "text-green-600"
    },
    {
      id: "community_group",
      title: "Community Group",
      description: "We're a local group or association",
      icon: <Target className="h-6 w-6" />,
      color: "text-purple-600"
    },
    {
      id: "religious_group",
      title: "Religious Group",
      description: "We're a faith-based organization",
      icon: <Church className="h-6 w-6" />,
      color: "text-orange-600"
    },
    {
      id: "other_organization",
      title: "Other Organization",
      description: "We represent another type of group or entity",
      icon: <Building2 className="h-6 w-6" />,
      color: "text-gray-600"
    }
  ];

  const getMotivationsForType = (type: string) => {
    switch (type) {
      case "individual":
        return [
          { id: "help_others", title: "Help Others", description: "Make a positive impact in my community" },
          { id: "find_help", title: "Find Help", description: "Get support when I need it" },
          { id: "build_connections", title: "Build Connections", description: "Connect with like-minded people" },
          { id: "volunteer", title: "Volunteer", description: "Find meaningful volunteer opportunities" }
        ];
      case "charity":
        return [
          { id: "expand_reach", title: "Expand Our Reach", description: "Connect with more people who need our services" },
          { id: "find_volunteers", title: "Find Volunteers", description: "Recruit dedicated community volunteers" },
          { id: "raise_awareness", title: "Raise Awareness", description: "Spread awareness about our cause" },
          { id: "collaborate", title: "Collaborate", description: "Partner with other organizations" }
        ];
      case "business":
        return [
          { id: "csr_impact", title: "CSR Impact", description: "Make a meaningful community contribution" },
          { id: "employee_engagement", title: "Employee Engagement", description: "Engage employees in community service" },
          { id: "local_partnerships", title: "Local Partnerships", description: "Build relationships with local organizations" },
          { id: "brand_purpose", title: "Brand Purpose", description: "Align our brand with social impact" }
        ];
      default:
        return [
          { id: "serve_community", title: "Serve Community", description: "Better serve our community members" },
          { id: "coordinate_efforts", title: "Coordinate Efforts", description: "Organize community initiatives more effectively" },
          { id: "find_resources", title: "Find Resources", description: "Access resources and support for our mission" },
          { id: "build_network", title: "Build Network", description: "Connect with other community organizations" }
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

  const platformInsight = {
    title: "Welcome to SouLVE! 🌟",
    description: "SouLVE transforms social media from endless scrolling into meaningful social action. Tell us about yourself so we can personalize your experience and connect you with the right opportunities.",
    icon: <Target className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Welcome to SouLVE! 🌟"
      subtitle="Let's personalize your experience by understanding who you are and what brings you here."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={() => {}}
      isNextEnabled={!!selectedUserType && !!selectedMotivation}
      showPrevious={false}
      platformInsight={platformInsight}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">First, what best describes you?</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {userTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => {
                  setSelectedUserType(type.id);
                  setSelectedMotivation(""); // Reset motivation when type changes
                }}
                className={`p-4 rounded-lg border-2 text-left transition-all duration-200 hover:scale-105 ${
                  selectedUserType === type.id
                    ? "border-teal-500 bg-teal-50 shadow-md"
                    : "border-gray-200 hover:border-teal-300"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedUserType === type.id
                      ? "bg-teal-500 text-white"
                      : `bg-gray-100 ${type.color}`
                  }`}>
                    {type.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {type.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {type.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedUserType && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">What's your primary motivation?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {motivations.map((motivation) => (
                <button
                  key={motivation.id}
                  onClick={() => setSelectedMotivation(motivation.id)}
                  className={`p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                    selectedMotivation === motivation.id
                      ? "border-teal-500 bg-teal-50 shadow-md"
                      : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <h4 className="font-medium text-gray-900 mb-1">
                    {motivation.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {motivation.description}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </RegistrationStep>
  );
};

export default WelcomeStep;
