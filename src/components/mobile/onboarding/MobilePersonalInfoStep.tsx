
import { useState } from "react";
import { User, Mail, MapPin, ChevronRight, ChevronLeft, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MobilePersonalInfoStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  userType?: string;
}

const MobilePersonalInfoStep = ({ onNext, onPrevious, currentStep, totalSteps, userType = "individual" }: MobilePersonalInfoStepProps) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    organizationName: "",
    industry: "",
    role: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    onNext({ personalInfo: formData });
  };

  const getValidationRules = () => {
    const base = Boolean(formData.email && formData.location);
    
    switch (userType) {
      case "charity":
      case "business":
      case "community_group":
      case "religious_group":
      case "other_organization":
        return base && Boolean(formData.organizationName);
      default:
        return base && Boolean(formData.firstName && formData.lastName);
    }
  };

  const isFormValid = getValidationRules();

  const getFieldsForUserType = () => {
    const isOrganization = ["charity", "business", "community_group", "religious_group", "other_organization"].includes(userType);
    
    if (isOrganization) {
      return {
        showPersonalName: true,
        showOrganizationName: true,
        showIndustry: userType === "business",
        showRole: true,
        organizationLabel: userType === "business" ? "Company Name" : 
                         userType === "charity" ? "Organization Name" :
                         userType === "religious_group" ? "Organization Name" : "Group Name"
      };
    }
    
    return {
      showPersonalName: true,
      showOrganizationName: false,
      showIndustry: false,
      showRole: false
    };
  };

  const fields = getFieldsForUserType();

  const industries = [
    "Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing",
    "Non-profit", "Government", "Real Estate", "Entertainment", "Food & Beverage",
    "Transportation", "Energy", "Construction", "Professional Services", "Other"
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-xl font-bold text-gray-900">
          {userType === "individual" ? "Tell us about yourself" : "Tell us about your organization"}
        </h1>
        <p className="text-sm text-gray-600">
          {userType === "individual" 
            ? "Your basic info helps us create a safe, trusted community"
            : "Help us understand your organization so we can connect you with the right partners"
          }
        </p>
      </div>

      <div className="space-y-4">
        {fields.showOrganizationName && (
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-sm font-medium text-gray-700 flex items-center">
              <Building2 className="h-4 w-4 mr-1" />
              {fields.organizationLabel}
            </Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleInputChange("organizationName", e.target.value)}
              placeholder={`Enter your ${fields.organizationLabel?.toLowerCase()}`}
              className="text-sm"
              required
            />
          </div>
        )}

        {fields.showPersonalName && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-1" />
                {userType === "individual" ? "First Name" : "Your First Name"}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="John"
                className="text-sm"
                required={userType === "individual"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                {userType === "individual" ? "Last Name" : "Your Last Name"}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Doe"
                className="text-sm"
                required={userType === "individual"}
              />
            </div>
          </div>
        )}

        {fields.showRole && (
          <div className="space-y-2">
            <Label htmlFor="role" className="text-sm font-medium text-gray-700">
              Your Role
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              placeholder="e.g., Director, Manager, Volunteer Coordinator"
              className="text-sm"
            />
          </div>
        )}

        {fields.showIndustry && (
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium text-gray-700">
              Industry
            </Label>
            <Select onValueChange={(value) => handleInputChange("industry", value)}>
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Select your industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry.toLowerCase()}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

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
            {userType === "individual" 
              ? "City and state/country help us find local opportunities"
              : "This helps us connect you with local community members and opportunities"
            }
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
