
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import PersonalDetailsSection from "./standard-user/PersonalDetailsSection";
import InterestsAvailabilitySection from "./standard-user/InterestsAvailabilitySection";
import PlatformFeaturesSection from "./shared/PlatformFeaturesSection";

const StandardUserQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    age: "",
    location: "",
    contactPhone: "",
    currentInvolvement: [],
    volunteerExperience: "",
    communityConnection: "",
    causeAreas: [],
    preferredActivities: [],
    motivations: "",
    personalGoals: "",
    skills: [],
    learningInterests: [],
    leadershipInterest: "",
    mentorshipInterest: "",
    timeCommitment: "",
    availability: "",
    transportationAccess: "",
    workingStyle: "",
    communicationPreferences: [],
    technologyComfort: "",
    networkingGoals: "",
    impactExpectations: "",
    longTermVision: "",
    barriers: "",
    supportNeeds: [],
    interests: [],
    timeAvailability: "",
    volunteerMotivation: "",
    platformFeatures: {
      opportunityMatching: "",
      socialNetworking: "",
      skillsSharing: "",
      eventDiscovery: "",
      impactTracking: "",
      communityBuilding: ""
    }
  });

  const handleChange = (field: string, value: string | string[]) => {
    if (field.startsWith('platformFeatures.')) {
      const featureKey = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        platformFeatures: {
          ...prev.platformFeatures,
          [featureKey]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePlatformFeatureChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      platformFeatures: {
        ...prev.platformFeatures,
        [key]: value
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Standard User Questionnaire data:", formData);
  };

  const platformFeatures = [
    { key: "opportunityMatching", label: "Volunteer opportunity matching based on your skills and interests" },
    { key: "socialNetworking", label: "Social networking with like-minded community members" },
    { key: "skillsSharing", label: "Skills sharing and development platform" },
    { key: "eventDiscovery", label: "Local event discovery and participation tools" },
    { key: "impactTracking", label: "Personal impact tracking and reporting" },
    { key: "communityBuilding", label: "Community building and collaboration tools" }
  ];

  return (
    <QuestionnaireLayout 
      title="Standard User Registration"
      description="Help us understand your interests and goals so we can connect you with meaningful opportunities"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-grey-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-grey-600 mb-6">
          Whether you're looking to volunteer, support causes you care about, or connect with like-minded people in your community, SouLVE is designed to help you make a positive impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <PersonalDetailsSection data={formData} onChange={handleChange} />
        <InterestsAvailabilitySection data={formData} onChange={handleChange} />
        <PlatformFeaturesSection 
          features={platformFeatures}
          values={formData.platformFeatures}
          onChange={handlePlatformFeatureChange}
        />

        <div className="text-centre pt-6">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
          >
            Submit Registration
          </Button>
        </div>
      </form>
    </QuestionnaireLayout>
  );
};

export default StandardUserQuestionnaire;
