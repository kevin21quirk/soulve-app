
import { useState } from "react";
import { User, Mail, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MobilePersonalInfoStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
}

const MobilePersonalInfoStep = ({ onNext, onPrevious, currentStep, totalSteps }: MobilePersonalInfoStepProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onNext({ personalInfo: formData });
  };

  const isFormValid = Boolean(
    formData.firstName && 
    formData.lastName && 
    formData.email && 
    formData.location
  );

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-900">Tell us about yourself</h1>
        <p className="text-sm text-gray-600">
          Your basic info helps us create a safe, trusted community
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
              <User className="h-4 w-4 mr-1" />
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="John"
              className="text-sm"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Doe"
              className="text-sm"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            placeholder="john@example.com"
            className="text-sm"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location" className="text-sm font-medium text-gray-700 flex items-center">
            <MapPin className="h-4 w-4 mr-1" />
            Location
          </Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleInputChange("location", e.target.value)}
            placeholder="San Francisco, CA"
            className="text-sm"
            required
          />
          <p className="text-xs text-gray-500">
            City and state/country help us find local opportunities
          </p>
        </div>
      </div>

      {/* Privacy Notice */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-800">
          <strong>🔒 Privacy First:</strong> Your information is encrypted and never shared without your permission. You control what others can see in your privacy settings.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          onClick={onPrevious}
          className="flex-1 h-12"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFormValid}
          className="flex-1 bg-teal-600 hover:bg-teal-700 h-12"
        >
          Continue
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default MobilePersonalInfoStep;
