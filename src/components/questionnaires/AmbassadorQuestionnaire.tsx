
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
    platformFeatures: {},
    trainingInterest: "",
    supportNeeds: [],
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
                "Neighbourhood Groups"
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
