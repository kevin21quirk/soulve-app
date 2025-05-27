
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface AmbassadorMotivationSectionProps {
  data: {
    motivations: string[];
    platformVision: string;
    contributionAreas: string[];
    timeCommitment: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const AmbassadorMotivationSection = ({ data, onChange }: AmbassadorMotivationSectionProps) => {
  const motivationOptions = [
    "Belief in the platform's mission",
    "Desire to make a positive impact",
    "Professional networking opportunities",
    "Skills development",
    "Community building passion",
    "Social entrepreneurship interest",
    "Technology for good advocacy",
    "Leadership development",
    "Personal growth",
    "Giving back to community"
  ];

  const contributionAreaOptions = [
    "Community outreach and engagement",
    "Content creation and social media",
    "Event planning and hosting",
    "Partnership development",
    "User onboarding and support",
    "Feedback collection and analysis",
    "Marketing and promotion",
    "Technical testing and feedback",
    "Training and workshops",
    "Strategic planning input"
  ];

  return (
    <FormSection title="Ambassador Motivation & Vision">
      <CheckboxGroup
        label="What motivates you to become a SouLVE ambassador? (Select all that apply)"
        options={motivationOptions}
        selectedValues={data.motivations}
        onChange={(values) => onChange("motivations", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="platformVision">How do you envision SouLVE making a difference in your community? *</Label>
        <Textarea
          id="platformVision"
          value={data.platformVision}
          onChange={(e) => onChange("platformVision", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="What areas would you like to contribute to as an ambassador? (Select all that apply)"
        options={contributionAreaOptions}
        selectedValues={data.contributionAreas}
        onChange={(values) => onChange("contributionAreas", values)}
        required
      />

      <div className="space-y-2">
        <Label htmlFor="timeCommitment">How much time can you commit to ambassador activities per month? *</Label>
        <Textarea
          id="timeCommitment"
          value={data.timeCommitment}
          onChange={(e) => onChange("timeCommitment", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default AmbassadorMotivationSection;
