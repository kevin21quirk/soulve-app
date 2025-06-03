
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
}

const InterestsStep = ({ onNext, onPrevious, currentStep, totalSteps }: InterestsStepProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customInterest, setCustomInterest] = useState("");
  const [customSkill, setCustomSkill] = useState("");

  const predefinedInterests = [
    "Community Building", "Education", "Environmental Protection", "Healthcare",
    "Senior Care", "Youth Mentoring", "Animal Welfare", "Food Security",
    "Homelessness", "Mental Health", "Disability Support", "Disaster Relief",
    "Arts & Culture", "Technology for Good", "Financial Literacy", "Job Training",
    "Language Learning", "Sustainable Living", "Social Justice", "Emergency Response"
  ];

  const predefinedSkills = [
    "Teaching", "Counseling", "Construction", "Cooking", "Technology Support",
    "Medical Care", "Legal Advice", "Transportation", "Childcare", "Elder Care",
    "Event Planning", "Fundraising", "Marketing", "Writing", "Translation",
    "Photography", "Graphic Design", "Financial Planning", "Home Repair", "Gardening",
    "Music", "Sports Coaching", "Public Speaking", "Research", "Project Management"
  ];

  const supportTypes = [
    "Emotional Support", "Practical Help", "Professional Guidance", "Emergency Assistance",
    "Skill Sharing", "Resource Sharing", "Mentorship", "Advocacy", "Crisis Support"
  ];

  const helpOffers = [
    "One-time Help", "Ongoing Support", "Skills Training", "Resource Provision",
    "Emotional Listening", "Professional Services", "Emergency Response", "Mentoring"
  ];

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
      skills: selectedSkills,
      supportTypes,
      helpOffers
    });
  };

  const isFormValid = selectedInterests.length > 0 || selectedSkills.length > 0;

  const platformInsight = {
    title: "Smart Matching",
    description: "Your interests and skills help us connect you with the right opportunities and people. Our algorithm considers your preferences, location, and availability to suggest meaningful ways to help and get help.",
    icon: <Heart className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Your Interests & Skills"
      subtitle="Help us understand what matters to you and what you're good at so we can connect you with the perfect opportunities."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={onPrevious}
      isNextEnabled={isFormValid}
      platformInsight={platformInsight}
    >
      <div className="space-y-8">
        {/* Interests Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-teal-600" />
            <h3 className="text-lg font-semibold">What causes do you care about?</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {predefinedInterests.map((interest) => (
              <Button
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleInterest(interest)}
                className={`h-auto py-2 px-3 text-left justify-start ${
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
              placeholder="Add a custom interest..."
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
            <h3 className="text-lg font-semibold">What skills can you offer?</h3>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {predefinedSkills.map((skill) => (
              <Button
                key={skill}
                variant={selectedSkills.includes(skill) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleSkill(skill)}
                className={`h-auto py-2 px-3 text-left justify-start ${
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
              placeholder="Add a custom skill..."
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
            <strong>💡 Pro tip:</strong> Don't worry about being perfect! You can always update your interests and skills later. 
            Start with what feels right now - the platform learns and adapts to help you discover new ways to contribute.
          </p>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default InterestsStep;
