
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

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
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Community Group Questionnaire data:", formData);
  };

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
            <Label htmlFor="groupName">Community Group Name *</Label>
            <Input
              id="groupName"
              value={formData.groupName}
              onChange={(e) => setFormData(prev => ({ ...prev, groupName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="yearEstablished">Year Established *</Label>
            <Input
              id="yearEstablished"
              type="number"
              value={formData.yearEstablished}
              onChange={(e) => setFormData(prev => ({ ...prev, yearEstablished: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Member Count *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, memberCount: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select member count" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-10">1-10 members</SelectItem>
                <SelectItem value="11-25">11-25 members</SelectItem>
                <SelectItem value="26-50">26-50 members</SelectItem>
                <SelectItem value="51-100">51-100 members</SelectItem>
                <SelectItem value="100+">100+ members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What areas does your community group focus on? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Neighbourhood Improvement",
                "Social Events",
                "Environmental Action",
                "Cultural Activities",
                "Education & Learning",
                "Health & Wellness",
                "Youth Programs",
                "Senior Support",
                "Community Safety",
                "Arts & Culture",
                "Sports & Recreation",
                "Advocacy & Awareness"
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current Activities & Challenges</h3>
          
          <div className="space-y-2">
            <Label>What are your biggest challenges? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Member recruitment",
                "Member retention",
                "Event planning",
                "Communication coordination",
                "Funding/resources",
                "Venue booking",
                "Volunteer coordination",
                "Community outreach"
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
            <Label>What types of events/activities do you organize? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Social gatherings",
                "Educational workshops",
                "Community clean-ups",
                "Fundraising events",
                "Cultural celebrations",
                "Sports activities",
                "Volunteer projects",
                "Advocacy campaigns"
              ].map((eventType) => (
                <div key={eventType} className="flex items-center space-x-2">
                  <Checkbox
                    id={eventType}
                    checked={formData.eventTypes.includes(eventType)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, eventTypes: [...prev.eventTypes, eventType] }));
                      } else {
                        setFormData(prev => ({ ...prev, eventTypes: prev.eventTypes.filter(item => item !== eventType) }));
                      }
                    }}
                  />
                  <Label htmlFor={eventType}>{eventType}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="memberEngagement">How do you currently engage with members? *</Label>
            <Textarea
              id="memberEngagement"
              value={formData.memberEngagement}
              onChange={(e) => setFormData(prev => ({ ...prev, memberEngagement: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>How often do you organize events/activities? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, eventFrequency: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="quarterly">Quarterly</SelectItem>
                <SelectItem value="annually">Annually</SelectItem>
                <SelectItem value="ad-hoc">As needed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Communication</h3>
          
          <div className="space-y-2">
            <Label>How do you currently communicate with members? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Email lists",
                "Social media groups",
                "WhatsApp groups",
                "Newsletter",
                "Website updates",
                "In-person meetings",
                "Text messaging",
                "Community notice boards"
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
            { key: "eventManagement", label: "Event management system (organize and promote community events)" },
            { key: "memberCommunication", label: "Member communication tools (coordinate and update your community)" },
            { key: "resourceSharing", label: "Resource sharing platform (share tools, knowledge, and resources)" },
            { key: "collaborationTools", label: "Collaboration tools (work together on community projects)" },
            { key: "communityBuilding", label: "Community building features (connect members with similar interests)" },
            { key: "volunteerCoordination", label: "Volunteer coordination system (organize and manage volunteers)" }
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
            <Label>Would your community group be interested in partnering with SouLVE? *</Label>
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
            <Label>What support would your community group need most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Event planning assistance",
                "Member engagement strategies",
                "Communication tools training",
                "Fundraising guidance",
                "Volunteer coordination",
                "Community outreach support",
                "Resource sharing networks",
                "Leadership development"
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

export default CommunityGroupQuestionnaire;
