
import { useState } from "react";
import { Heart, Tag, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import RegistrationStep from "../RegistrationStep";

interface InterestsStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  userType?: string;
}

const InterestsStep = ({ onNext, onPrevious, currentStep, totalSteps, userType = "individual" }: InterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  const getInterestsForType = (type: string) => {
    switch (type) {
      case "individual":
        return [
          "Community Building", "Education", "Environment", "Healthcare",
          "Senior Care", "Youth Mentoring", "Animal Welfare", "Food Security",
          "Mental Health", "Arts & Culture", "Social Justice", "Technology for Good",
          "Disability Support", "Emergency Response", "Homelessness", "Financial Literacy"
        ];
      case "charity":
        return [
          "Poverty Alleviation", "Education Access", "Healthcare Access", "Environmental Conservation",
          "Social Justice", "Human Rights", "Disaster Relief", "Community Development",
          "Arts & Culture", "Animal Welfare", "Mental Health", "Substance Abuse",
          "Homelessness", "Food Security", "Youth Development", "Senior Services"
        ];
      case "business":
        return [
          "Employee Volunteering", "Local Community Support", "Environmental Sustainability", "Education Partnerships",
          "Skills-Based Volunteering", "Youth Employment", "Local Economic Development", "Health & Wellness",
          "Digital Inclusion", "Financial Literacy", "Entrepreneurship Support", "Diversity & Inclusion",
          "Clean Energy", "Sustainable Practices", "Community Infrastructure", "Arts Sponsorship"
        ];
      default:
        return [
          "Community Development", "Local Events", "Neighborhood Safety", "Youth Programs",
          "Senior Services", "Cultural Activities", "Environmental Projects", "Health & Wellness",
          "Education Support", "Food Programs", "Housing Support", "Transportation",
          "Emergency Preparedness", "Social Services", "Recreation Programs", "Faith-Based Outreach"
        ];
    }
  };

  const getSkillsForType = (type: string) => {
    switch (type) {
      case "individual":
        return [
          "Teaching", "Counseling", "Technology Support", "Healthcare", "Legal Advice",
          "Transportation", "Childcare", "Elder Care", "Event Planning", "Fundraising",
          "Writing", "Translation", "Photography", "Graphic Design", "Home Repair",
          "Gardening", "Cooking", "Financial Planning", "Project Management", "Public Speaking"
        ];
      case "charity":
        return [
          "Grant Writing", "Fundraising", "Volunteer Management", "Program Development", "Community Outreach",
          "Social Media Marketing", "Event Management", "Financial Management", "Impact Measurement", "Partnership Development",
          "Public Speaking", "Research & Analysis", "Training & Education", "Crisis Management", "Digital Marketing",
          "Donor Relations", "Board Governance", "Strategic Planning", "Policy Advocacy", "Data Analysis"
        ];
      case "business":
        return [
          "Corporate Volunteering", "Employee Engagement", "Strategic Planning", "Marketing & Branding", "Technology Solutions",
          "Financial Management", "HR & Recruitment", "Legal Services", "Project Management", "Supply Chain Management",
          "Digital Transformation", "Data Analytics", "Training & Development", "Quality Assurance", "Innovation & R&D",
          "Customer Service", "Operations Management", "Risk Management", "Sustainability Consulting", "Product Development"
        ];
      default:
        return [
          "Event Organization", "Community Outreach", "Volunteer Coordination", "Administrative Support", "Public Relations",
          "Facility Management", "Program Planning", "Membership Management", "Financial Oversight", "Communications",
          "Social Media", "Website Management", "Fundraising", "Grant Applications", "Partnership Building",
          "Meeting Facilitation", "Conflict Resolution", "Training Delivery", "Resource Development", "Network Building"
        ];
    }
  };

  const predefinedInterests = getInterestsForType(userType);
  const predefinedSkills = getSkillsForType(userType);

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      setSelectedInterests(prev => [...prev, customInterest.trim()]);
      setCustomInterest("");
    }
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill("");
    }
  };

  const removeInterest = (interest: string) => {
    setSelectedInterests(prev => prev.filter(i => i !== interest));
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(prev => prev.filter(s => s !== skill));
  };

  const handleNext = () => {
    onNext({ 
      interests: selectedInterests,
      skills: selectedSkills
    });
  };

  const isFormValid = selectedInterests.length > 0 || selectedSkills.length > 0;

  const getLabelsForType = () => {
    switch (userType) {
      case "charity":
        return {
          interestsTitle: "What causes do you focus on?",
          skillsTitle: "What capabilities does your organization offer?",
          interestsPlaceholder: "Add a custom cause area...",
          skillsPlaceholder: "Add a custom capability..."
        };
      case "business":
        return {
          interestsTitle: "What CSR areas interest your company?",
          skillsTitle: "What corporate resources can you offer?",
          interestsPlaceholder: "Add a custom CSR focus...",
          skillsPlaceholder: "Add a custom business capability..."
        };
      default:
        return {
          interestsTitle: "What causes do you care about?",
          skillsTitle: "What skills can you offer?",
          interestsPlaceholder: "Add a custom interest...",
          skillsPlaceholder: "Add a custom skill..."
        };
    }
  };

  const labels = getLabelsForType();

  const platformInsight = {
    title: "Smart Matching",
    description: userType === "individual" 
      ? "Your interests and skills help us connect you with the right opportunities and people. Our algorithm considers your preferences, location, and availability to suggest meaningful ways to help and get help."
      : "Your focus areas and capabilities help us connect you with relevant community partners and opportunities that align with your organization's mission and resources.",
    icon: <Heart className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Your Interests & Skills"
      subtitle={userType === "individual" 
        ? "Help us understand what matters to you and what you're good at so we can connect you with the perfect opportunities."
        : "Tell us about your organization's focus areas and capabilities so we can suggest relevant partnerships and community opportunities."
      }
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={onPrevious}
      isNextEnabled={isFormValid}
      platformInsight={platformInsight}
    >
      <div className="space-y-6">
        {/* Interests Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold">{labels.interestsTitle}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {predefinedInterests.map((interest) => (
              <Button
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleInterest(interest)}
                className={`h-auto py-2 px-3 text-left justify-start text-xs ${
                  selectedInterests.includes(interest) 
                    ? "bg-teal-600 hover:bg-teal-700" 
                    : "hover:bg-teal-50"
                }`}
              >
                {interest}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder={labels.interestsPlaceholder}
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
            />
            <Button onClick={addCustomInterest} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selectedInterests.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected interests:</p>
              <div className="flex flex-wrap gap-2">
                {selectedInterests.map((interest) => (
                  <Badge key={interest} variant="secondary" className="pr-1">
                    {interest}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInterest(interest)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skills Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Tag className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{labels.skillsTitle}</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {predefinedSkills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSkill(skill)}
                className={`h-auto py-2 px-3 text-left justify-start text-xs ${
                  selectedSkills.includes(skill) 
                    ? "bg-blue-600 hover:bg-blue-700" 
                    : "hover:bg-blue-50"
                }`}
              >
                {skill}
              </Button>
            ))}
          </div>

          <div className="flex space-x-2">
            <Input
              placeholder={labels.skillsPlaceholder}
              value={customSkill}
              onChange={(e) => setCustomSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomSkill()}
            />
            <Button onClick={addCustomSkill} variant="outline" size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {selectedSkills.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Selected skills:</p>
              <div className="flex flex-wrap gap-2">
                {selectedSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="pr-1 bg-blue-100 text-blue-800">
                    {skill}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSkill(skill)}
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200">
          <p className="text-sm text-gray-700">
            <strong>💡 Quick setup:</strong> Select 2-3 key interests and skills to get started. 
            You can always add more or update these later in your profile settings.
          </p>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default InterestsStep;
