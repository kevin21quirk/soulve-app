
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface OperationsNeedsSectionProps {
  data: {
    currentChallenges: string[];
    volunteerManagement: string;
    successMeasurement: string;
    partnershipNeeds: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const OperationsNeedsSection = ({ data, onChange }: OperationsNeedsSectionProps) => {
  const challengeOptions = [
    "Volunteer recruitment",
    "Volunteer retention",
    "Funding shortfalls",
    "Awareness building",
    "Operations coordination",
    "Impact measurement",
    "Technology adoption",
    "Donor engagement"
  ];

  const partnershipOptions = [
    "Corporate sponsorship",
    "Government partnerships",
    "Other charity collaborations",
    "Community group alliances",
    "Academic partnerships",
    "Media partnerships",
    "Technology partnerships",
    "International partnerships"
  ];

  return (
    <FormSection title="Operations & Needs">
      <CheckboxGroup
        label="What are your biggest operational challenges? (Select all that apply)"
        options={challengeOptions}
        selectedValues={data.currentChallenges}
        onChange={(values) => onChange("currentChallenges", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="volunteerManagement">How do you currently manage volunteers? *</Label>
        <Textarea
          id="volunteerManagement"
          value={data.volunteerManagement}
          onChange={(e) => onChange("volunteerManagement", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successMeasurement">How do you measure success and impact? *</Label>
        <Textarea
          id="successMeasurement"
          value={data.successMeasurement}
          onChange={(e) => onChange("successMeasurement", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="What types of partnerships would benefit your charity? (Select all that apply)"
        options={partnershipOptions}
        selectedValues={data.partnershipNeeds}
        onChange={(values) => onChange("partnershipNeeds", values)}
      />
    </FormSection>
  );
};

export default OperationsNeedsSection;
