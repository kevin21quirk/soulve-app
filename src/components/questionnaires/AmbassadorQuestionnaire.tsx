
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const AmbassadorQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    location: "",
    communityInvolvement: [],
    leadershipExperience: "",
    networkSize: "",
    ambassadorMotivation: "",
    availableTime: "",
    communicationChannels: [],
    eventExperience: "",
    skillsExpertise: [],
    platformFeatures: {
      communityBuilding: "",
      eventOrganization: "",
      mentorshipPrograms: "",
      networkingTools: "",
      contentCreation: "",
      advocacy: ""
    },
    trainingInterest: "",
    supportNeeds: [],
    previousExperience: "",
    challenges: "",
    goals: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ambassador Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Ambassador Program Registration"
      description="Help us understand your community leadership experience and how you can help grow SouLVE"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE Ambassador Program</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          As a SouLVE Ambassador, you'll play a crucial role in building and nurturing our community, helping us connect with local organizations and individuals who share our vision of positive social impact.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
          
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
            <Label htmlFor="location">Location/Area *</Label>
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Community Leadership Experience</h3>
          
          <div className="space-y-2">
            <Label>What types of community involvement do you currently have? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Local Government",
                "Volunteer Organizations",
                "Business Networks",
                "Educational Institutions",
                "Religious Communities",
                "Sports Clubs",
                "Arts & Culture Groups",
                "Environmental Groups",
                "Professional Associations",
                "Neighbourhood Groups",
                "Youth Organizations",
                "Senior Groups"
              ].map((involvement) => (
                <div key={involvement} className="flex items-center space-x-2">
                  <Checkbox
                    id={involvement}
                    checked={formData.communityInvolvement.includes(involvement)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communityInvolvement: [...prev.communityInvolvement, involvement] }));
                      } else {
                        setFormData(prev => ({ ...prev, communityInvolvement: prev.communityInvolvement.filter(item => item !== involvement) }));
                      }
                    }}
                  />
                  <Label htmlFor={involvement}>{involvement}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadershipExperience">Describe your leadership experience in the community *</Label>
            <Textarea
              id="leadershipExperience"
              value={formData.leadershipExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, leadershipExperience: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Approximately how many people are in your local network? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, networkSize: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select network size" />
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
            <Label htmlFor="previousExperience">Have you been an ambassador or representative for other organizations? Please describe *</Label>
            <Textarea
              id="previousExperience"
              value={formData.previousExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, previousExperience: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Ambassador Motivation & Availability</h3>
          
          <div className="space-y-2">
            <Label htmlFor="ambassadorMotivation">Why are you interested in becoming a SouLVE Ambassador? *</Label>
            <Textarea
              id="ambassadorMotivation"
              value={formData.ambassadorMotivation}
              onChange={(e) => setFormData(prev => ({ ...prev, ambassadorMotivation: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>How much time per week can you dedicate to ambassador activities? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availableTime: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3-hours">1-3 hours per week</SelectItem>
                <SelectItem value="4-6-hours">4-6 hours per week</SelectItem>
                <SelectItem value="7-10-hours">7-10 hours per week</SelectItem>
                <SelectItem value="10+-hours">10+ hours per week</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">What goals do you hope to achieve as a SouLVE Ambassador? *</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="challenges">What challenges do you anticipate in this role and how would you address them? *</Label>
            <Textarea
              id="challenges"
              value={formData.challenges}
              onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Skills & Communication</h3>
          
          <div className="space-y-2">
            <Label>What skills and expertise can you bring to the role? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Public speaking",
                "Event organization",
                "Social media management",
                "Community organizing",
                "Marketing and outreach",
                "Networking",
                "Writing and content creation",
                "Training and mentoring",
                "Project management",
                "Fundraising"
              ].map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skillsExpertise.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, skillsExpertise: [...prev.skillsExpertise, skill] }));
                      } else {
                        setFormData(prev => ({ ...prev, skillsExpertise: prev.skillsExpertise.filter(item => item !== skill) }));
                      }
                    }}
                  />
                  <Label htmlFor={skill}>{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Which communication channels are you most comfortable using? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Face-to-face meetings",
                "Social media platforms",
                "Email communications",
                "Phone calls",
                "Video conferencing",
                "Community events",
                "Workshops and presentations",
                "Written materials"
              ].map((channel) => (
                <div key={channel} className="flex items-center space-x-2">
                  <Checkbox
                    id={channel}
                    checked={formData.communicationChannels.includes(channel)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communicationChannels: [...prev.communicationChannels, channel] }));
                      } else {
                        setFormData(prev => ({ ...prev, communicationChannels: prev.communicationChannels.filter(item => item !== channel) }));
                      }
                    }}
                  />
                  <Label htmlFor={channel}>{channel}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eventExperience">Describe your experience organizing or participating in community events *</Label>
            <Textarea
              id="eventExperience"
              value={formData.eventExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, eventExperience: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "communityBuilding", label: "Community building tools (help connect local residents and organizations)" },
            { key: "eventOrganization", label: "Event organization platform (coordinate community events and activities)" },
            { key: "mentorshipPrograms", label: "Mentorship programs (guide new community members and organizations)" },
            { key: "networkingTools", label: "Networking tools (facilitate connections between community stakeholders)" },
            { key: "contentCreation", label: "Content creation support (materials and resources for community engagement)" },
            { key: "advocacy", label: "Advocacy platform (promote community causes and initiatives)" }
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Training & Support</h3>
          
          <div className="space-y-2">
            <Label>What type of training would you be most interested in? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, trainingInterest: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select training interest" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="platform-training">SouLVE platform training</SelectItem>
                <SelectItem value="community-building">Community building techniques</SelectItem>
                <SelectItem value="leadership-development">Leadership development</SelectItem>
                <SelectItem value="communication-skills">Communication and presentation skills</SelectItem>
                <SelectItem value="event-management">Event management</SelectItem>
                <SelectItem value="all-above">All of the above</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What support would you need most as an ambassador? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Regular training sessions",
                "Marketing materials",
                "Technical support",
                "Community building guidance",
                "Event planning assistance",
                "Networking opportunities",
                "Recognition programs",
                "Ongoing mentorship"
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

export default AmbassadorQuestionnaire;
