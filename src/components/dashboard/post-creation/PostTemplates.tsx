
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  AlertCircle, 
  Users, 
  Calendar, 
  MapPin, 
  Briefcase,
  Home,
  Car,
  GraduationCap,
  Baby
} from "lucide-react";

interface PostTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  template: string;
  icon: React.ReactNode;
  color: string;
  tags: string[];
}

interface PostTemplatesProps {
  onTemplateSelect: (template: PostTemplate) => void;
  onCancel: () => void;
}

const postTemplates: PostTemplate[] = [
  // Help Needed Templates
  {
    id: "moving-help",
    title: "Moving Help",
    description: "Need help with moving or transportation",
    category: "help-needed",
    urgency: "medium",
    template: "I'm moving on [DATE] and need help with [SPECIFIC TASK]. Looking for [NUMBER] people to help for about [DURATION]. Can offer [COMPENSATION/FOOD/DRINKS] in return. Location: [FROM] to [TO].",
    icon: <Home className="h-5 w-5" />,
    color: "bg-red-100 text-red-700 border-red-200",
    tags: ["moving", "transportation", "labor"]
  },
  {
    id: "emergency-help",
    title: "Emergency Help",
    description: "Urgent assistance needed",
    category: "help-needed", 
    urgency: "urgent",
    template: "URGENT: I need immediate help with [EMERGENCY SITUATION]. This is time-sensitive and I would greatly appreciate any assistance. Located at [LOCATION]. Please contact me ASAP if you can help.",
    icon: <AlertCircle className="h-5 w-5" />,
    color: "bg-red-100 text-red-700 border-red-200",
    tags: ["emergency", "urgent", "immediate"]
  },
  {
    id: "childcare-help",
    title: "Childcare Help",
    description: "Need babysitting or childcare assistance",
    category: "help-needed",
    urgency: "medium",
    template: "Looking for reliable childcare help for [NUMBER] children, ages [AGES]. Needed on [DATE/TIME] for approximately [DURATION]. Experience with kids preferred. Will provide [COMPENSATION] per hour.",
    icon: <Baby className="h-5 w-5" />,
    color: "bg-red-100 text-red-700 border-red-200",
    tags: ["childcare", "babysitting", "kids"]
  },
  {
    id: "transportation-help",
    title: "Transportation Help",
    description: "Need a ride or transportation assistance",
    category: "help-needed",
    urgency: "medium",
    template: "Need transportation from [PICKUP LOCATION] to [DESTINATION] on [DATE] at [TIME]. Can offer [GAS MONEY/COMPENSATION] in return. Reason: [REASON - medical appointment, work, etc.]",
    icon: <Car className="h-5 w-5" />,
    color: "bg-red-100 text-red-700 border-red-200",
    tags: ["transportation", "ride", "car"]
  },

  // Help Offered Templates
  {
    id: "skill-sharing",
    title: "Skill Sharing",
    description: "Offer your professional skills",
    category: "help-offered",
    urgency: "low",
    template: "I'm offering free [SKILL/SERVICE] to anyone in the community who needs it. I have [EXPERIENCE LEVEL] experience in [FIELD]. Available [DAYS/TIMES]. Contact me if you're interested!",
    icon: <Briefcase className="h-5 w-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    tags: ["skills", "professional", "free"]
  },
  {
    id: "tutoring-offer",
    title: "Tutoring/Teaching",
    description: "Offer educational help",
    category: "help-offered",
    urgency: "low", 
    template: "Offering free tutoring in [SUBJECT] for [GRADE LEVEL/AGE GROUP]. I'm a [BACKGROUND - teacher, student, professional] with expertise in this area. Available [SCHEDULE]. Can meet at [LOCATION/ONLINE].",
    icon: <GraduationCap className="h-5 w-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    tags: ["tutoring", "education", "teaching"]
  },
  {
    id: "volunteer-offer",
    title: "Volunteer Services",
    description: "Offer general volunteer help",
    category: "help-offered",
    urgency: "low",
    template: "I have some free time and want to give back to the community. I can help with [TYPES OF TASKS]. Available [SCHEDULE]. No payment needed - just want to help where I can!",
    icon: <Heart className="h-5 w-5" />,
    color: "bg-green-100 text-green-700 border-green-200",
    tags: ["volunteer", "community", "free"]
  },

  // Event Templates
  {
    id: "community-event",
    title: "Community Event",
    description: "Organize or announce community gatherings",
    category: "announcement",
    urgency: "low",
    template: "Join us for [EVENT NAME] on [DATE] at [TIME]! We'll be [ACTIVITY DESCRIPTION] at [LOCATION]. This is a great opportunity to [BENEFITS/PURPOSE]. [RSVP/CONTACT INFO]",
    icon: <Calendar className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    tags: ["event", "community", "gathering"]
  },
  {
    id: "neighborhood-meetup",
    title: "Neighborhood Meetup",
    description: "Organize local neighborhood gatherings",
    category: "announcement",
    urgency: "low",
    template: "Organizing a neighborhood meetup on [DATE] at [TIME] in [LOCATION]. Come meet your neighbors, share ideas, and build our community! We'll have [ACTIVITIES/REFRESHMENTS]. All ages welcome!",
    icon: <Users className="h-5 w-5" />,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    tags: ["neighborhood", "meetup", "social"]
  }
];

const PostTemplates = ({ onTemplateSelect, onCancel }: PostTemplatesProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "All Templates" },
    { value: "help-needed", label: "Help Needed" },
    { value: "help-offered", label: "Help Offered" },
    { value: "announcement", label: "Events & Announcements" }
  ];

  const filteredTemplates = selectedCategory === "all" 
    ? postTemplates 
    : postTemplates.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Choose a Template</h3>
        <Button variant="outline" onClick={onCancel}>
          Start from Scratch
        </Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => onTemplateSelect(template)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {template.icon}
                  <CardTitle className="text-base">{template.title}</CardTitle>
                </div>
                <Badge className={template.color} variant="outline">
                  {template.urgency}
                </Badge>
              </div>
              <CardDescription className="text-sm">
                {template.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1 mb-3">
                {template.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-600 line-clamp-3">
                {template.template.substring(0, 120)}...
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PostTemplates;
