
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "../shared/FormSection";

interface OrganizationInfoSectionProps {
  data: {
    email: string;
    organizationName: string;
    religiousTradition: string;
    yearEstablished: string;
    membershipSize: string;
    missionAlignment: string;
  };
  onChange: (field: string, value: string) => void;
}

const OrganizationInfoSection = ({ data, onChange }: OrganizationInfoSectionProps) => {
  return (
    <FormSection title="Organization Information">
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
        <Label htmlFor="organizationName">Organization Name *</Label>
        <Input
          id="organizationName"
          value={data.organizationName}
          onChange={(e) => onChange("organizationName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="religiousTradition">Religious Tradition/Denomination *</Label>
        <Input
          id="religiousTradition"
          value={data.religiousTradition}
          onChange={(e) => onChange("religiousTradition", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="yearEstablished">Year Established *</Label>
        <Input
          id="yearEstablished"
          type="number"
          value={data.yearEstablished}
          onChange={(e) => onChange("yearEstablished", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Membership/Congregation Size *</Label>
        <Select onValueChange={(value) => onChange("membershipSize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select membership size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="under-50">Under 50 members</SelectItem>
            <SelectItem value="50-150">50-150 members</SelectItem>
            <SelectItem value="151-500">151-500 members</SelectItem>
            <SelectItem value="501-1000">501-1000 members</SelectItem>
            <SelectItem value="over-1000">Over 1000 members</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="missionAlignment">How does community service align with your organization's mission? *</Label>
        <Textarea
          id="missionAlignment"
          value={data.missionAlignment}
          onChange={(e) => onChange("missionAlignment", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default OrganizationInfoSection;
