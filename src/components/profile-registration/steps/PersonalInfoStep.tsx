
import { useState } from "react";
import { User, Mail, MapPin, Building2, Shield } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import RegistrationStep from "../RegistrationStep";

interface PersonalInfoStepProps {
  onNext: (data?: any) => void;
  onPrevious: () => void;
  currentStep: number;
  totalSteps: number;
  userType?: string;
}

const PersonalInfoStep = ({ onNext, onPrevious, currentStep, totalSteps, userType = "individual" }: PersonalInfoStepProps) => {
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

  const platformInsight = {
    title: "Building Trust",
    description: userType === "individual" 
      ? "Your personal information helps us create a safe environment. We use location to connect you with nearby opportunities, and your real name builds trust in our community."
      : "Organization details help community members understand who you are and build trust. This information helps us connect you with relevant partners and opportunities.",
    icon: <Shield className="h-6 w-6 text-teal-600" />
  };

  const industries = [
    "Technology", "Healthcare", "Education", "Finance", "Retail", "Manufacturing",
    "Non-profit", "Government", "Real Estate", "Entertainment", "Food & Beverage",
    "Transportation", "Energy", "Construction", "Professional Services", "Other"
  ];

  return (
    <RegistrationStep
      title={userType === "individual" ? "Tell us about yourself" : "Tell us about your organization"}
      subtitle={userType === "individual" 
        ? "Your basic information helps us create a personalized experience and connect you with relevant opportunities."
        : "Help us understand your organization so we can connect you with the right community partners and opportunities."
      }
      currentStep={currentStep}
      totalSteps={totalSteps}
      onNext={handleNext}
      onPrevious={onPrevious}
      isNextEnabled={isFormValid}
      platformInsight={platformInsight}
    >
      <div className="space-y-6">
        {fields.showOrganizationName && (
          <div className="space-y-2">
            <Label htmlFor="organizationName" className="text-gray-700 flex items-center">
              <Building2 className="h-4 w-4 mr-2" />
              {fields.organizationLabel}
            </Label>
            <Input
              id="organizationName"
              value={formData.organizationName}
              onChange={(e) => handleInputChange("organizationName", e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              placeholder={`Enter your ${fields.organizationLabel?.toLowerCase()}`}
              required
            />
          </div>
        )}

        {fields.showPersonalName && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-gray-700 flex items-center">
                <User className="h-4 w-4 mr-2" />
                {userType === "individual" ? "First Name" : "Your First Name"}
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                placeholder="Enter your first name"
                required={userType === "individual"}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-gray-700">
                {userType === "individual" ? "Last Name" : "Your Last Name"}
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                placeholder="Enter your last name"
                required={userType === "individual"}
              />
            </div>
          </div>
        )}

        {fields.showRole && (
          <div className="space-y-2">
            <Label htmlFor="role" className="text-gray-700">
              Your Role
            </Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => handleInputChange("role", e.target.value)}
              className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
              placeholder="e.g., Director, Manager, Volunteer Coordinator"
            />
          </div>
        )}

        {fields.showIndustry && (
          <div className="space-y-2">
            <Label htmlFor="industry" className="text-gray-700">
              Industry
            </Label>
            <Select onValueChange={(value) => handleInputChange("industry", value)}>
              <SelectTrigger className="border-gray-300 focus:border-teal-500">
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
            {userType === "individual" 
              ? "We use this to show you local opportunities and connect you with nearby helpers."
              : "This helps us connect you with local community members and relevant opportunities."
            }
          </p>
        </div>
      </div>
    </RegistrationStep>
  );
};

export default PersonalInfoStep;
