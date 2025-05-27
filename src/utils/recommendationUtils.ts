
import { Users, MessageSquare, Star, TrendingUp, Brain } from "lucide-react";

export const getRecommendationIcon = (type: string) => {
  switch (type) {
    case "connection": return <Users className="h-5 w-5 text-blue-500" />;
    case "post": return <MessageSquare className="h-5 w-5 text-green-500" />;
    case "help_opportunity": return <Star className="h-5 w-5 text-orange-500" />;
    case "skill_match": return <TrendingUp className="h-5 w-5 text-purple-500" />;
    default: return <Brain className="h-5 w-5 text-gray-500" />;
  }
};

export const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return "text-green-600 bg-green-100";
  if (confidence >= 80) return "text-blue-600 bg-blue-100";
  if (confidence >= 70) return "text-yellow-600 bg-yellow-100";
  return "text-red-600 bg-red-100";
};
