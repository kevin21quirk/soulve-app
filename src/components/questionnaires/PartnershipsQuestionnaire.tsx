
import { useState } from "react";
import { Button } from "@/components/ui/button";
import QuestionnaireLayout from "./QuestionnaireLayout";
import OrganisationDetailsSection from "./partnerships/OrganisationDetailsSection";
import ContactPersonSection from "./partnerships/ContactPersonSection";
import PartnershipInterestSection from "./partnerships/PartnershipInterestSection";

const PartnershipsQuestionnaire = () => {
  const [formData, setFormData] = useState({
    organisationName: "",
    primaryIndustry: "",
    geographicAreas: "",
    organisationSize: "",
    contactName: "",
    contactRole: "",
    contactEmail: "",
    contactPhone: "",
    howHeard: "",
    missionAlignment: [],
    partnershipType: [],
    objectives: "",
    resources: [],
    benefits: [],
    similarPartnerships: "",
    timeline: "",
    stakeholders: "",
    firstProject: "",
    challenges: "",
    questions: "",
    additionalInfo: ""
  });

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Partnerships Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Partnership Opportunities"
      description="Thank you for your interest in partnering with SouLVE. Help us understand how we might work together to create mutual value"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE Partnerships</h4>
        <p className="text-gray-600 mb-6">
          We're building a platform that combines social networking with verified community support to strengthen local connections. This questionnaire will help us understand how we might work together to create mutual value.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <OrganisationDetailsSection
          data={{
            organisationName: formData.organisationName,
            primaryIndustry: formData.primaryIndustry,
            geographicAreas: formData.geographicAreas,
            organisationSize: formData.organisationSize
          }}
          onChange={handleInputChange}
        />

        <ContactPersonSection
          data={{
            contactName: formData.contactName,
            contactRole: formData.contactRole,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone
          }}
          onChange={handleInputChange}
        />

        <PartnershipInterestSection
          data={{
            howHeard: formData.howHeard,
            missionAlignment: formData.missionAlignment,
            partnershipType: formData.partnershipType,
            objectives: formData.objectives
          }}
          onChange={handleInputChange}
        />

        <div className="text-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
          >
            Submit Partnership Inquiry
          </Button>
        </div>
      </form>
    </QuestionnaireLayout>
  );
};

export default PartnershipsQuestionnaire;
