
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CSRInitiativesSectionProps {
  data: {
    currentCSRPrograms: string[];
    csrBudget: string;
    socialImpactGoals: string;
    communityInvolvement: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const CSRInitiativesSection = ({ data, onChange }: CSRInitiativesSectionProps) => {
  const csrProgramOptions = [
    "Employee volunteering",
    "Charitable donations",
    "Environmental sustainability",
    "Community partnerships",
    "Skills-based volunteering",
    "Disaster relief",
    "Education support",
    "Healthcare initiatives",
    "Local economic development",
    "Youth programs"
  ];

  const communityInvolvementOptions = [
    "Local charity partnerships",
    "Community event sponsorship",
    "Educational institution collaboration",
    "Environmental clean-up",
    "Mentorship programs",
    "Job training programs",
    "Local supplier support",
    "Community advisory boards",
    "Public-private partnerships",
    "Social enterprise support"
  ];

  return (
    <FormSection title="CSR & Social Impact">
      <CheckboxGroup
        label="What CSR programs does your company currently have? (Select all that apply)"
        options={csrProgramOptions}
        selectedValues={data.currentCSRPrograms}
        onChange={(values) => onChange("currentCSRPrograms", values)}
      />

      <div className="space-y-2">
        <Label htmlFor="csrBudget">What is your annual CSR/community investment budget? *</Label>
        <Textarea
          id="csrBudget"
          value={data.csrBudget}
          onChange={(e) => onChange("csrBudget", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="socialImpactGoals">What are your company's social impact goals? *</Label>
        <Textarea
          id="socialImpactGoals"
          value={data.socialImpactGoals}
          onChange={(e) => onChange("socialImpactGoals", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="How does your company currently engage with the community? (Select all that apply)"
        options={communityInvolvementOptions}
        selectedValues={data.communityInvolvement}
        onChange={(values) => onChange("communityInvolvement", values)}
      />
    </FormSection>
  );
};

export default CSRInitiativesSection;
