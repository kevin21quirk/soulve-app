
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Brain } from "lucide-react";
import { Recommendation } from "@/types/recommendations";
import { getRecommendationIcon, getConfidenceColor } from "@/utils/recommendationUtils";

interface RecommendationCardProps {
  recommendation: Recommendation;
  onAction: (recommendation: Recommendation) => void;
}

const RecommendationCard = ({ recommendation, onAction }: RecommendationCardProps) => {
  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow bg-gradient-to-r from-white to-gray-50">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          {getRecommendationIcon(recommendation.type)}
          <div>
            <h4 className="font-medium text-gray-900">{recommendation.title}</h4>
            <p className="text-sm text-gray-600">{recommendation.description}</p>
          </div>
        </div>
        <Badge className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
          {recommendation.confidence}% match
        </Badge>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2">
          <Brain className="h-3 w-3 inline mr-1" />
          Why this recommendation: {recommendation.reasoning}
        </p>
      </div>

      {/* Connection type data */}
      {recommendation.type === "connection" && (
        <div className="bg-blue-50 p-3 rounded-md mb-3">
          <div className="flex items-center space-x-3 mb-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recommendation.data.avatar} />
              <AvatarFallback className="text-xs">
                {recommendation.data.user.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{recommendation.data.user}</p>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <MapPin className="h-3 w-3" />
                <span>{recommendation.data.location}</span>
                <span>•</span>
                <span>{recommendation.data.mutualConnections} mutual connections</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-1">
            {recommendation.data.skills.map((skill: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Help opportunity type data */}
      {recommendation.type === "help_opportunity" && (
        <div className="bg-orange-50 p-3 rounded-md mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3 text-gray-500" />
              <span>{recommendation.data.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span>{recommendation.data.timeCommitment}</span>
            </div>
            <div className="col-span-2 font-medium text-green-600">
              {recommendation.data.compensation}
            </div>
          </div>
        </div>
      )}

      {/* Skill match type data */}
      {recommendation.type === "skill_match" && (
        <div className="bg-purple-50 p-3 rounded-md mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Subject:</strong> {recommendation.data.subject}</div>
            <div><strong>Schedule:</strong> {recommendation.data.schedule}</div>
            <div><strong>Level:</strong> {recommendation.data.level}</div>
            <div>
              <Badge variant={recommendation.data.remote ? "default" : "outline"} className="text-xs">
                {recommendation.data.remote ? "Remote" : "In-person"}
              </Badge>
            </div>
          </div>
        </div>
      )}

      {/* Post type data */}
      {recommendation.type === "post" && (
        <div className="bg-green-50 p-3 rounded-md mb-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><strong>Organizer:</strong> {recommendation.data.organizer}</div>
            <div><strong>Date:</strong> {recommendation.data.date}</div>
            <div><strong>Volunteers:</strong> {recommendation.data.volunteers} joined</div>
            <div><strong>Impact:</strong> {recommendation.data.impact}</div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button
          onClick={() => onAction(recommendation)}
          size="sm"
          className="flex-1 mr-2"
        >
          {recommendation.actionLabel}
        </Button>
        <Button variant="outline" size="sm">
          Not Interested
        </Button>
      </div>
    </div>
  );
};

export default RecommendationCard;
