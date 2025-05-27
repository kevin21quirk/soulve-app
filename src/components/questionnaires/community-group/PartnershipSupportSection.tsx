
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface PartnershipSupportSectionProps {
  data: {
    partnershipInterest: string;
    supportNeeds: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const PartnershipSupportSection = ({ data, onChange }: PartnershipSupportSectionProps) => {
  const supportTypes = [
    "Event planning assistance",
    "Member engagement strategies",
    "Communication tools training",
    "Fundraising guidance",
    "Volunteer coordination",
    "Community outreach support",
    "Resource sharing networks",
    "Leadership development",
    "Technology training",
    "Grant writing assistance",
    "Legal guidance",
    "Marketing support"
  ];

  return (
    <FormSection title="Partnership & Support">
      <div className="space-y-2">
        <Label>Would your community group be interested in partnering with SouLVE? *</Label>
        <Select onValueChange={(value) => onChange("partnershipInterest", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="very-interested">Very interested</SelectItem>
            <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
            <SelectItem value="need-more-info">Need more information</SelectItem>
            <SelectItem value="not-interested">Not interested at this time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CheckboxGroup
        label="What support would your community group need most? (Select all that apply)"
        options={supportTypes}
        selectedValues={data.supportNeeds}
        onChange={(values) => onChange("supportNeeds", values)}
      />
    </FormSection>
  );
};

export default PartnershipSupportSection;
