
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SkillsInterestsSectionProps {
  formData: {
    skills: string;
    interests: string;
    availability: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

const SkillsInterestsSection = ({ formData, handleInputChange }: SkillsInterestsSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-4">
        <Heart className="h-6 w-6 text-teal-600" />
        <h3 className="text-xl font-semibold text-gray-900">Your Skills & Interests</h3>
      </div>

      <div className="space-y-2">
        <Label htmlFor="skills" className="text-gray-700">Skills & Expertise</Label>
        <Textarea
          id="skills"
          value={formData.skills}
          onChange={(e) => handleInputChange("skills", e.target.value)}
          className="border-gray-300 focus:border-teal-500 min-h-[100px]"
          placeholder="e.g., Teaching, Construction, Cooking, Technology, Healthcare, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="interests" className="text-gray-700">Areas of Interest</Label>
        <Textarea
          id="interests"
          value={formData.interests}
          onChange={(e) => handleInputChange("interests", e.target.value)}
          className="border-gray-300 focus:border-teal-500 min-h-[100px]"
          placeholder="e.g., Education, Environmental causes, Senior care, Youth mentoring, etc."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability" className="text-gray-700">Availability</Label>
        <Select onValueChange={(value) => handleInputChange("availability", value)}>
          <SelectTrigger className="border-gray-300 focus:border-teal-500">
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekends">Weekends only</SelectItem>
            <SelectItem value="evenings">Evenings after work</SelectItem>
            <SelectItem value="flexible">Flexible schedule</SelectItem>
            <SelectItem value="few-hours">A few hours per week</SelectItem>
            <SelectItem value="several-hours">Several hours per week</SelectItem>
            <SelectItem value="as-needed">As needed basis</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default SkillsInterestsSection;
