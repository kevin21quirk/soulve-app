
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSection from "./FormSection";

interface PlatformFeature {
  key: string;
  label: string;
}

interface PlatformFeaturesSectionProps {
  features: PlatformFeature[];
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}

const PlatformFeaturesSection = ({ features, values, onChange }: PlatformFeaturesSectionProps) => {
  return (
    <FormSection title="SouLVE Platform Features - How valuable would these be? (1-5 scale)">
      {features.map((feature) => (
        <div key={feature.key} className="space-y-2">
          <Label>{feature.label} *</Label>
          <Select onValueChange={(value) => onChange(feature.key, value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select rating (1-5)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 - Not valuable</SelectItem>
              <SelectItem value="2">2 - Slightly valuable</SelectItem>
              <SelectItem value="3">3 - Moderately valuable</SelectItem>
              <SelectItem value="4">4 - Very valuable</SelectItem>
              <SelectItem value="5">5 - Extremely valuable</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
    </FormSection>
  );
};

export default PlatformFeaturesSection;
