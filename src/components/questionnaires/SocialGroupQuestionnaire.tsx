import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import OrganisationDetailsSection from "./social-group/OrganisationDetailsSection";
import CurrentChallengesSection from "./social-group/CurrentChallengesSection";
import FoundingPartnershipSection from "./social-group/FoundingPartnershipSection";
import ContactInfoSection from "./community-group/ContactInfoSection";
import PlatformFeaturesSection from "./shared/PlatformFeaturesSection";

const SocialGroupQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    organisationName: "",
    supportFocusArea: [],
    peopleServedMonthly: "",
    primaryServiceModel: [],
    operationalChallenges: [],
    helperMatching: "",
    verificationTraining: "",
    impactMeasurement: "",
    verifiedHelperMatching: "",
    resourceCoordination: "",
    needMapping: "",
    impactTracking: "",
    clientCommunication: "",
    fundraisingTools: "",
    foundingPartnership: "",
    supportNeeds: [],
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlatformFeatureChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Social Group Questionnaire data:", formData);
  };

  const platformFeatures = [
    { key: "verifiedHelperMatching", label: "Verified helper matching (System connecting your needs with pre-verified helpers with relevant skills)" },
    { key: "resourceCoordination", label: "Resource coordination (Tools to request, track and distribute resources where needed)" },
    { key: "needMapping", label: "Need mapping (Geographic visualisation of needs and available support in your area)" },
    { key: "impactTracking", label: "Impact tracking (Metrics and reporting tools to measure and demonstrate your effect)" },
    { key: "clientCommunication", label: "Client communication (Secure messaging and updates for those you support)" },
    { key: "fundraisingTools", label: "Fundraising tools (Simple campaigns with lower fees to fund your support activities)" }
  ];

  return (
    <QuestionnaireLayout 
      title="Social Group Registration"
      description="Help us understand your social group's needs so we can develop features that directly support your work"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">What Is Soulve?</h4>
        <p className="text-gray-600 mb-4">
          Soulve is a platform where community members can safely connect, help each other, and support local causes. Our platform features:
        </p>
        <ul className="text-gray-600 mb-4 list-disc list-inside">
          <li>Verified user profiles with trust scores that grow through positive actions</li>
          <li>Integrated donation and crowdfunding</li>
          <li>AI-powered help matching connecting local needs with verified helpers</li>
          <li>Community recognition system for impact and contributions</li>
          <li>Comprehensive tools for organisations to engage supporters</li>
        </ul>
        <p className="text-gray-600 mb-6">
          Our platform is designed to support your mission by providing tools to increase engagement, simplify volunteer management, boost fundraising, and measure impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <OrganisationDetailsSection
          data={{
            email: formData.email,
            organisationName: formData.organisationName,
            supportFocusArea: formData.supportFocusArea,
            peopleServedMonthly: formData.peopleServedMonthly,
            primaryServiceModel: formData.primaryServiceModel
          }}
          onChange={handleInputChange}
        />

        <CurrentChallengesSection
          data={{
            operationalChallenges: formData.operationalChallenges,
            helperMatching: formData.helperMatching,
            verificationTraining: formData.verificationTraining,
            impactMeasurement: formData.impactMeasurement
          }}
          onChange={handleInputChange}
        />

        <PlatformFeaturesSection
          features={platformFeatures}
          values={{
            verifiedHelperMatching: formData.verifiedHelperMatching,
            resourceCoordination: formData.resourceCoordination,
            needMapping: formData.needMapping,
            impactTracking: formData.impactTracking,
            clientCommunication: formData.clientCommunication,
            fundraisingTools: formData.fundraisingTools
          }}
          onChange={handlePlatformFeatureChange}
        />

        <FoundingPartnershipSection
          data={{
            foundingPartnership: formData.foundingPartnership,
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

export default SocialGroupQuestionnaire;
