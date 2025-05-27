
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface ExpertiseExperienceSectionProps {
  data: {
    expertiseAreas: string[];
    experience: string;
    credentials: string;
    previousVolunteering: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const ExpertiseExperienceSection = ({ data, onChange }: ExpertiseExperienceSectionProps) => {
  const expertiseOptions = [
    "Legal Services",
    "Financial Management",
    "Marketing & Communications",
    "Human Resources",
    "Technology & IT",
    "Grant Writing",
    "Strategic Planning",
    "Operations Management",
    "Fundraising",
    "Board Governance",
    "Program Evaluation",
    "Public Relations",
    "Design & Creative",
    "Data Analysis"
  ];

  return (
    <FormSection title="Expertise & Experience">
      <CheckboxGroup
        label="Areas of Expertise (Select all that apply)"
        options={expertiseOptions}
        selectedValues={data.expertiseAreas}
        onChange={(values) => onChange("expertiseAreas", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="experience">Years of Professional Experience *</Label>
        <Select onValueChange={(value) => onChange("experience", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select experience level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="4-7">4-7 years</SelectItem>
            <SelectItem value="8-15">8-15 years</SelectItem>
            <SelectItem value="15+">15+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="credentials">Relevant qualifications, certifications, or credentials *</Label>
        <Textarea
          id="credentials"
          value={data.credentials}
          onChange={(e) => onChange("credentials", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="previousVolunteering">Describe any previous volunteer or pro bono work experience *</Label>
        <Textarea
          id="previousVolunteering"
          value={data.previousVolunteering}
          onChange={(e) => onChange("previousVolunteering", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default ExpertiseExperienceSection;
