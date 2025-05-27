
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface ContentSupportSectionProps {
  data: {
    contentInterest: string;
    supportNeeds: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const ContentSupportSection = ({ data, onChange }: ContentSupportSectionProps) => {
  const supportOptions = [
    "Clear project briefs",
    "Regular check-ins with organizations",
    "Technical platform support",
    "Recognition for contributions",
    "Networking with other experts",
    "Training on nonprofit sector",
    "Feedback and impact reports",
    "Professional development opportunities"
  ];

  return (
    <FormSection title="Content & Knowledge Sharing">
      <div className="space-y-2">
        <Label>Would you be interested in creating educational content for the platform? *</Label>
        <Select onValueChange={(value) => onChange("contentInterest", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select interest level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="very-interested">Very interested</SelectItem>
            <SelectItem value="somewhat-interested">Somewhat interested</SelectItem>
            <SelectItem value="maybe">Maybe, depending on the topic</SelectItem>
            <SelectItem value="not-interested">Not interested at this time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CheckboxGroup
        label="What support would you need as a volunteer expert? (Select all that apply)"
        options={supportOptions}
        selectedValues={data.supportNeeds}
        onChange={(values) => onChange("supportNeeds", values)}
      />
    </FormSection>
  );
};

export default ContentSupportSection;
