
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "../shared/FormSection";

interface GrowthImpactSectionProps {
  data: {
    growthGoals: string;
    successMeasurement: string;
    communityImpact: string;
    futureVision: string;
  };
  onChange: (field: string, value: string) => void;
}

const GrowthImpactSection = ({ data, onChange }: GrowthImpactSectionProps) => {
  return (
    <FormSection title="Growth & Impact">
      <div className="space-y-2">
        <Label htmlFor="growthGoals">What are your group's growth goals for the next 2 years? *</Label>
        <Textarea
          id="growthGoals"
          value={data.growthGoals}
          onChange={(e) => onChange("growthGoals", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="successMeasurement">How do you measure success in your community work? *</Label>
        <Textarea
          id="successMeasurement"
          value={data.successMeasurement}
          onChange={(e) => onChange("successMeasurement", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communityImpact">Describe the impact your group has had on the community *</Label>
        <Textarea
          id="communityImpact"
          value={data.communityImpact}
          onChange={(e) => onChange("communityImpact", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="futureVision">What is your vision for your community group's future? *</Label>
        <Textarea
          id="futureVision"
          value={data.futureVision}
          onChange={(e) => onChange("futureVision", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default GrowthImpactSection;
