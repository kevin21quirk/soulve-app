
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import QuestionnaireLayout from "./QuestionnaireLayout";

const BusinessQuestionnaire = () => {
  const [formData, setFormData] = useState({
    email: "",
    businessName: "",
    industry: "",
    businessSize: "",
    csrPrograms: [],
    communityInvolvement: [],
    partnershipGoals: [],
    platformFeatures: {},
    investmentInterest: "",
    supportNeeds: [],
    contactName: "",
    contactPosition: "",
    contactEmail: "",
    contactPhone: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Business Questionnaire data:", formData);
  };

  return (
    <QuestionnaireLayout 
      title="Business Partnership Registration"
      description="Help us understand how your business can partner with SouLVE to create positive community impact"
    >
      <div className="prose max-w-none mb-8">
        <h4 className="text-lg font-semibold mb-4">Welcome to SouLVE</h4>
        <p className="text-gray-600 mb-4">
          We're building a social impact platform that combines social networking with verified community support and integrated crowdfunding.
        </p>
        <p className="text-gray-600 mb-6">
          Our platform offers businesses unique opportunities to demonstrate genuine community commitment, engage employees in meaningful CSR activities, and measure real social impact.
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
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) => setFormData(prev => ({ ...prev, businessName: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>What CSR or community programs does your business currently support? (Select all that apply)</Label>
            <div className="grid grid-cols-2 gap-3">
              {[
                "Employee Volunteering",
                "Local Sponsorships",
                "Environmental Initiatives",
                "Education Programs",
                "Community Events",
                "Charitable Donations",
                "Skills-based Volunteering",
                "Disaster Relief",
                "Youth Development",
                "Health & Wellness"
              ].map((program) => (
                <div key={program} className="flex items-center space-x-2">
                  <Checkbox
                    id={program}
                    checked={formData.csrPrograms.includes(program)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData(prev => ({ ...prev, csrPrograms: [...prev.csrPrograms, program] }));
                      } else {
                        setFormData(prev => ({ ...prev, csrPrograms: prev.csrPrograms.filter(item => item !== program) }));
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

export default BusinessQuestionnaire;
