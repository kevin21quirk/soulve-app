
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import BasicInfoSection from "./community-group/BasicInfoSection";
import ActivitiesChallengesSection from "./community-group/ActivitiesChallengesSection";
import CommunicationTechnologySection from "./community-group/CommunicationTechnologySection";
import GrowthImpactSection from "./community-group/GrowthImpactSection";
import CollaborationResourcesSection from "./community-group/CollaborationResourcesSection";
import PartnershipSupportSection from "./community-group/PartnershipSupportSection";
import ContactInfoSection from "./community-group/ContactInfoSection";
import PlatformFeaturesSection from "./shared/PlatformFeaturesSection";

const CommunityGroupQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    groupName: "",
    focusAreas: [],
    yearEstablished: "",
    memberCount: "",
    currentChallenges: [],
    eventTypes: [],
    memberEngagement: "",
    eventFrequency: "",
    communicationMethods: [],
    platformFeatures: {
      eventManagement: "",
      memberCommunication: "",
      resourceSharing: "",
      collaborationTools: "",
      communityBuilding: "",
      volunteerCoordination: ""
    },
    partnershipInterest: "",
    supportNeeds: [],
    growthGoals: "",
    successMeasurement: "",
    collaborationInterest: [],
    resourceNeeds: [],
    digitalTools: [],
    barriers: "",
    communityImpact: "",
    futureVision: "",
    contactName: "",
    contactPosition: "",
    contactEmail: "",
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
    console.log("Community Group Questionnaire data:", formData);
  };

  const platformFeatures = [
    { key: "eventManagement", label: "Event management system (organize and promote community events)" },
    { key: "memberCommunication", label: "Member communication tools (coordinate and update your community)" },
    { key: "resourceSharing", label: "Resource sharing platform (share tools, knowledge, and resources)" },
    { key: "collaborationTools", label: "Collaboration tools (work together on community projects)" },
    { key: "communityBuilding", label: "Community building features (connect members with similar interests)" },
    { key: "volunteerCoordination", label: "Volunteer coordination system (organize and manage volunteers)" }
  ];

  return (
    <QuestionnaireLayout 
      title="Community Group Registration"
      description="Help us understand your community group's needs and how SouLVE can support your mission"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform is designed to support your community group's mission by providing tools to increase engagement, connect members, and make a positive impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInfoSection 
          data={{
            email: formData.email,
            groupName: formData.groupName,
            yearEstablished: formData.yearEstablished,
            memberCount: formData.memberCount,
            focusAreas: formData.focusAreas
          }}
          onChange={handleInputChange}
        />

        <ActivitiesChallengesSection
          data={{
            currentChallenges: formData.currentChallenges,
            eventTypes: formData.eventTypes,
            memberEngagement: formData.memberEngagement,
            eventFrequency: formData.eventFrequency,
            barriers: formData.barriers
          }}
          onChange={handleInputChange}
        />

        <CommunicationTechnologySection
          data={{
            communicationMethods: formData.communicationMethods,
            digitalTools: formData.digitalTools
          }}
          onChange={handleInputChange}
        />

        <GrowthImpactSection
          data={{
            growthGoals: formData.growthGoals,
            successMeasurement: formData.successMeasurement,
            communityImpact: formData.communityImpact,
            futureVision: formData.futureVision
          }}
          onChange={handleInputChange}
        />

        <CollaborationResourcesSection
          data={{
            collaborationInterest: formData.collaborationInterest,
            resourceNeeds: formData.resourceNeeds
          }}
          onChange={handleInputChange}
        />

        <PlatformFeaturesSection
          features={platformFeatures}
          values={formData.platformFeatures}
          onChange={handlePlatformFeatureChange}
        />

        <PartnershipSupportSection
          data={{
            partnershipInterest: formData.partnershipInterest,
            supportNeeds: formData.supportNeeds
          }}
          onChange={handleInputChange}
        />

        <ContactInfoSection
          data={{
            contactName: formData.contactName,
            contactPosition: formData.contactPosition,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone
          }}
          onChange={handleInputChange}
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

export default CommunityGroupQuestionnaire;
