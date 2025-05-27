
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface AvailabilityPreferencesSectionProps {
  data: {
    availabilityType: string;
    consultingAreas: string[];
    timeCommitment: string;
    workingStyle: string;
    motivations: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const AvailabilityPreferencesSection = ({ data, onChange }: AvailabilityPreferencesSectionProps) => {
  const consultingOptions = [
    "Organizational development",
    "Financial planning and management",
    "Marketing and branding",
    "Technology implementation",
    "Legal compliance",
    "Fundraising strategies",
    "Program development",
    "Staff training and development",
    "Board development",
    "Crisis management"
  ];

  return (
    <FormSection title="Availability & Working Preferences">
      <div className="space-y-2">
        <Label htmlFor="availabilityType">What type of support can you provide? *</Label>
        <Select onValueChange={(value) => onChange("availabilityType", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select availability type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="one-off-consultations">One-off consultations</SelectItem>
            <SelectItem value="short-term-projects">Short-term projects (1-3 months)</SelectItem>
            <SelectItem value="ongoing-mentoring">Ongoing mentoring/advisory</SelectItem>
            <SelectItem value="emergency-support">Emergency/crisis support</SelectItem>
            <SelectItem value="all-types">All of the above</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CheckboxGroup
        label="In which areas would you be most interested in providing consulting? (Select all that apply)"
        options={consultingOptions}
        selectedValues={data.consultingAreas}
        onChange={(values) => onChange("consultingAreas", values)}
      />

      <div className="space-y-2">
        <Label>How much time per month can you typically dedicate to volunteer consulting? *</Label>
        <Select onValueChange={(value) => onChange("timeCommitment", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select time commitment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-5-hours">1-5 hours per month</SelectItem>
            <SelectItem value="6-10-hours">6-10 hours per month</SelectItem>
            <SelectItem value="11-20-hours">11-20 hours per month</SelectItem>
            <SelectItem value="20+-hours">20+ hours per month</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>What is your preferred working style? *</Label>
        <Select onValueChange={(value) => onChange("workingStyle", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select working style" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="remote-only">Remote only</SelectItem>
            <SelectItem value="in-person-only">In-person only</SelectItem>
            <SelectItem value="hybrid">Hybrid (both remote and in-person)</SelectItem>
            <SelectItem value="flexible">Flexible, depending on the project</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="motivations">What motivates you to volunteer your professional expertise? *</Label>
        <Textarea
          id="motivations"
          value={data.motivations}
          onChange={(e) => onChange("motivations", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default AvailabilityPreferencesSection;
