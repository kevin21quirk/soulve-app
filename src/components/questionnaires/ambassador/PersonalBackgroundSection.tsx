
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import FormSection from "../shared/FormSection";

interface PersonalBackgroundSectionProps {
  data: {
    email: string;
    fullName: string;
    age: string;
    location: string;
    currentRole: string;
    backgroundExperience: string;
    communityInvolvement: string;
  };
  onChange: (field: string, value: string) => void;
}

const PersonalBackgroundSection = ({ data, onChange }: PersonalBackgroundSectionProps) => {
  return (
    <FormSection title="Personal Background">
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

      <div className="space-y-2">
        <Label htmlFor="currentRole">Current Professional Role *</Label>
        <Input
          id="currentRole"
          value={data.currentRole}
          onChange={(e) => onChange("currentRole", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="backgroundExperience">Describe your background and relevant experience *</Label>
        <Textarea
          id="backgroundExperience"
          value={data.backgroundExperience}
          onChange={(e) => onChange("backgroundExperience", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="communityInvolvement">Describe your current community involvement *</Label>
        <Textarea
          id="communityInvolvement"
          value={data.communityInvolvement}
          onChange={(e) => onChange("communityInvolvement", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default PersonalBackgroundSection;
