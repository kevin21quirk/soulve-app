
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const ReligiousGroupQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    organisationName: "",
    religiousTradition: "",
    congregationSize: "",
    establishedYear: "",
    communityPrograms: [],
    outreachActivities: [],
    volunteerManagement: "",
    currentChallenges: [],
    communicationMethods: [],
    impactMeasurement: "",
    platformFeatures: {
      volunteerCoordination: "",
      programManagement: "",
      communityOutreach: "",
      resourceSharing: "",
      impactTracking: "",
      interfaithCollaboration: ""
    },
    partnershipInterest: "",
    supportNeeds: [],
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Religious Group Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Religious Group Registration"
      description="Help us understand your religious group's community outreach and how SouLVE can support your mission"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform is designed to support your religious group's community outreach by providing tools to coordinate volunteers, manage programs, and measure impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
          
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
            <Label htmlFor="religiousTradition">Religious Tradition *</Label>
            <Input
              id="religiousTradition"
              value={formData.religiousTradition}
              onChange={(e) => setFormData(prev => ({ ...prev, religiousTradition: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Congregation/Community Size *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, congregationSize: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-50">Under 50 people</SelectItem>
                <SelectItem value="50-150">50-150 people</SelectItem>
                <SelectItem value="150-500">150-500 people</SelectItem>
                <SelectItem value="500-1000">500-1000 people</SelectItem>
                <SelectItem value="over-1000">Over 1000 people</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="establishedYear">Year Established *</Label>
            <Input
              id="establishedYear"
              type="number"
              value={formData.establishedYear}
              onChange={(e) => setFormData(prev => ({ ...prev, establishedYear: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Community Programs & Outreach</h3>
          
          <div className="space-y-2">
            <Label>What community programs do you currently run? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Food Programs",
                "Homeless Support",
                "Youth Ministry",
                "Elderly Care",
                "Community Events",
                "Educational Programs",
                "Counseling Services",
                "Disaster Relief",
                "Prison Ministry",
                "Healthcare Support",
                "Family Support",
                "Addiction Recovery"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.communityPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communityPrograms: [...prev.communityPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, communityPrograms: prev.communityPrograms.filter(item => item !== program) }));
                      }
                    }}
                  />
                  <Label htmlFor={program}>{program}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What outreach activities do you engage in? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Community partnerships",
                "Interfaith dialogue",
                "Public events",
                "Social justice advocacy",
                "Environmental stewardship",
                "Cultural celebrations",
                "Educational workshops",
                "Health initiatives"
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.outreachActivities.includes(activity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, outreachActivities: [...prev.outreachActivities, activity] }));
                      } else {
                        setFormData(prev => ({ ...prev, outreachActivities: prev.outreachActivities.filter(item => item !== activity) }));
                      }
                    }}
                  />
                  <Label htmlFor={activity}>{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteerManagement">How do you currently manage volunteers? *</Label>
            <Textarea
              id="volunteerManagement"
              value={formData.volunteerManagement}
              onChange={(e) => setFormData(prev => ({ ...prev, volunteerManagement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactMeasurement">How do you measure your community impact? *</Label>
            <Textarea
              id="impactMeasurement"
              value={formData.impactMeasurement}
              onChange={(e) => setFormData(prev => ({ ...prev, impactMeasurement: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current Challenges</h3>
          
          <div className="space-y-2">
            <Label>What are your biggest operational challenges? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer coordination",
                "Resource allocation",
                "Community engagement",
                "Program funding",
                "Administrative burden",
                "Outreach effectiveness",
                "Inter-community collaboration",
                "Technology limitations"
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={formData.currentChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, currentChallenges: [...prev.currentChallenges, challenge] }));
                      } else {
                        setFormData(prev => ({ ...prev, currentChallenges: prev.currentChallenges.filter(item => item !== challenge) }));
                      }
                    }}
                  />
                  <Label htmlFor={challenge}>{challenge}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Communication</h3>
          
          <div className="space-y-2">
            <Label>How do you currently communicate with your community? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Weekly bulletins",
                "Email newsletters",
                "Social media",
                "Website updates",
                "Community meetings",
                "Personal visits",
                "Phone calls",
                "Text messaging"
              ].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={formData.communicationMethods.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communicationMethods: [...prev.communicationMethods, method] }));
                      } else {
                        setFormData(prev => ({ ...prev, communicationMethods: prev.communicationMethods.filter(item => item !== method) }));
                      }
                    }}
                  />
                  <Label htmlFor={method}>{method}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "volunteerCoordination", label: "Volunteer coordination system (organize and schedule community volunteers)" },
            { key: "programManagement", label: "Program management tools (organize and track community programs)" },
            { key: "communityOutreach", label: "Community outreach platform (connect with broader community)" },
            { key: "resourceSharing", label: "Resource sharing network (share resources with other organizations)" },
            { key: "impactTracking", label: "Impact tracking dashboard (measure and report community impact)" },
            { key: "interfaithCollaboration", label: "Interfaith collaboration tools (partner with other religious groups)" }
          ].map((feature) => (
            <div key={feature.key} className="space-y-2">
              <Label>{feature.label} *</Label>
              <Select onValueChange={(value) => setFormData(prev => ({ 
                ...prev, 
                platformFeatures: { ...prev.platformFeatures, [feature.key]: value }
              }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select rating (1-5)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 - Not valuable</SelectItem>
                  <SelectItem value="2">2 - Slightly valuable</SelectItem>
                  <SelectItem value="3">3 - Moderately valuable</SelectItem>
                  <SelectItem value="4">4 - Very valuable</SelectItem>
                  <SelectItem value="5">5 - Extremely valuable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Partnership & Support</h3>
          
          <div className="space-y-2">
            <Label>Would your religious group be interested in partnering with SouLVE? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, partnershipInterest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-interested">Very interested</SelectItem>
                <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
                <SelectItem value="need-more-info">Need more information</SelectItem>
                <SelectItem value="not-interested">Not interested at this time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What support would your organization need most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer management training",
                "Program coordination tools",
                "Community engagement strategies",
                "Technology training",
                "Impact measurement guidance",
                "Interfaith collaboration support",
                "Resource sharing networks",
                "Administrative assistance"
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
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                value={formData.contactName}
                onChange={(e) => setFormData(prev => ({ ...prev, contactName: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPosition">Position/Title</Label>
              <Input
                id="contactPosition"
                value={formData.contactPosition}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPosition: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
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

export default ReligiousGroupQuestionnaire;
