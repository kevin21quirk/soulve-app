
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
    name: "",
    neighbourhood: "",
    howHeard: "",
    howHeardOther: "",
    interests: [],
    communityConnection: "",
    helpNeeded: [],
    helpNeededOther: "",
    helpFrequency: "",
    helpPreference: "",
    helpOffered: [],
    helpOfferedOther: "",
    skills: "",
    timeAvailable: "",
    notificationPreference: "",
    helpTiming: "",
    verificationImportance: "",
    identityVerification: "",
    platformUsage: "",
    interestedFeatures: [],
    encouragement: "",
    concerns: "",
    mostValuable: ""
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (field: string, value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked 
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Standard User Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Standard User Questionnaire"
      description="Help us personalise your SouLVE experience and connect you with the right community support"
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">What name would you like to use on SouLVE?</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighbourhood">Which neighbourhood or area do you live in?</Label>
            <Input
              id="neighbourhood"
              value={formData.neighbourhood}
              onChange={(e) => handleInputChange("neighbourhood", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>How did you hear about SouLVE?</Label>
            <Select onValueChange={(value) => handleInputChange("howHeard", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="friend-family">Friend or family</SelectItem>
                <SelectItem value="social-media">Social media</SelectItem>
                <SelectItem value="community-event">Community event</SelectItem>
                <SelectItem value="local-organisation">Local organisation</SelectItem>
                <SelectItem value="online-search">Online search</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {formData.howHeard === "other" && (
              <Input
                placeholder="Please specify"
                value={formData.howHeardOther}
                onChange={(e) => handleInputChange("howHeardOther", e.target.value)}
              />
            )}
          </div>
        </div>

        {/* Your Interests */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Your Interests</h3>
          
          <div className="space-y-2">
            <Label>What types of community activities interest you? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Local events",
                "Neighbourhood projects", 
                "Social gatherings",
                "Skill sharing",
                "Support groups"
              ].map((interest) => (
                <div key={interest} className="flex items-center space-x-2">
                  <Checkbox
                    id={interest}
                    checked={formData.interests.includes(interest)}
                    onCheckedChange={(checked) => handleCheckboxChange("interests", interest, checked as boolean)}
                  />
                  <Label htmlFor={interest}>{interest}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>How connected do you feel to your local community?</Label>
            <Select onValueChange={(value) => handleInputChange("communityConnection", value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="very-connected">Very connected</SelectItem>
                <SelectItem value="somewhat-connected">Somewhat connected</SelectItem>
                <SelectItem value="not-very-connected">Not very connected</SelectItem>
                <SelectItem value="not-connected">Not connected at all</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Help You Might Need */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Help You Might Need</h3>
          
          <div className="space-y-2">
            <Label>What types of help might you need occasionally? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Household tasks (moving furniture, repairs, etc.)",
                "Transportation assistance",
                "Shopping or errands",
                "Technology help",
                "Childcare or pet sitting",
                "Companionship or conversation",
                "Advice or information"
              ].map((help) => (
                <div key={help} className="flex items-center space-x-2">
                  <Checkbox
                    id={help}
                    checked={formData.helpNeeded.includes(help)}
                    onCheckedChange={(checked) => handleCheckboxChange("helpNeeded", help, checked as boolean)}
                  />
                  <Label htmlFor={help}>{help}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>How often do you think you might need help with these things?</Label>
            <Select onValueChange={(value) => handleInputChange("helpFrequency", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rarely">Rarely (a few times a year)</SelectItem>
                <SelectItem value="occasionally">Occasionally (monthly)</SelectItem>
                <SelectItem value="regularly">Regularly (weekly)</SelectItem>
                <SelectItem value="often">Often (multiple times per week)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Would you prefer to get help from:</Label>
            <Select onValueChange={(value) => handleInputChange("helpPreference", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="people-i-know">People you already know</SelectItem>
                <SelectItem value="verified-neighbours">Verified neighbours you haven't met yet</SelectItem>
                <SelectItem value="community-organisations">Community organisations</SelectItem>
                <SelectItem value="anyone">Anyone who can help</SelectItem>
                <SelectItem value="depends">It depends on the type of help</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Additional sections would continue here following the same pattern */}

        <div className="text-center pt-6">
          <Button
            type="submit"
            size="lg"
            className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-12 py-4 text-lg font-semibold rounded-xl"
          >
            Submit Questionnaire
          </Button>
        </div>
      </form>
    </QuestionnaireLayout>
  );
};

export default StandardUserQuestionnaire;
