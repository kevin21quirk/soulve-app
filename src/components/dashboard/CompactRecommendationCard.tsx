import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Recommendation } from "@/types/recommendations";
import { getRecommendationIcon, getConfidenceColour } from "@/utils/recommendationUtils";
import { useNavigate } from "react-router-dom";

interface CompactRecommendationCardProps {
  recommendation: Recommendation;
  onAction: (recommendation: Recommendation) => void;
}

const CompactRecommendationCard = ({ recommendation, onAction }: CompactRecommendationCardProps) => {
  const navigate = useNavigate();

  const handleUserClick = () => {
    if (recommendation.type === "connection" && recommendation.data?.target_id) {
      navigate(`/profile/${recommendation.data.target_id}`);
    }
  };

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
    <div className="p-3 border border-purple-200 rounded-lg hover:shadow-md transition-all duration-200 bg-white hover:bg-purple-50 group">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-centre space-x-2">
          {getRecommendationIcon(recommendation.type, "h-3 w-3")}
          <Badge className={`text-xs px-1.5 py-0.5 ${typeDisplay.colour}`}>
            {typeDisplay.label}
          </Badge>
        </div>
        <Badge className={`text-xs ${getConfidenceColour(recommendation.confidence)}`}>
          {recommendation.confidence}%
        </Badge>
      </div>

      <div className="mb-2">
        <h4 className="font-medium text-sm text-grey-900 line-clamp-1">{recommendation.title}</h4>
        <p className="text-xs text-grey-600 line-clamp-2 mt-1">{recommendation.description}</p>
      </div>

      {/* Connection preview */}
      {recommendation.type === "connection" && (
        <div className="flex items-centre space-x-2 mb-2">
          <Avatar 
            className="h-6 w-6 cursor-pointer hover:ring-2 hover:ring-primary transition-all" 
            onClick={handleUserClick}
          >
            <AvatarImage src={recommendation.data.avatar} />
            <AvatarFallback className="text-xs">
              {recommendation.data.user.split(' ').map((n: string) => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p 
              className="text-xs font-medium text-grey-900 truncate cursor-pointer hover:text-primary hover:underline transition-colors" 
              onClick={handleUserClick}
            >
              {recommendation.data.user}
            </p>
            <p className="text-xs text-grey-500 truncate">{recommendation.data.location}</p>
          </div>
        </div>
      )}

      {/* Help opportunity preview */}
      {recommendation.type === "help_opportunity" && (
        <div className="mb-2">
          <p className="text-xs text-grey-600">{recommendation.data.location}</p>
          <p className="text-xs font-medium text-green-600">{recommendation.data.compensation}</p>
        </div>
      )}

      {/* Skill match preview */}
      {recommendation.type === "skill_match" && (
        <div className="mb-2">
          <p className="text-xs text-grey-600">{recommendation.data.subject}</p>
          <p className="text-xs text-grey-500">{recommendation.data.schedule}</p>
        </div>
      )}

      {/* Post preview */}
      {recommendation.type === "post" && (
        <div className="mb-2">
          <p className="text-xs text-grey-600">{recommendation.data.organiser}</p>
          <p className="text-xs text-grey-500">{recommendation.data.date}</p>
        </div>
      )}

      <Button
        onClick={() => onAction(recommendation)}
        size="sm"
        className="w-full h-7 text-xs"
        variant="gradient"
      >
        {recommendation.actionLabel}
      </Button>
    </div>
  );
};

export default CompactRecommendationCard;
