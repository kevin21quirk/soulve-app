
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "../shared/FormSection";

interface OrganisationDetailsSectionProps {
  data: {
    organisationName: string;
    primaryIndustry: string;
    geographicAreas: string;
    organisationSize: string;
  };
  onChange: (field: string, value: string) => void;
}

const OrganisationDetailsSection = ({ data, onChange }: OrganisationDetailsSectionProps) => {
  return (
    <FormSection title="Organisation Details">
      <div className="space-y-2">
        <Label htmlFor="organisationName">Organisation name *</Label>
        <Input
          id="organisationName"
          value={data.organisationName}
          onChange={(e) => onChange("organisationName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryIndustry">Primary industry/sector *</Label>
        <Input
          id="primaryIndustry"
          value={data.primaryIndustry}
          onChange={(e) => onChange("primaryIndustry", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="geographicAreas">Geographic areas you operate in *</Label>
        <Input
          id="geographicAreas"
          value={data.geographicAreas}
          onChange={(e) => onChange("geographicAreas", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organisationSize">Number of employees/size of organisation *</Label>
        <Input
          id="organisationSize"
          value={data.organisationSize}
          onChange={(e) => onChange("organisationSize", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default OrganisationDetailsSection;
