
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Social Group Questionnaire data:", formData);
  };

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
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Organisation Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisationName">Organisation Name *</Label>
            <Input
              id="organisationName"
              value={formData.organisationName}
              onChange={(e) => setFormData(prev => ({ ...prev, organisationName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Support focus area (Tick all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Mental Health",
                "Physical Health",
                "Elderly Support",
                "Youth Support",
                "Crisis Intervention",
                "Addiction Recovery"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.supportFocusArea.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, supportFocusArea: [...prev.supportFocusArea, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, supportFocusArea: prev.supportFocusArea.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="peopleServedMonthly">Number of people served monthly *</Label>
            <Input
              id="peopleServedMonthly"
              value={formData.peopleServedMonthly}
              onChange={(e) => setFormData(prev => ({ ...prev, peopleServedMonthly: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Primary service model (Tick all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "One-to-one support",
                "Group sessions",
                "Resource provision",
                "Crisis response",
                "Long-term care"
              ].map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <Checkbox
                    id={model}
                    checked={formData.primaryServiceModel.includes(model)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, primaryServiceModel: [...prev.primaryServiceModel, model] }));
                      } else {
                        setFormData(prev => ({ ...prev, primaryServiceModel: prev.primaryServiceModel.filter(item => item !== model) }));
                      }
                    }}
                  />
                  <Label htmlFor={model}>{model}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current Challenges</h3>
          
          <div className="space-y-2">
            <Label>What are your biggest operational challenges? (Tick all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer recruitment",
                "Resource acquisition",
                "Client outreach",
                "Coordination",
                "Funding"
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={formData.operationalChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, operationalChallenges: [...prev.operationalChallenges, challenge] }));
                      } else {
                        setFormData(prev => ({ ...prev, operationalChallenges: prev.operationalChallenges.filter(item => item !== challenge) }));
                      }
                    }}
                  />
                  <Label htmlFor={challenge}>{challenge}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="helperMatching">How do you currently match helpers with those in need? *</Label>
            <Textarea
              id="helperMatching"
              value={formData.helperMatching}
              onChange={(e) => setFormData(prev => ({ ...prev, helperMatching: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="verificationTraining">What verification or training do helpers require? *</Label>
            <Textarea
              id="verificationTraining"
              value={formData.verificationTraining}
              onChange={(e) => setFormData(prev => ({ ...prev, verificationTraining: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactMeasurement">How do you measure your impact? *</Label>
            <Textarea
              id="impactMeasurement"
              value={formData.impactMeasurement}
              onChange={(e) => setFormData(prev => ({ ...prev, impactMeasurement: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Soulve Features - How valuable would these features be? (1-5 scale, 5 being most valuable)</h3>
          
          {[
            { key: "verifiedHelperMatching", label: "Verified helper matching (System connecting your needs with pre-verified helpers with relevant skills)" },
            { key: "resourceCoordination", label: "Resource coordination (Tools to request, track and distribute resources where needed)" },
            { key: "needMapping", label: "Need mapping (Geographic visualisation of needs and available support in your area)" },
            { key: "impactTracking", label: "Impact tracking (Metrics and reporting tools to measure and demonstrate your effect)" },
            { key: "clientCommunication", label: "Client communication (Secure messaging and updates for those you support)" },
            { key: "fundraisingTools", label: "Fundraising tools (Simple campaigns with lower fees to fund your support activities)" }
          ].map((feature) => (
            <div key={feature.key} className="space-y-2">
              <Label>{feature.label} *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ ...prev, [feature.key]: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Founding Partnership</h3>
          
          <div className="space-y-2">
            <Label>Would your organisation be interested in becoming a founding partner? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, foundingPartnership: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
                <SelectItem value="need-more-info">Need more information</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What support would your organisation need most? *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Helper recruitment",
                "Skills training",
                "Resource connection",
                "Client outreach",
                "Impact measurement"
              ].map((support) => (
                <div key={support} className="flex items-center space-x-2">
                  <Checkbox
                    id={support}
                    checked={formData.supportNeeds.includes(support)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, supportNeeds: [...prev.supportNeeds, support] }));
                      } else {
                        setFormData(prev => ({ ...prev, supportNeeds: prev.supportNeeds.filter(item => item !== support) }));
                      }
                    }}
                  />
                  <Label htmlFor={support}>{support}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Contact Information (optional)</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName">Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPosition">Position</Label>
              <Input
                id="contactPosition"
                value={formData.contactPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPosition: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
              />
            </div>
          </div>
        </div>

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
