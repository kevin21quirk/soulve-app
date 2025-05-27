
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileEditFormProps {
  editData: UserProfileData;
  onInputChange: (field: keyof UserProfileData, value: string) => void;
  onSkillsChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
}

const UserProfileEditForm = ({ 
  editData, 
  onInputChange, 
  onSkillsChange, 
  onInterestsChange 
}: UserProfileEditFormProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
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

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={editData.bio}
          onChange={(e) => onInputChange("bio", e.target.value)}
          rows={4}
          placeholder="Tell others about yourself..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="skills">Skills (comma-separated)</Label>
          <Input
            id="skills"
            value={editData.skills.join(', ')}
            onChange={(e) => onSkillsChange(e.target.value)}
            placeholder="e.g., Moving Help, Tutoring, Pet Care"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="interests">Interests (comma-separated)</Label>
          <Input
            id="interests"
            value={editData.interests.join(', ')}
            onChange={(e) => onInterestsChange(e.target.value)}
            placeholder="e.g., Community Service, Technology"
          />
        </div>
      </div>
    </>
  );
};

export default UserProfileEditForm;
