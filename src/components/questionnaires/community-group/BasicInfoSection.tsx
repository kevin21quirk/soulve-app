
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSection from "../shared/FormSection";
import CheckboxGroup from "../shared/CheckboxGroup";

interface BasicInfoData {
  email: string;
  groupName: string;
  yearEstablished: string;
  memberCount: string;
  focusAreas: string[];
}

interface BasicInfoSectionProps {
  data: BasicInfoData;
  onChange: (field: string, value: string | string[]) => void;
}

const BasicInfoSection = ({ data, onChange }: BasicInfoSectionProps) => {
  const focusAreaOptions = [
    "Neighbourhood Improvement",
    "Social Events",
    "Environmental Action",
    "Cultural Activities",
    "Education & Learning",
    "Health & Wellness",
    "Youth Programs",
    "Senior Support",
    "Community Safety",
    "Arts & Culture",
    "Sports & Recreation",
    "Advocacy & Awareness"
  ];

  return (
    <FormSection title="Basic Information">
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
        <Label htmlFor="groupName">Community Group Name *</Label>
        <Input
          id="groupName"
          value={data.groupName}
          onChange={(e) => onChange("groupName", e.target.value)}
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
        <Label>Member Count *</Label>
        <Select onValueChange={(value) => onChange("memberCount", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select member count" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 members</SelectItem>
            <SelectItem value="11-25">11-25 members</SelectItem>
            <SelectItem value="26-50">26-50 members</SelectItem>
            <SelectItem value="51-100">51-100 members</SelectItem>
            <SelectItem value="100+">100+ members</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CheckboxGroup
        label="What areas does your community group focus on? (Select all that apply)"
        options={focusAreaOptions}
        selectedValues={data.focusAreas}
        onChange={(values) => onChange("focusAreas", values)}
        required
      />
    </FormSection>
  );
};

export default BasicInfoSection;
