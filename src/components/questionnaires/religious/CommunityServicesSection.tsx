
import CheckboxGroup from "../shared/CheckboxGroup";
import FormSection from "../shared/FormSection";

interface CommunityServicesSectionProps {
  data: {
    communityServicesOffered: string[];
    outreachPrograms: string[];
    youthPrograms: string[];
    seniorPrograms: string[];
  };
  onChange: (field: string, value: string | string[]) => void;
}

const CommunityServicesSection = ({ data, onChange }: CommunityServicesSectionProps) => {
  const communityServiceOptions = [
    "Food bank/pantry",
    "Homeless shelter/support",
    "Youth programs",
    "Senior care",
    "Counseling services",
    "Educational programs",
    "Healthcare services",
    "Disaster relief",
    "Addiction support",
    "Community meals",
    "Clothing distribution",
    "Financial assistance",
    "Immigration support",
    "Job training",
    "Childcare services",
    "Mental health support"
  ];

  const outreachProgramOptions = [
    "Community evangelism",
    "Social justice advocacy",
    "Environmental stewardship",
    "Prison ministry",
    "Hospital visitation",
    "Street ministry",
    "Campus ministry",
    "Workplace chaplaincy",
    "Crisis intervention",
    "Grief counseling",
    "Marriage/family support",
    "Community organizing"
  ];

  const youthProgramOptions = [
    "Sunday school/religious education",
    "Youth groups",
    "Summer camps",
    "Mentoring programs",
    "Sports activities",
    "Music/arts programs",
    "Community service projects",
    "Leadership development",
    "Scholarship programs",
    "After-school programs",
    "Teen counseling",
    "Career guidance"
  ];

  const seniorProgramOptions = [
    "Senior fellowship groups",
    "Meals on wheels",
    "Transportation services",
    "Health and wellness programs",
    "Social activities",
    "Home visits",
    "Technology training",
    "Intergenerational programs",
    "Caregiver support",
    "Memory care activities",
    "Financial planning assistance",
    "End-of-life support"
  ];

  return (
    <FormSection title="Community Services & Programs">
      <CheckboxGroup
        label="What community services does your organization currently offer? (Select all that apply)"
        options={communityServiceOptions}
        selectedValues={data.communityServicesOffered}
        onChange={(values) => onChange("communityServicesOffered", values)}
      />

      <CheckboxGroup
        label="What outreach programs do you operate? (Select all that apply)"
        options={outreachProgramOptions}
        selectedValues={data.outreachPrograms}
        onChange={(values) => onChange("outreachPrograms", values)}
      />

      <CheckboxGroup
        label="What youth programs do you offer? (Select all that apply)"
        options={youthProgramOptions}
        selectedValues={data.youthPrograms}
        onChange={(values) => onChange("youthPrograms", values)}
      />

      <CheckboxGroup
        label="What programs do you offer for seniors? (Select all that apply)"
        options={seniorProgramOptions}
        selectedValues={data.seniorPrograms}
        onChange={(values) => onChange("seniorPrograms", values)}
      />
    </FormSection>
  );
};

export default CommunityServicesSection;
