
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import CharityDetailsSection from "./charity/CharityDetailsSection";
import OperationsNeedsSection from "./charity/OperationsNeedsSection";
import PlatformFeaturesSection from "./shared/PlatformFeaturesSection";

const CharityQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    charityName: "",
    registrationNumber: "",
    focusAreas: [],
    charitySize: "",
    yearsOperating: "",
    currentChallenges: [],
    volunteerManagement: "",
    successMeasurement: "",
    partnershipNeeds: [],
    platformFeatures: {
      volunteerMatching: "",
      donorEngagement: "",
      impactReporting: "",
      communityBuilding: "",
      fundingSupport: "",
      partnershipFacilitation: ""
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Charity Questionnaire data:", formData);
  };

  const platformFeatures = [
    { key: "volunteerMatching", label: "Volunteer matching and coordination platform" },
    { key: "donorEngagement", label: "Donor engagement and relationship management tools" },
    { key: "impactReporting", label: "Impact measurement and reporting system" },
    { key: "communityBuilding", label: "Community building and supporter networking" },
    { key: "fundingSupport", label: "Fundraising and grant application support" },
    { key: "partnershipFacilitation", label: "Partnership facilitation with other organizations" }
  ];

  return (
    <QuestionnaireLayout 
      title="Charity Registration"
      description="Help us understand your charity's mission and how SouLVE can amplify your impact"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform is designed to help charities connect with volunteers, donors, and partner organizations to maximize their positive impact in the community.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <CharityDetailsSection data={formData} onChange={handleChange} />
        <OperationsNeedsSection data={formData} onChange={handleChange} />
        <PlatformFeaturesSection 
          data={formData.platformFeatures} 
          onChange={handleChange}
          features={platformFeatures}
        />

        <div className="text-center pt-6">
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

export default CharityQuestionnaire;
