
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface PartnershipInterestSectionProps {
  data: {
    howHeard: string;
    missionAlignment: string[];
    partnershipType: string[];
    objectives: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const PartnershipInterestSection = ({ data, onChange }: PartnershipInterestSectionProps) => {
  const missionAlignmentOptions = [
    "Community strengthening",
    "Trust and verification solutions",
    "Local impact measurement",
    "Volunteer mobilisation",
    "Donation/fundraising capabilities"
  ];

  const partnershipTypeOptions = [
    "Commercial integration",
    "Co-marketing opportunities",
    "Technology collaboration",
    "CSR/community impact initiatives",
    "Sponsorship"
  ];

  return (
    <FormSection title="Partnership Interest">
      <div className="space-y-2">
        <Label htmlFor="howHeard">How did you hear about SouLVE? *</Label>
        <Input
          id="howHeard"
          value={data.howHeard}
          onChange={(e) => onChange("howHeard", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="What aspects of SouLVE's mission most align with your organisation's goals? (Select all that apply)"
        options={missionAlignmentOptions}
        selectedValues={data.missionAlignment}
        onChange={(values) => onChange("missionAlignment", values)}
      />

      <CheckboxGroup
        label="What type of partnership are you most interested in? (Select all that apply)"
        options={partnershipTypeOptions}
        selectedValues={data.partnershipType}
        onChange={(values) => onChange("partnershipType", values)}
      />

      <div className="space-y-2">
        <Label htmlFor="objectives">What specific objectives would you hope to achieve through this partnership? *</Label>
        <Textarea
          id="objectives"
          value={data.objectives}
          onChange={(e) => onChange("objectives", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default PartnershipInterestSection;
