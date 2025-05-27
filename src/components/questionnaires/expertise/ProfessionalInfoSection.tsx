
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "../shared/FormSection";

interface ProfessionalInfoSectionProps {
  data: {
    email: string;
    name: string;
    professionalTitle: string;
    organisation: string;
    location: string;
    contactPhone: string;
  };
  onChange: (field: string, value: string) => void;
}

const ProfessionalInfoSection = ({ data, onChange }: ProfessionalInfoSectionProps) => {
  return (
    <FormSection title="Professional Information">
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
        <Label htmlFor="name">Full Name *</Label>
        <Input
          id="name"
          value={data.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="professionalTitle">Professional Title *</Label>
        <Input
          id="professionalTitle"
          value={data.professionalTitle}
          onChange={(e) => onChange("professionalTitle", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="organisation">Current Organisation *</Label>
        <Input
          id="organisation"
          value={data.organisation}
          onChange={(e) => onChange("organisation", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location/Region *</Label>
        <Input
          id="location"
          value={data.location}
          onChange={(e) => onChange("location", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="contactPhone">Phone Number (optional)</Label>
        <Input
          id="contactPhone"
          value={data.contactPhone}
          onChange={(e) => onChange("contactPhone", e.target.value)}
        />
      </div>
    </FormSection>
  );
};

export default ProfessionalInfoSection;
