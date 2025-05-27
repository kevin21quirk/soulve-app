
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSection from "../shared/FormSection";

interface PersonalDetailsSectionProps {
  data: {
    email: string;
    fullName: string;
    age: string;
    location: string;
  };
  onChange: (field: string, value: string) => void;
}

const PersonalDetailsSection = ({ data, onChange }: PersonalDetailsSectionProps) => {
  return (
    <FormSection title="Personal Details">
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
        <Label htmlFor="fullName">Full Name *</Label>
        <Input
          id="fullName"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Age Range *</Label>
        <Select onValueChange={(value) => onChange("age", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select age range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="18-25">18-25</SelectItem>
            <SelectItem value="26-35">26-35</SelectItem>
            <SelectItem value="36-45">36-45</SelectItem>
            <SelectItem value="46-55">46-55</SelectItem>
            <SelectItem value="56-65">56-65</SelectItem>
            <SelectItem value="65+">65+</SelectItem>
          </SelectContent>
        </Select>
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
    </FormSection>
  );
};

export default PersonalDetailsSection;
