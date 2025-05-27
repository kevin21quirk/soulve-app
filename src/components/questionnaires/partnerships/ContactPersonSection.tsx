
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "../shared/FormSection";

interface ContactPersonSectionProps {
  data: {
    contactName: string;
    contactRole: string;
    contactEmail: string;
    contactPhone: string;
  };
  onChange: (field: string, value: string) => void;
}

const ContactPersonSection = ({ data, onChange }: ContactPersonSectionProps) => {
  return (
    <FormSection title="Primary Contact Person">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Name *</Label>
          <Input
            id="contactName"
            value={data.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactRole">Role *</Label>
          <Input
            id="contactRole"
            value={data.contactRole}
            onChange={(e) => onChange("contactRole", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone *</Label>
          <Input
            id="contactPhone"
            value={data.contactPhone}
            onChange={(e) => onChange("contactPhone", e.target.value)}
            required
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ContactPersonSection;
