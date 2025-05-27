
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CollaborationResourcesSectionProps {
  data: {
    collaborationInterest: string[];
    resourceNeeds: string[];
  };
  onChange: (field: string, value: string[]) => void;
}

const CollaborationResourcesSection = ({ data, onChange }: CollaborationResourcesSectionProps) => {
  const collaborationTypes = [
    "Joint events with other groups",
    "Resource sharing",
    "Skill exchanges",
    "Volunteer sharing",
    "Advocacy partnerships",
    "Funding collaborations",
    "Knowledge sharing",
    "Mentorship programs"
  ];

  const resourceTypes = [
    "Funding opportunities",
    "Volunteer recruitment",
    "Event planning support",
    "Marketing assistance",
    "Legal guidance",
    "Technology training",
    "Leadership development",
    "Networking opportunities",
    "Administrative support",
    "Venue access",
    "Equipment sharing",
    "Professional services"
  ];

  return (
    <FormSection title="Collaboration & Resources">
      <CheckboxGroup
        label="What types of collaboration would interest your group? (Select all that apply)"
        options={collaborationTypes}
        selectedValues={data.collaborationInterest}
        onChange={(values) => onChange("collaborationInterest", values)}
      />

      <CheckboxGroup
        label="What resources would be most valuable to your group? (Select all that apply)"
        options={resourceTypes}
        selectedValues={data.resourceNeeds}
        onChange={(values) => onChange("resourceNeeds", values)}
      />
    </FormSection>
  );
};

export default CollaborationResourcesSection;
