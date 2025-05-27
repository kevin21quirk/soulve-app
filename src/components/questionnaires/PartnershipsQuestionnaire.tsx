
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

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
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Organisation Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="organisationName">Organisation name *</Label>
            <Input
              id="organisationName"
              value={formData.organisationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organisationName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="primaryIndustry">Primary industry/sector *</Label>
            <Input
              id="primaryIndustry"
              value={formData.primaryIndustry}
              onChange={(e) => setFormData(prev => ({ ...prev, primaryIndustry: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="geographicAreas">Geographic areas you operate in *</Label>
            <Input
              id="geographicAreas"
              value={formData.geographicAreas}
              onChange={(e) => setFormData(prev => ({ ...prev, geographicAreas: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisationSize">Number of employees/size of organisation *</Label>
            <Input
              id="organisationSize"
              value={formData.organisationSize}
              onChange={(e) => setFormData(prev => ({ ...prev, organisationSize: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Primary Contact Person</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Name *</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactRole">Role *</Label>
              <Input
                id="contactRole"
                value={formData.contactRole}
                onChange={(e) => setFormData(prev => ({ ...prev, contactRole: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone *</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                required
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Partnership Interest</h3>
          
          <div className="space-y-2">
            <Label htmlFor="howHeard">How did you hear about SouLVE? *</Label>
            <Input
              id="howHeard"
              value={formData.howHeard}
              onChange={(e) => setFormData(prev => ({ ...prev, howHeard: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What aspects of SouLVE's mission most align with your organisation's goals? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Community strengthening",
                "Trust and verification solutions",
                "Local impact measurement",
                "Volunteer mobilisation",
                "Donation/fundraising capabilities"
              ].map((aspect) => (
                <div key={aspect} className="flex items-center space-x-2">
                  <Checkbox
                    id={aspect}
                    checked={formData.missionAlignment.includes(aspect)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, missionAlignment: [...prev.missionAlignment, aspect] }));
                      } else {
                        setFormData(prev => ({ ...prev, missionAlignment: prev.missionAlignment.filter(item => item !== aspect) }));
                      }
                    }}
                  />
                  <Label htmlFor={aspect}>{aspect}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What type of partnership are you most interested in? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Commercial integration",
                "Co-marketing opportunities",
                "Technology collaboration",
                "CSR/community impact initiatives",
                "Sponsorship"
              ].map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={type}
                    checked={formData.partnershipType.includes(type)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, partnershipType: [...prev.partnershipType, type] }));
                      } else {
                        setFormData(prev => ({ ...prev, partnershipType: prev.partnershipType.filter(item => item !== type) }));
                      }
                    }}
                  />
                  <Label htmlFor={type}>{type}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectives">What specific objectives would you hope to achieve through this partnership? *</Label>
            <Textarea
              id="objectives"
              value={formData.objectives}
              onChange={(e) => setFormData(prev => ({ ...prev, objectives: e.target.value }))}
              required
            />
          </div>
        </div>

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
