
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
    mostValuable: "",
    additionalComments: ""
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
            <Label htmlFor="name">What name would you like to use on SouLVE? *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="neighbourhood">Which neighbourhood or area do you live in? *</Label>
            <Input
              id="neighbourhood"
              value={formData.neighbourhood}
              onChange={(e) => handleInputChange("neighbourhood", e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>How did you hear about SouLVE? *</Label>
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
            <Label>What types of community activities interest you? (Select all that apply) *</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Local events",
                "Neighbourhood projects", 
                "Social gatherings",
                "Skill sharing",
                "Support groups",
                "Environmental projects",
                "Cultural activities",
                "Sports and fitness",
                "Educational workshops",
                "Volunteering opportunities"
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
            <Label>How connected do you feel to your local community? *</Label>
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
                "Advice or information",
                "Emergency support"
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

        {/* Help You Can Offer */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Help You Can Offer</h3>
          
          <div className="space-y-2">
            <Label>What types of help could you offer to others? (Select all that apply)</Label>
            <div className="grid grid-cols-1 gap-3">
              {[
                "Household tasks",
                "Transportation assistance",
                "Shopping or errands",
                "Technology help",
                "Childcare or pet sitting",
                "Companionship or conversation",
                "Professional advice",
                "Teaching or tutoring",
                "Emergency support"
              ].map((help) => (
                <div key={help} className="flex items-center space-x-2">
                  <Checkbox
                    id={help}
                    checked={formData.helpOffered.includes(help)}
                    onCheckedChange={(checked) => handleCheckboxChange("helpOffered", help, checked as boolean)}
                  />
                  <Label htmlFor={help}>{help}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skills">What skills or expertise do you have that might be helpful to others?</Label>
            <Textarea
              id="skills"
              value={formData.skills}
              onChange={(e) => handleInputChange("skills", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>How much time per month could you dedicate to helping others?</Label>
            <Select onValueChange={(value) => handleInputChange("timeAvailable", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select time availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-3-hours">1-3 hours per month</SelectItem>
                <SelectItem value="4-8-hours">4-8 hours per month</SelectItem>
                <SelectItem value="9-15-hours">9-15 hours per month</SelectItem>
                <SelectItem value="15+-hours">15+ hours per month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform Features */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Platform Features</h3>
          
          <div className="space-y-2">
            <Label>How would you prefer to be notified about help requests or opportunities?</Label>
            <Select onValueChange={(value) => handleInputChange("notificationPreference", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select notification preference" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="immediate">Immediate notifications</SelectItem>
                <SelectItem value="daily">Daily digest</SelectItem>
                <SelectItem value="weekly">Weekly summary</SelectItem>
                <SelectItem value="manual">I'll check manually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>When are you typically available to help?</Label>
            <Select onValueChange={(value) => handleInputChange("helpTiming", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekday-mornings">Weekday mornings</SelectItem>
                <SelectItem value="weekday-afternoons">Weekday afternoons</SelectItem>
                <SelectItem value="weekday-evenings">Weekday evenings</SelectItem>
                <SelectItem value="weekends">Weekends</SelectItem>
                <SelectItem value="flexible">Flexible/varies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>How important is identity verification for people offering help?</Label>
            <Select onValueChange={(value) => handleInputChange("verificationImportance", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select importance level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="extremely-important">Extremely important</SelectItem>
                <SelectItem value="very-important">Very important</SelectItem>
                <SelectItem value="somewhat-important">Somewhat important</SelectItem>
                <SelectItem value="not-important">Not particularly important</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Would you be willing to go through identity verification yourself?</Label>
            <Select onValueChange={(value) => handleInputChange("identityVerification", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select willingness" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="yes-immediately">Yes, immediately</SelectItem>
                <SelectItem value="yes-eventually">Yes, but not right away</SelectItem>
                <SelectItem value="maybe">Maybe, depending on requirements</SelectItem>
                <SelectItem value="no">No, I prefer to remain anonymous</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Platform Usage */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">Platform Usage</h3>
          
          <div className="space-y-2">
            <Label>How do you think you'd primarily use SouLVE?</Label>
            <Select onValueChange={(value) => handleInputChange("platformUsage", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary usage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mainly-receiving">Mainly receiving help</SelectItem>
                <SelectItem value="mainly-giving">Mainly giving help</SelectItem>
                <SelectItem value="equal-both">Equal mix of both</SelectItem>
                <SelectItem value="community-connection">Mainly for community connection</SelectItem>
                <SelectItem value="not-sure">Not sure yet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Which features would interest you most? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Help requests and offers",
                "Community events",
                "Local recommendations",
                "Skill sharing",
                "Social networking",
                "Local news and updates",
                "Group discussions",
                "Resource sharing"
              ].map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.interestedFeatures.includes(feature)}
                    onCheckedChange={(checked) => handleCheckboxChange("interestedFeatures", feature, checked as boolean)}
                  />
                  <Label htmlFor={feature}>{feature}</Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="encouragement">What would encourage you to be more active in helping others in your community?</Label>
            <Textarea
              id="encouragement"
              value={formData.encouragement}
              onChange={(e) => handleInputChange("encouragement", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="concerns">Do you have any concerns about using a community help platform?</Label>
            <Textarea
              id="concerns"
              value={formData.concerns}
              onChange={(e) => handleInputChange("concerns", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mostValuable">What would be the most valuable aspect of SouLVE for you?</Label>
            <Textarea
              id="mostValuable"
              value={formData.mostValuable}
              onChange={(e) => handleInputChange("mostValuable", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalComments">Any additional comments or suggestions?</Label>
            <Textarea
              id="additionalComments"
              value={formData.additionalComments}
              onChange={(e) => handleInputChange("additionalComments", e.target.value)}
            />
          </div>
        </div>

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
