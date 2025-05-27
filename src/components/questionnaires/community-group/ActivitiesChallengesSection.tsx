
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FormSection from "../shared/FormSection";
import CheckboxGroup from "../shared/CheckboxGroup";

interface ActivitiesChallengesData {
  currentChallenges: string[];
  eventTypes: string[];
  memberEngagement: string;
  eventFrequency: string;
  barriers: string;
}

interface ActivitiesChallengesSectionProps {
  data: ActivitiesChallengesData;
  onChange: (field: string, value: string | string[]) => void;
}

const ActivitiesChallengesSection = ({ data, onChange }: ActivitiesChallengesSectionProps) => {
  const challengeOptions = [
    "Member recruitment",
    "Member retention",
    "Event planning",
    "Communication coordination",
    "Funding/resources",
    "Venue booking",
    "Volunteer coordination",
    "Community outreach",
    "Leadership development",
    "Time management",
    "Technology adoption",
    "Measuring impact"
  ];

  const eventTypeOptions = [
    "Social gatherings",
    "Educational workshops",
    "Community clean-ups",
    "Fundraising events",
    "Cultural celebrations",
    "Sports activities",
    "Volunteer projects",
    "Advocacy campaigns",
    "Networking events",
    "Family activities",
    "Skill-sharing sessions",
    "Support groups"
  ];

  return (
    <FormSection title="Current Activities & Challenges">
      <CheckboxGroup
        label="What are your biggest challenges? (Select all that apply)"
        options={challengeOptions}
        selectedValues={data.currentChallenges}
        onChange={(values) => onChange("currentChallenges", values)}
        required
      />

      <CheckboxGroup
        label="What types of events/activities do you organize? (Select all that apply)"
        options={eventTypeOptions}
        selectedValues={data.eventTypes}
        onChange={(values) => onChange("eventTypes", values)}
      />

      <div className="space-y-2">
        <Label htmlFor="memberEngagement">How do you currently engage with members? *</Label>
        <Textarea
          id="memberEngagement"
          value={data.memberEngagement}
          onChange={(e) => onChange("memberEngagement", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>How often do you organize events/activities? *</Label>
        <Select onValueChange={(value) => onChange("eventFrequency", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
            <SelectItem value="ad-hoc">As needed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="barriers">What barriers prevent your group from achieving its goals? *</Label>
        <Textarea
          id="barriers"
          value={data.barriers}
          onChange={(e) => onChange("barriers", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default ActivitiesChallengesSection;
