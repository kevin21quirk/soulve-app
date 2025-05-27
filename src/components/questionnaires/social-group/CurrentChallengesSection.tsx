
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CurrentChallengesSectionProps {
  data: {
    operationalChallenges: string[];
    helperMatching: string;
    verificationTraining: string;
    impactMeasurement: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const CurrentChallengesSection = ({ data, onChange }: CurrentChallengesSectionProps) => {
  const challenges = [
    "Volunteer recruitment",
    "Resource acquisition",
    "Client outreach",
    "Coordination",
    "Funding"
  ];

  return (
    <FormSection title="Current Challenges">
      <CheckboxGroup
        label="What are your biggest operational challenges? (Tick all that apply)"
        options={challenges}
        selectedValues={data.operationalChallenges}
        onChange={(values) => onChange("operationalChallenges", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="helperMatching">How do you currently match helpers with those in need? *</Label>
        <Textarea
          id="helperMatching"
          value={data.helperMatching}
          onChange={(e) => onChange("helperMatching", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="verificationTraining">What verification or training do helpers require? *</Label>
        <Textarea
          id="verificationTraining"
          value={data.verificationTraining}
          onChange={(e) => onChange("verificationTraining", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="impactMeasurement">How do you measure your impact? *</Label>
        <Textarea
          id="impactMeasurement"
          value={data.impactMeasurement}
          onChange={(e) => onChange("impactMeasurement", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default CurrentChallengesSection;
