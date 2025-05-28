
import { User } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserTypeSectionProps {
  userType: string;
  setUserType: (value: string) => void;
}

const UserTypeSection = ({ userType, setUserType }: UserTypeSectionProps) => {
  const userTypeOptions = [
    { value: "standard", label: "Standard User" },
    { value: "charity", label: "Charity" },
    { value: "community-group", label: "Community Group" },
    { value: "religious-group", label: "Religious Group" },
    { value: "business", label: "Business" },
    { value: "social-group", label: "Social Group" },
    { value: "ambassador", label: "Ambassador" },
    { value: "partnerships", label: "Partnerships" },
    { value: "expertise", label: "Expertise" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 rounded-full bg-gradient-to-r from-teal-500 to-blue-500">
          <User className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-semibold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">User Type</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="userType" className="text-gray-700">What best describes you or your organization?</Label>
        <Select onValueChange={setUserType} required>
          <SelectTrigger className="border-teal-300 focus:border-teal-500 focus:ring-teal-200">
            <SelectValue placeholder="Select your user type" />
          </SelectTrigger>
          <SelectContent>
            {userTypeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default UserTypeSection;
