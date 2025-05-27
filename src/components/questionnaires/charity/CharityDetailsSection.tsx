
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CharityDetailsSectionProps {
  data: {
    email: string;
    charityName: string;
    registrationNumber: string;
    focusAreas: string[];
    charitySize: string;
    yearsOperating: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const CharityDetailsSection = ({ data, onChange }: CharityDetailsSectionProps) => {
  const focusAreaOptions = [
    "Education",
    "Health & Medical",
    "Poverty Relief",
    "Environment",
    "Animal Welfare",
    "Arts & Culture",
    "Human Rights",
    "Disaster Relief",
    "Youth Development",
    "Elderly Care",
    "Mental Health",
    "Community Development"
  ];

  return (
    <FormSection title="Charity Details">
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
        <Label htmlFor="charityName">Charity Name *</Label>
        <Input
          id="charityName"
          value={data.charityName}
          onChange={(e) => onChange("charityName", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registrationNumber">Charity Registration Number *</Label>
        <Input
          id="registrationNumber"
          value={data.registrationNumber}
          onChange={(e) => onChange("registrationNumber", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="Primary focus areas (Select all that apply)"
        options={focusAreaOptions}
        selectedValues={data.focusAreas}
        onChange={(values) => onChange("focusAreas", values)}
        required
      />

      <div className="space-y-2">
        <Label>Organisation Size *</Label>
        <Select onValueChange={(value) => onChange("charitySize", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select organisation size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-10">1-10 employees</SelectItem>
            <SelectItem value="11-50">11-50 employees</SelectItem>
            <SelectItem value="51-200">51-200 employees</SelectItem>
            <SelectItem value="200+">200+ employees</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Years Operating *</Label>
        <Select onValueChange={(value) => onChange("yearsOperating", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select years operating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1-3">1-3 years</SelectItem>
            <SelectItem value="4-10">4-10 years</SelectItem>
            <SelectItem value="11-20">11-20 years</SelectItem>
            <SelectItem value="20+">20+ years</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </FormSection>
  );
};

export default CharityDetailsSection;
