
import { User, Mail, MapPin } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PersonalInfoSectionProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

const PersonalInfoSection = ({ formData, handleInputChange }: PersonalInfoSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <User className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold text-gray-900">Personal Information</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-gray-700">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            className="border-gray-300 focus:border-teal-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-gray-700">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            className="border-gray-300 focus:border-teal-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            className="border-gray-300 focus:border-teal-500"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            className="border-gray-300 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location" className="text-gray-700 flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          Location (City, State)
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleInputChange("location", e.target.value)}
          className="border-gray-300 focus:border-teal-500"
          placeholder="e.g., San Francisco, CA"
          required
        />
      </div>
    </div>
  );
};

export default PersonalInfoSection;
