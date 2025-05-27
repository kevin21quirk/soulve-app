
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FormSection from "../shared/FormSection";

interface ContactInfoSectionProps {
  data: {
    contactName: string;
    contactPosition: string;
    contactEmail: string;
    contactPhone: string;
  };
  onChange: (field: string, value: string) => void;
}

const ContactInfoSection = ({ data, onChange }: ContactInfoSectionProps) => {
  return (
    <FormSection title="Contact Information (optional)">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="contactName">Contact Name</Label>
          <Input
            id="contactName"
            value={data.contactName}
            onChange={(e) => onChange("contactName", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPosition">Position/Title</Label>
          <Input
            id="contactPosition"
            value={data.contactPosition}
            onChange={(e) => onChange("contactPosition", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            type="email"
            value={data.contactEmail}
            onChange={(e) => onChange("contactEmail", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactPhone">Phone Number</Label>
          <Input
            id="contactPhone"
            value={data.contactPhone}
            onChange={(e) => onChange("contactPhone", e.target.value)}
          />
        </div>
      </div>
    </FormSection>
  );
};

export default ContactInfoSection;
