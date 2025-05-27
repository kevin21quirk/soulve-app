
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
    expertiseAreas: [],
    experience: "",
    credentials: "",
    availabilityType: "",
    consultingAreas: [],
    platformFeatures: {},
    contentInterest: "",
    supportNeeds: [],
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
                "Public Relations"
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
