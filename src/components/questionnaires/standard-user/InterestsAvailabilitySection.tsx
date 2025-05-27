
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface InterestsAvailabilitySectionProps {
  data: {
    interests: string[];
    timeAvailability: string;
    volunteerMotivation: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const InterestsAvailabilitySection = ({ data, onChange }: InterestsAvailabilitySectionProps) => {
  const interestOptions = [
    "Environment",
    "Education",
    "Health & Wellness",
    "Community Development",
    "Arts & Culture",
    "Youth Programs",
    "Senior Support",
    "Animal Welfare",
    "Crisis Support",
    "Technology for Good"
  ];

  return (
    <FormSection title="Interests & Availability">
      <CheckboxGroup
        label="What areas are you most interested in supporting? (Select all that apply)"
        options={interestOptions}
        selectedValues={data.interests}
        onChange={(values) => onChange("interests", values)}
        required
      />

      <div className="space-y-2">
        <Label>How much time can you typically dedicate to helping others per month? *</Label>
        <Select onValueChange={(value) => onChange("timeAvailability", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select time availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-5-hours">1-5 hours</SelectItem>
            <SelectItem value="6-10-hours">6-10 hours</SelectItem>
            <SelectItem value="11-20-hours">11-20 hours</SelectItem>
            <SelectItem value="20+-hours">20+ hours</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>What motivates you to volunteer? *</Label>
        <Select onValueChange={(value) => onChange("volunteerMotivation", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select motivation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="make-difference">Making a difference in my community</SelectItem>
            <SelectItem value="personal-growth">Personal growth and learning</SelectItem>
            <SelectItem value="meet-people">Meeting like-minded people</SelectItem>
            <SelectItem value="give-back">Giving back to society</SelectItem>
            <SelectItem value="develop-skills">Developing new skills</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FormSection>
  );
};

export default InterestsAvailabilitySection;
