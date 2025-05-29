import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  MessageSquare,
  Lightbulb,
  Flame,
} from "lucide-react";
import { Recommendation } from "@/types/recommendations";
import { getRecommendationIcon, getConfidenceColour } from "@/utils/recommendationUtils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction: (recommendation: Recommendation) => void;
}

const RecommendationCard = ({ recommendation, onAction }: RecommendationCardProps) => {
  const getTypeDisplay = () => {
    switch (recommendation.type) {
      case "connection":
        return { label: "Connect", colour: "bg-blue-100 text-blue-800" };
      case "help_opportunity":
        return { label: "Help", colour: "bg-orange-100 text-orange-800" };
      case "skill_match":
        return { label: "Tutor", colour: "bg-purple-100 text-purple-800" };
      case "post":
        return { label: "Join", colour: "bg-green-100 text-green-800" };
      default:
        return { label: "Action", colour: "bg-grey-100 text-grey-800" };
    }
  };

  const typeDisplay = getTypeDisplay();

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-purple-100 hover:border-purple-200">
      <CardContent className="p-6">
        {/* Header with recommendation type and confidence */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-2">
            {getRecommendationIcon(recommendation.type, "h-4 w-4")}
            <Badge className={`text-xs px-2 py-1 ${typeDisplay.colour}`}>
              {typeDisplay.label}
            </Badge>
          </div>
          <Badge className={`text-xs ${getConfidenceColour(recommendation.confidence)}`}>
            {recommendation.confidence}%
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="font-medium text-lg text-gray-900">{recommendation.title}</h4>
            <p className="text-sm text-gray-600">{recommendation.description}</p>
          </div>

          {/* Connection details */}
          {recommendation.type === "connection" && (
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={recommendation.data.avatar} />
                  <AvatarFallback>
                    {recommendation.data.user.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{recommendation.data.user}</p>
                  <p className="text-gray-500 text-sm">{recommendation.data.location}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <MessageSquare className="h-4 w-4" />
                <span>{recommendation.data.mutualConnections} mutual connections</span>
              </div>
            </div>
          )}

          {/* Help opportunity details */}
          {recommendation.type === "help_opportunity" && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                <MapPin className="h-4 w-4 inline-block mr-1" />
                {recommendation.data.location}
              </p>
              <p className="text-green-600 font-medium text-sm">
                {recommendation.data.compensation}
              </p>
              <p className="text-gray-500 text-sm">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                {recommendation.data.schedule}
              </p>
            </div>
          )}

          {/* Skill match details */}
          {recommendation.type === "skill_match" && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                <Lightbulb className="h-4 w-4 inline-block mr-1" />
                Subject: {recommendation.data.subject}
              </p>
              <p className="text-gray-500 text-sm">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                Schedule: {recommendation.data.schedule}
              </p>
            </div>
          )}

          {/* Post details */}
          {recommendation.type === "post" && (
            <div className="space-y-2">
              <p className="text-gray-600 text-sm">
                <Flame className="h-4 w-4 inline-block mr-1" />
                Organizer: {recommendation.data.organiser}
              </p>
              <p className="text-gray-500 text-sm">
                <Calendar className="h-4 w-4 inline-block mr-1" />
                Date: {recommendation.data.date}
              </p>
            </div>
          )}

          <Button
            onClick={() => onAction(recommendation)}
            className="w-full"
            variant="gradient"
          >
            {recommendation.actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
