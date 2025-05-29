
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserProfileData } from "../UserProfileTypes";

interface SkillsInterestsSectionProps {
  editData: UserProfileData;
  onSkillsChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
}

const SkillsInterestsSection = ({ 
  editData, 
  onSkillsChange, 
  onInterestsChange 
}: SkillsInterestsSectionProps) => {
  return (
    <div>
      <h4 className="text-lg font-semibold mb-4">Skills & Interests</h4>
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
    </div>
  );
};

export default SkillsInterestsSection;
