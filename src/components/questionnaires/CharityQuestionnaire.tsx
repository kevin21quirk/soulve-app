
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const CharityQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    charityName: "",
    registrationNumber: "",
    focusAreas: [],
    foundedYear: "",
    teamSize: "",
    currentChallenges: [],
    volunteerManagement: "",
    impactMeasurement: "",
    communicationMethods: [],
    fundraisingChallenges: [],
    platformFeatures: {
      volunteerMatching: "",
      donorEngagement: "",
      impactTracking: "",
      eventManagement: "",
      resourceSharing: "",
      communityBuilding: ""
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
    console.log("Charity Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Charity Registration"
      description="Help us understand your charity's needs and how SouLVE can support your mission"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform is designed to support your charity's mission by providing tools to increase engagement, simplify volunteer management, boost fundraising, and measure impact.
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
            <Label htmlFor="charityName">Charity Name *</Label>
            <Input
              id="charityName"
              value={formData.charityName}
              onChange={(e) => setFormData(prev => ({ ...prev, charityName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="registrationNumber">Charity Registration Number *</Label>
            <Input
              id="registrationNumber"
              value={formData.registrationNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="foundedYear">Year Founded *</Label>
            <Input
              id="foundedYear"
              type="number"
              value={formData.foundedYear}
              onChange={(e) => setFormData(prev => ({ ...prev, foundedYear: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Team Size *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, teamSize: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select team size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5">1-5 people</SelectItem>
                <SelectItem value="6-15">6-15 people</SelectItem>
                <SelectItem value="16-50">16-50 people</SelectItem>
                <SelectItem value="51-100">51-100 people</SelectItem>
                <SelectItem value="100+">100+ people</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Focus Areas</h3>
          
          <div className="space-y-2">
            <Label>What areas does your charity focus on? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Education",
                "Health",
                "Environment",
                "Poverty",
                "Homelessness",
                "Mental Health",
                "Elderly Care",
                "Youth Support",
                "Disability Support",
                "Arts & Culture",
                "Animal Welfare",
                "Community Development"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.focusAreas.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, focusAreas: [...prev.focusAreas, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, focusAreas: prev.focusAreas.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current Challenges</h3>
          
          <div className="space-y-2">
            <Label>What are your biggest operational challenges? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteer recruitment",
                "Volunteer retention",
                "Fundraising",
                "Donor engagement",
                "Marketing and outreach",
                "Administrative burden",
                "Impact measurement",
                "Technology limitations",
                "Staff capacity",
                "Resource coordination"
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Communication & Fundraising</h3>
          
          <div className="space-y-2">
            <Label>How do you currently communicate with supporters? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Email newsletters",
                "Social media",
                "Website updates",
                "Direct mail",
                "Phone calls",
                "In-person events",
                "Text messaging",
                "Mobile app"
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

          <div className="space-y-2">
            <Label>What are your biggest fundraising challenges? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Finding new donors",
                "Donor retention",
                "Grant writing",
                "Event planning",
                "Online fundraising",
                "Major gift solicitation",
                "Corporate partnerships",
                "Fundraising costs"
              ].map((challenge) => (
                <div key={challenge} className="flex items-center space-x-2">
                  <Checkbox
                    id={challenge}
                    checked={formData.fundraisingChallenges.includes(challenge)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, fundraisingChallenges: [...prev.fundraisingChallenges, challenge] }));
                      } else {
                        setFormData(prev => ({ ...prev, fundraisingChallenges: prev.fundraisingChallenges.filter(item => item !== challenge) }));
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "volunteerMatching", label: "Volunteer matching system (automatically connect with skilled volunteers)" },
            { key: "donorEngagement", label: "Donor engagement tools (communicate impact and build relationships)" },
            { key: "impactTracking", label: "Impact tracking dashboard (measure and report your outcomes)" },
            { key: "eventManagement", label: "Event management system (organize and promote charity events)" },
            { key: "resourceSharing", label: "Resource sharing network (share resources with other charities)" },
            { key: "communityBuilding", label: "Community building tools (create supporter communities)" }
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
            <Label>Would your charity be interested in partnering with SouLVE? *</Label>
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
            <Label>What support would your charity need most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Technology training",
                "Marketing support",
                "Fundraising guidance",
                "Volunteer coordination",
                "Impact measurement",
                "Grant writing assistance",
                "Strategic planning",
                "Board development"
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

export default CharityQuestionnaire;
