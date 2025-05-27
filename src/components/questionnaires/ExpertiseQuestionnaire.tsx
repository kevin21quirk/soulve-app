
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Expertise Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Expertise Network Registration"
      description="Help us understand your professional expertise and how you can support community organizations"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE Expertise Network</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our Expertise Network connects skilled professionals with community organizations that need specialized knowledge and support. Your expertise can help make a real difference in strengthening local communities.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Professional Information</h3>
          
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
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="professionalTitle">Professional Title *</Label>
            <Input
              id="professionalTitle"
              value={formData.professionalTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, professionalTitle: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisation">Current Organisation *</Label>
            <Input
              id="organisation"
              value={formData.organisation}
              onChange={(e) => setFormData(prev => ({ ...prev, organisation: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location/Region *</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="contactPhone">Phone Number (optional)</Label>
            <Input
              id="contactPhone"
              value={formData.contactPhone}
              onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Expertise & Experience</h3>
          
          <div className="space-y-2">
            <Label>Areas of Expertise (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Legal Services",
                "Financial Management",
                "Marketing & Communications",
                "Human Resources",
                "Technology & IT",
                "Grant Writing",
                "Strategic Planning",
                "Operations Management",
                "Fundraising",
                "Board Governance",
                "Program Evaluation",
                "Public Relations",
                "Design & Creative",
                "Data Analysis"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.expertiseAreas.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, expertiseAreas: [...prev.expertiseAreas, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, expertiseAreas: prev.expertiseAreas.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">Years of Professional Experience *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3">1-3 years</SelectItem>
                <SelectItem value="4-7">4-7 years</SelectItem>
                <SelectItem value="8-15">8-15 years</SelectItem>
                <SelectItem value="15+">15+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentials">Relevant qualifications, certifications, or credentials *</Label>
            <Textarea
              id="credentials"
              value={formData.credentials}
              onChange={(e) => setFormData(prev => ({ ...prev, credentials: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousVolunteering">Describe any previous volunteer or pro bono work experience *</Label>
            <Textarea
              id="previousVolunteering"
              value={formData.previousVolunteering}
              onChange={(e) => setFormData(prev => ({ ...prev, previousVolunteering: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Availability & Working Preferences</h3>
          
          <div className="space-y-2">
            <Label htmlFor="availabilityType">What type of support can you provide? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availabilityType: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="one-off-consultations">One-off consultations</SelectItem>
                <SelectItem value="short-term-projects">Short-term projects (1-3 months)</SelectItem>
                <SelectItem value="ongoing-mentoring">Ongoing mentoring/advisory</SelectItem>
                <SelectItem value="emergency-support">Emergency/crisis support</SelectItem>
                <SelectItem value="all-types">All of the above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>In which areas would you be most interested in providing consulting? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Organizational development",
                "Financial planning and management",
                "Marketing and branding",
                "Technology implementation",
                "Legal compliance",
                "Fundraising strategies",
                "Program development",
                "Staff training and development",
                "Board development",
                "Crisis management"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.consultingAreas.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, consultingAreas: [...prev.consultingAreas, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, consultingAreas: prev.consultingAreas.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>How much time per month can you typically dedicate to volunteer consulting? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, timeCommitment: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5-hours">1-5 hours per month</SelectItem>
                <SelectItem value="6-10-hours">6-10 hours per month</SelectItem>
                <SelectItem value="11-20-hours">11-20 hours per month</SelectItem>
                <SelectItem value="20+-hours">20+ hours per month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What is your preferred working style? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, workingStyle: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select working style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote-only">Remote only</SelectItem>
                <SelectItem value="in-person-only">In-person only</SelectItem>
                <SelectItem value="hybrid">Hybrid (both remote and in-person)</SelectItem>
                <SelectItem value="flexible">Flexible, depending on the project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivations">What motivates you to volunteer your professional expertise? *</Label>
            <Textarea
              id="motivations"
              value={formData.motivations}
              onChange={(e) => setFormData(prev => ({ ...prev, motivations: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "expertMatching", label: "Expert matching system (connect with organizations needing your specific skills)" },
            { key: "projectManagement", label: "Project management tools (track and manage your volunteer consulting projects)" },
            { key: "knowledgeSharing", label: "Knowledge sharing platform (share expertise through resources and content)" },
            { key: "mentorshipPrograms", label: "Mentorship programs (provide ongoing guidance to organization leaders)" },
            { key: "skillsAssessment", label: "Skills assessment and verification system" },
            { key: "impactTracking", label: "Impact tracking (measure the difference your expertise makes)" }
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Content & Knowledge Sharing</h3>
          
          <div className="space-y-2">
            <Label>Would you be interested in creating educational content for the platform? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, contentInterest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select interest level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-interested">Very interested</SelectItem>
                <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
                <SelectItem value="maybe">Maybe, depending on the topic</SelectItem>
                <SelectItem value="not-interested">Not interested at this time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What support would you need as a volunteer expert? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Clear project briefs",
                "Regular check-ins with organizations",
                "Technical platform support",
                "Recognition for contributions",
                "Networking with other experts",
                "Training on nonprofit sector",
                "Feedback and impact reports",
                "Professional development opportunities"
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

        <div className="text-center pt-6">
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
