
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "../shared/FormSection";

interface BusinessDetailsSectionProps {
  data: {
    email: string;
    companyName: string;
    industry: string;
    companySize: string;
    yearEstablished: string;
    businessModel: string;
    missionStatement: string;
  };
  onChange: (field: string, value: string) => void;
}

const BusinessDetailsSection = ({ data, onChange }: BusinessDetailsSectionProps) => {
  return (
    <FormSection title="Business Information">
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
        <Label htmlFor="companyName">Company Name *</Label>
        <Input
          id="companyName"
          value={data.companyName}
          onChange={(e) => onChange("companyName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry/Sector *</Label>
        <Input
          id="industry"
          value={data.industry}
          onChange={(e) => onChange("industry", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Company Size *</Label>
        <Select onValueChange={(value) => onChange("companySize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select company size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="201-1000">201-1000 employees</SelectItem>
            <SelectItem value="1000+">1000+ employees</SelectItem>
          </SelectContent>
        </Select>
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
        <Label htmlFor="businessModel">Business Model *</Label>
        <Input
          id="businessModel"
          value={data.businessModel}
          onChange={(e) => onChange("businessModel", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="missionStatement">Mission Statement *</Label>
        <Textarea
          id="missionStatement"
          value={data.missionStatement}
          onChange={(e) => onChange("missionStatement", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default BusinessDetailsSection;
