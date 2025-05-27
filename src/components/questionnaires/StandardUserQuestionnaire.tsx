
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const StandardUserQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    age: "",
    location: "",
    currentInvolvement: [],
    interests: [],
    skills: [],
    availability: "",
    volunteerExperience: "",
    motivations: "",
    preferredActivities: [],
    timeCommitment: "",
    transportationAccess: "",
    platformFeatures: {
      opportunityMatching: "",
      socialNetworking: "",
      skillsSharing: "",
      eventDiscovery: "",
      impactTracking: "",
      communityBuilding: ""
    },
    barriers: "",
    supportNeeds: [],
    communicationPreferences: [],
    workingStyle: "",
    leadershipInterest: "",
    mentorshipInterest: "",
    causeAreas: [],
    personalGoals: "",
    communityConnection: "",
    technologyComfort: "",
    learningInterests: [],
    networkingGoals: "",
    impactExpectations: "",
    longTermVision: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Standard User Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Standard User Registration"
      description="Help us understand your interests and goals so we can connect you with meaningful opportunities"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Whether you're looking to volunteer, support causes you care about, or connect with like-minded people in your community, SouLVE is designed to help you make a positive impact.
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

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Age Range *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, age: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select age range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="under-18">Under 18</SelectItem>
                <SelectItem value="18-24">18-24</SelectItem>
                <SelectItem value="25-34">25-34</SelectItem>
                <SelectItem value="35-44">35-44</SelectItem>
                <SelectItem value="45-54">45-54</SelectItem>
                <SelectItem value="55-64">55-64</SelectItem>
                <SelectItem value="65+">65+</SelectItem>
              </SelectContent>
            </Select>
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Current Involvement & Experience</h3>
          
          <div className="space-y-2">
            <Label>Are you currently involved in any community activities? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Volunteering with charities",
                "Community group member",
                "Religious organization",
                "Sports clubs",
                "Environmental groups",
                "Professional associations",
                "Neighborhood committees",
                "Youth organizations",
                "Political activities",
                "Cultural groups",
                "Online communities",
                "Not currently involved"
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.currentInvolvement.includes(activity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, currentInvolvement: [...prev.currentInvolvement, activity] }));
                      } else {
                        setFormData(prev => ({ ...prev, currentInvolvement: prev.currentInvolvement.filter(item => item !== activity) }));
                      }
                    }}
                  />
                  <Label htmlFor={activity}>{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="volunteerExperience">Describe your volunteer or community service experience *</Label>
            <Textarea
              id="volunteerExperience"
              value={formData.volunteerExperience}
              onChange={(e) => setFormData(prev => ({ ...prev, volunteerExperience: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="communityConnection">How connected do you feel to your local community? *</Label>
            <Textarea
              id="communityConnection"
              value={formData.communityConnection}
              onChange={(e) => setFormData(prev => ({ ...prev, communityConnection: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Interests & Causes</h3>
          
          <div className="space-y-2">
            <Label>What cause areas are you most passionate about? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Education",
                "Health & Wellness",
                "Environment",
                "Poverty & Homelessness",
                "Animal Welfare",
                "Arts & Culture",
                "Youth Development",
                "Senior Support",
                "Mental Health",
                "Social Justice",
                "Community Development",
                "Disaster Relief",
                "International Aid",
                "Technology for Good",
                "Sports & Recreation",
                "Disability Support"
              ].map((area) => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.causeAreas.includes(area)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, causeAreas: [...prev.causeAreas, area] }));
                      } else {
                        setFormData(prev => ({ ...prev, causeAreas: prev.causeAreas.filter(item => item !== area) }));
                      }
                    }}
                  />
                  <Label htmlFor={area}>{area}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What types of activities interest you most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Direct service (hands-on help)",
                "Administrative support",
                "Event planning",
                "Fundraising",
                "Mentoring/tutoring",
                "Advocacy/campaigning",
                "Research and analysis",
                "Creative projects",
                "Technology support",
                "Transportation services",
                "Professional consulting",
                "Training and workshops"
              ].map((activity) => (
                <div key={activity} className="flex items-center space-x-2">
                  <Checkbox
                    id={activity}
                    checked={formData.preferredActivities.includes(activity)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, preferredActivities: [...prev.preferredActivities, activity] }));
                      } else {
                        setFormData(prev => ({ ...prev, preferredActivities: prev.preferredActivities.filter(item => item !== activity) }));
                      }
                    }}
                  />
                  <Label htmlFor={activity}>{activity}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="motivations">What motivates you to get involved in community work? *</Label>
            <Textarea
              id="motivations"
              value={formData.motivations}
              onChange={(e) => setFormData(prev => ({ ...prev, motivations: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="personalGoals">What personal goals do you hope to achieve through community involvement? *</Label>
            <Textarea
              id="personalGoals"
              value={formData.personalGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, personalGoals: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Skills & Expertise</h3>
          
          <div className="space-y-2">
            <Label>What skills would you like to contribute? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Communication",
                "Leadership",
                "Organization",
                "Teaching/Training",
                "Marketing",
                "Social Media",
                "Writing",
                "Design",
                "Technology/IT",
                "Finance/Accounting",
                "Legal",
                "Healthcare",
                "Construction/Maintenance",
                "Languages",
                "Cooking",
                "Photography/Video",
                "Music/Arts",
                "Sports/Fitness"
              ].map((skill) => (
                <div key={skill} className="flex items-center space-x-2">
                  <Checkbox
                    id={skill}
                    checked={formData.skills.includes(skill)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                      } else {
                        setFormData(prev => ({ ...prev, skills: prev.skills.filter(item => item !== skill) }));
                      }
                    }}
                  />
                  <Label htmlFor={skill}>{skill}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>What new skills would you like to learn? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Leadership development",
                "Public speaking",
                "Grant writing",
                "Project management",
                "Digital marketing",
                "Data analysis",
                "Community organizing",
                "Fundraising",
                "Conflict resolution",
                "Cultural competency",
                "Financial literacy",
                "Event planning",
                "Mentoring skills",
                "Crisis intervention"
              ].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.learningInterests.includes(interest)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, learningInterests: [...prev.learningInterests, interest] }));
                      } else {
                        setFormData(prev => ({ ...prev, learningInterests: prev.learningInterests.filter(item => item !== interest) }));
                      }
                    }}
                  />
                  <Label htmlFor={interest}>{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leadershipInterest">Are you interested in taking on leadership roles? *</Label>
            <Textarea
              id="leadershipInterest"
              value={formData.leadershipInterest}
              onChange={(e) => setFormData(prev => ({ ...prev, leadershipInterest: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mentorshipInterest">Would you be interested in mentoring others or being mentored? *</Label>
            <Textarea
              id="mentorshipInterest"
              value={formData.mentorshipInterest}
              onChange={(e) => setFormData(prev => ({ ...prev, mentorshipInterest: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Availability & Preferences</h3>
          
          <div className="space-y-2">
            <Label>How much time can you typically commit per month? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, timeCommitment: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select time commitment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-5-hours">1-5 hours per month</SelectItem>
                <SelectItem value="6-10-hours">6-10 hours per month</SelectItem>
                <SelectItem value="11-20-hours">11-20 hours per month</SelectItem>
                <SelectItem value="21-40-hours">21-40 hours per month</SelectItem>
                <SelectItem value="40+-hours">40+ hours per month</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>What is your preferred availability? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekday-daytime">Weekday daytime</SelectItem>
                <SelectItem value="weekday-evenings">Weekday evenings</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="flexible">Flexible schedule</SelectItem>
                <SelectItem value="seasonal">Seasonal availability</SelectItem>
                <SelectItem value="emergency-only">Emergency response only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportationAccess">Do you have reliable transportation? *</Label>
            <Textarea
              id="transportationAccess"
              value={formData.transportationAccess}
              onChange={(e) => setFormData(prev => ({ ...prev, transportationAccess: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What is your preferred working style? *</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, workingStyle: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select working style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="independent">Independent work</SelectItem>
                <SelectItem value="team-based">Team-based collaboration</SelectItem>
                <SelectItem value="leadership">Leadership roles</SelectItem>
                <SelectItem value="support">Support roles</SelectItem>
                <SelectItem value="mixed">Mix of different styles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>How do you prefer to communicate? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Email",
                "Text messaging",
                "Phone calls",
                "Video calls",
                "Social media",
                "Mobile apps",
                "In-person meetings",
                "Written updates"
              ].map((method) => (
                <div key={method} className="flex items-center space-x-2">
                  <Checkbox
                    id={method}
                    checked={formData.communicationPreferences.includes(method)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, communicationPreferences: [...prev.communicationPreferences, method] }));
                      } else {
                        setFormData(prev => ({ ...prev, communicationPreferences: prev.communicationPreferences.filter(item => item !== method) }));
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Technology & Networking</h3>
          
          <div className="space-y-2">
            <Label htmlFor="technologyComfort">How comfortable are you with using technology platforms? *</Label>
            <Textarea
              id="technologyComfort"
              value={formData.technologyComfort}
              onChange={(e) => setFormData(prev => ({ ...prev, technologyComfort: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="networkingGoals">What are your networking and relationship-building goals? *</Label>
            <Textarea
              id="networkingGoals"
              value={formData.networkingGoals}
              onChange={(e) => setFormData(prev => ({ ...prev, networkingGoals: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="impactExpectations">What kind of impact do you hope to make through your involvement? *</Label>
            <Textarea
              id="impactExpectations"
              value={formData.impactExpectations}
              onChange={(e) => setFormData(prev => ({ ...prev, impactExpectations: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="longTermVision">What is your long-term vision for your community involvement? *</Label>
            <Textarea
              id="longTermVision"
              value={formData.longTermVision}
              onChange={(e) => setFormData(prev => ({ ...prev, longTermVision: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Barriers & Support</h3>
          
          <div className="space-y-2">
            <Label htmlFor="barriers">What barriers or challenges might prevent you from getting involved? *</Label>
            <Textarea
              id="barriers"
              value={formData.barriers}
              onChange={(e) => setFormData(prev => ({ ...prev, barriers: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What support would help you be more effective? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Training and orientation",
                "Flexible scheduling",
                "Transportation assistance",
                "Childcare support",
                "Technology training",
                "Mentorship",
                "Regular feedback",
                "Recognition programs",
                "Social connections",
                "Professional development",
                "Clear role descriptions",
                "Ongoing support"
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
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">SouLVE Platform Features - How valuable would these be? (1-5 scale)</h3>
          
          {[
            { key: "opportunityMatching", label: "Volunteer opportunity matching based on your skills and interests" },
            { key: "socialNetworking", label: "Social networking with like-minded community members" },
            { key: "skillsSharing", label: "Skills sharing and development platform" },
            { key: "eventDiscovery", label: "Local event discovery and participation tools" },
            { key: "impactTracking", label: "Personal impact tracking and reporting" },
            { key: "communityBuilding", label: "Community building and collaboration tools" }
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

export default StandardUserQuestionnaire;
