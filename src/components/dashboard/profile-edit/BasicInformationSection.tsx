
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "../UserProfileTypes";

interface BasicInformationSectionProps {
  editData: UserProfileData;
  onInputChange: (field: keyof UserProfileData, value: string) => void;
}

const BasicInformationSection = ({ 
  editData, 
  onInputChange 
}: BasicInformationSectionProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name / Organization Name</Label>
          <Input
            id="name"
            value={editData.name}
            onChange={(e) => onInputChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={editData.email}
            onChange={(e) => onInputChange("email", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={editData.phone}
            onChange={(e) => onInputChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={editData.location}
            onChange={(e) => onInputChange("location", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2 mt-4">
        <Label htmlFor="bio">Bio / About</Label>
        <Textarea
          id="bio"
          value={editData.bio}
          onChange={(e) => onInputChange("bio", e.target.value)}
          rows={4}
          placeholder="Tell others about yourself or your organization..."
        />
      </div>
    </div>
  );
};

export default BasicInformationSection;
