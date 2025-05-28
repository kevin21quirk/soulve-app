
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, GraduationCap, Calendar } from "lucide-react";

export const getRecommendationIcon = (type: string, className: string = "h-4 w-4") => {
  switch (type) {
    case "connection":
      return <Users className={`${className} text-blue-600`} />;
    case "help_opportunity":
      return <Target className={`${className} text-orange-600`} />;
    case "skill_match":
      return <GraduationCap className={`${className} text-purple-600`} />;
    case "post":
      return <Calendar className={`${className} text-green-600`} />;
    default:
      return <Target className={`${className} text-grey-600`} />;
  }
};

export const getConfidenceColour = (confidence: number) => {
  if (confidence >= 90) return "bg-green-100 text-green-800";
  if (confidence >= 75) return "bg-blue-100 text-blue-800";
  if (confidence >= 60) return "bg-yellow-100 text-yellow-800";
  return "bg-grey-100 text-grey-800";
};
