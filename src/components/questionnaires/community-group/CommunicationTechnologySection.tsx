
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CommunicationTechnologySectionProps {
  data: {
    communicationMethods: string[];
    digitalTools: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

const CommunicationTechnologySection = ({ data, onChange }: CommunicationTechnologySectionProps) => {
  const communicationMethods = [
    "Email lists",
    "Social media groups",
    "WhatsApp groups",
    "Newsletter",
    "Website updates",
    "In-person meetings",
    "Text messaging",
    "Community notice boards",
    "Mobile apps",
    "Video calls",
    "Printed materials",
    "Word of mouth"
  ];

  const digitalTools = [
    "Facebook groups",
    "Instagram",
    "Twitter/X",
    "LinkedIn",
    "Discord",
    "Slack",
    "Zoom",
    "Microsoft Teams",
    "Google Workspace",
    "Event management platforms",
    "Survey tools",
    "Project management apps"
  ];

  return (
    <FormSection title="Communication & Technology">
      <CheckboxGroup
        label="How do you currently communicate with members? (Select all that apply)"
        options={communicationMethods}
        selectedValues={data.communicationMethods}
        onChange={(values) => onChange("communicationMethods", values)}
      />

      <CheckboxGroup
        label="What digital tools does your group currently use? (Select all that apply)"
        options={digitalTools}
        selectedValues={data.digitalTools}
        onChange={(values) => onChange("digitalTools", values)}
      />
    </FormSection>
  );
};

export default CommunicationTechnologySection;
