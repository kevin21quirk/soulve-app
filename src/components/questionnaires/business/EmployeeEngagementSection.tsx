
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface EmployeeEngagementSectionProps {
  data: {
    employeeVolunteerPrograms: string[];
    employeeEngagementChallenges: string[];
    volunteerTimeOff: string;
    employeeFeedback: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const EmployeeEngagementSection = ({ data, onChange }: EmployeeEngagementSectionProps) => {
  const volunteerProgramOptions = [
    "Paid volunteer time off",
    "Team building volunteer events",
    "Skills-based volunteering",
    "Board service opportunities",
    "Disaster response volunteering",
    "Environmental initiatives",
    "Education and mentoring",
    "Community service days",
    "Employee-led giving campaigns",
    "Volunteer recognition programs"
  ];

  const engagementChallengeOptions = [
    "Low participation rates",
    "Limited time availability",
    "Lack of employee interest",
    "Difficulty finding suitable opportunities",
    "Geographic constraints",
    "Scheduling conflicts",
    "Insufficient communication",
    "Lack of management support",
    "Budget constraints",
    "Measuring impact"
  ];

  return (
    <FormSection title="Employee Engagement">
      <CheckboxGroup
        label="What employee volunteer programs do you offer? (Select all that apply)"
        options={volunteerProgramOptions}
        selectedValues={data.employeeVolunteerPrograms}
        onChange={(values) => onChange("employeeVolunteerPrograms", values)}
      />

      <div className="space-y-2">
        <Label htmlFor="volunteerTimeOff">Does your company offer paid volunteer time off? *</Label>
        <Textarea
          id="volunteerTimeOff"
          value={data.volunteerTimeOff}
          onChange={(e) => onChange("volunteerTimeOff", e.target.value)}
          required
        />
      </div>

      <CheckboxGroup
        label="What challenges do you face in employee volunteer engagement? (Select all that apply)"
        options={engagementChallengeOptions}
        selectedValues={data.employeeEngagementChallenges}
        onChange={(values) => onChange("employeeEngagementChallenges", values)}
      />

      <div className="space-y-2">
        <Label htmlFor="employeeFeedback">How do you gather employee feedback on volunteer programs? *</Label>
        <Textarea
          id="employeeFeedback"
          value={data.employeeFeedback}
          onChange={(e) => onChange("employeeFeedback", e.target.value)}
          required
        />
      </div>
    </FormSection>
  );
};

export default EmployeeEngagementSection;
