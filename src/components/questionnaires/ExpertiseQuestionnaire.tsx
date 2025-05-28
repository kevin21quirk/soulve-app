
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import ProfessionalInfoSection from "./expertise/ProfessionalInfoSection";
import ExpertiseExperienceSection from "./expertise/ExpertiseExperienceSection";
import AvailabilityPreferencesSection from "./expertise/AvailabilityPreferencesSection";
import ContentSupportSection from "./expertise/ContentSupportSection";
import PlatformFeaturesSection from "./shared/PlatformFeaturesSection";

const ExpertiseQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    professionalTitle: "",
    organisation: "",
    location: "",
    expertiseAreas: [],
    experience: "",
    credentials: "",
    availabilityType: "",
    consultingAreas: [],
    previousVolunteering: "",
    platformFeatures: {
      expertMatching: "",
      projectManagement: "",
      knowledgeSharing: "",
      mentorshipPrograms: "",
      skillsAssessment: "",
      impactTracking: ""
    },
    contentInterest: "",
    supportNeeds: [],
    timeCommitment: "",
    workingStyle: "",
    motivations: "",
    contactPhone: ""
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformFeatureChange = (key: string, value: string) => {
    setFormData(prev => ({ 
      ...prev, 
      platformFeatures: { ...prev.platformFeatures, [key]: value }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Expertise Questionnaire data:", formData);
  };

  const platformFeatures = [
    { key: "expertMatching", label: "Expert matching system (connect with organisations needing your specific skills)" },
    { key: "projectManagement", label: "Project management tools (track and manage your volunteer consulting projects)" },
    { key: "knowledgeSharing", label: "Knowledge sharing platform (share expertise through resources and content)" },
    { key: "mentorshipPrograms", label: "Mentorship programmes (provide ongoing guidance to organisation leaders)" },
    { key: "skillsAssessment", label: "Skills assessment and verification system" },
    { key: "impactTracking", label: "Impact tracking (measure the difference your expertise makes)" }
  ];

  return (
    <QuestionnaireLayout 
      title="Expertise Network Registration"
      description="Help us understand your professional expertise and how you can support community organisations"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE Expertise Network</h4>
        <p className="text-grey-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-grey-600 mb-6">
          Our Expertise Network connects skilled professionals with community organisations that need specialised knowledge and support. Your expertise can help make a real difference in strengthening local communities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <ProfessionalInfoSection
          data={{
            email: formData.email,
            name: formData.name,
            professionalTitle: formData.professionalTitle,
            organisation: formData.organisation,
            location: formData.location,
            contactPhone: formData.contactPhone
          }}
          onChange={handleInputChange}
        />

        <ExpertiseExperienceSection
          data={{
            expertiseAreas: formData.expertiseAreas,
            experience: formData.experience,
            credentials: formData.credentials,
            previousVolunteering: formData.previousVolunteering
          }}
          onChange={handleInputChange}
        />

        <AvailabilityPreferencesSection
          data={{
            availabilityType: formData.availabilityType,
            consultingAreas: formData.consultingAreas,
            timeCommitment: formData.timeCommitment,
            workingStyle: formData.workingStyle,
            motivations: formData.motivations
          }}
          onChange={handleInputChange}
        />

        <PlatformFeaturesSection
          features={platformFeatures}
          values={formData.platformFeatures}
          onChange={handlePlatformFeatureChange}
        />

        <ContentSupportSection
          data={{
            contentInterest: formData.contentInterest,
            supportNeeds: formData.supportNeeds
          }}
          onChange={handleInputChange}
        />

        <div className="text-centre pt-6">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
          >
            Submit Application
          </Button>
        </div>
      </form>
    </QuestionnaireLayout>
  );
};

export default ExpertiseQuestionnaire;
