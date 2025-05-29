
import { useState } from "react";
import { User, Mail, MapPin, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import RegistrationStep from "../RegistrationStep";

interface PersonalInfoStepProps {
  onNext: () => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const PersonalInfoStep = ({ onNext, onPrevious, currentStep, totalSteps }: PersonalInfoStepProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = Boolean(formData.firstName && formData.lastName && formData.email && formData.location);

  const platformInsight = {
    title: "Trust & Safety",
    description: "Your personal information helps us create a safe environment. We use location to connect you with nearby opportunities, and your real name builds trust in our community. All data is encrypted and never shared without permission.",
    icon: <Shield className="h-6 w-6 text-teal-600" />
  };

  return (
    <RegistrationStep
      title="Tell us about yourself"
      subtitle="Your basic information helps us create a personalized experience and connect you with relevant opportunities."
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={onNext}
      onPrevious={onPrevious}
      isNextEnabled={isFormValid}
      platformInsight={platformInsight}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-gray-700 flex items-center">
              <User className="h-4 w-4 mr-2" />
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              placeholder="Enter your first name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              placeholder="Enter your last name"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-700 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
            placeholder="City, State/Country"
            required
          />
          <p className="text-xs text-gray-500">
            We use this to show you local opportunities and connect you with nearby helpers.
          </p>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default PersonalInfoStep;
