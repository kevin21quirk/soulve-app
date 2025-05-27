
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface OrganisationDetailsSectionProps {
  data: {
    email: string;
    organisationName: string;
    supportFocusArea: string[];
    peopleServedMonthly: string;
    primaryServiceModel: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const OrganisationDetailsSection = ({ data, onChange }: OrganisationDetailsSectionProps) => {
  const focusAreas = [
    "Mental Health",
    "Physical Health",
    "Elderly Support",
    "Youth Support",
    "Crisis Intervention",
    "Addiction Recovery"
  ];

  const serviceModels = [
    "One-to-one support",
    "Group sessions",
    "Resource provision",
    "Crisis response",
    "Long-term care"
  ];

  return (
    <FormSection title="Organisation Details">
      <div className="space-y-2">
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          type="email"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organisationName">Organisation Name *</Label>
        <Input
          id="organisationName"
          value={data.organisationName}
          onChange={(e) => onChange("organisationName", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="Support focus area (Tick all that apply)"
        options={focusAreas}
        selectedValues={data.supportFocusArea}
        onChange={(values) => onChange("supportFocusArea", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="peopleServedMonthly">Number of people served monthly *</Label>
        <Input
          id="peopleServedMonthly"
          value={data.peopleServedMonthly}
          onChange={(e) => onChange("peopleServedMonthly", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="Primary service model (Tick all that apply)"
        options={serviceModels}
        selectedValues={data.primaryServiceModel}
        onChange={(values) => onChange("primaryServiceModel", values)}
        required
      />
    </FormSection>
  );
};

export default OrganisationDetailsSection;
