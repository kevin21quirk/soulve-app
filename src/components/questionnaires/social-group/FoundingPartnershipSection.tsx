
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface FoundingPartnershipSectionProps {
  data: {
    foundingPartnership: string;
    supportNeeds: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const FoundingPartnershipSection = ({ data, onChange }: FoundingPartnershipSectionProps) => {
  const supportTypes = [
    "Helper recruitment",
    "Skills training",
    "Resource connection",
    "Client outreach",
    "Impact measurement"
  ];

  return (
    <FormSection title="Founding Partnership">
      <div className="space-y-2">
        <Label>Would your organisation be interested in becoming a founding partner? *</Label>
        <Select onValueChange={(value) => onChange("foundingPartnership", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
            <SelectItem value="need-more-info">Need more information</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CheckboxGroup
        label="What support would your organisation need most?"
        options={supportTypes}
        selectedValues={data.supportNeeds}
        onChange={(values) => onChange("supportNeeds", values)}
        required
      />
    </FormSection>
  );
};

export default FoundingPartnershipSection;
