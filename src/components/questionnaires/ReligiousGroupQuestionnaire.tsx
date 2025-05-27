
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
    communityPrograms: [],
    outreachActivities: [],
    volunteerManagement: "",
    communicationMethods: [],
    platformFeatures: {},
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
                "Healthcare Support"
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
