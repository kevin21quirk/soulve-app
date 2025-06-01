
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, Star, Users, Heart, MessageCircle } from "lucide-react";

interface Recommendation {
  id: string;
  type: 'help_opportunity' | 'connection' | 'volunteer' | 'campaign';
  title: string;
  description: string;
  author?: {
    name: string;
    avatar?: string;
    trustScore?: number;
  };
  location?: string;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  timeCommitment?: string;
  skills?: string[];
  category: string;
  metadata?: {
    likes?: number;
    responses?: number;
    deadline?: string;
    compensation?: string;
  };
  confidenceScore: number;
  reasoning: string;
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  onInteract: (id: string, action: string) => void;
}

const RecommendationCard = ({ recommendation, onInteract }: RecommendationCardProps) => {
  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'help_opportunity': return Heart;
      case 'connection': return Users;
      case 'volunteer': return Clock;
      case 'campaign': return Star;
      default: return Heart;
    }
  };

  const TypeIcon = getTypeIcon(recommendation.type);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-50 rounded-full">
              <TypeIcon className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <Badge variant="outline" className="text-xs">
                {recommendation.type.replace('_', ' ')}
              </Badge>
              {recommendation.urgency && (
                <Badge className={`ml-2 text-xs ${getUrgencyColor(recommendation.urgency)}`}>
                  {recommendation.urgency}
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Match Score</div>
            <div className="text-sm font-semibold text-green-600">
              {Math.round(recommendation.confidenceScore)}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">{recommendation.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{recommendation.description}</p>
        </div>

        {recommendation.author && (
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={recommendation.author.avatar} />
              <AvatarFallback>
                {recommendation.author.name.substring(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-medium">{recommendation.author.name}</div>
              {recommendation.author.trustScore && (
                <div className="text-xs text-gray-500">
                  Trust Score: {recommendation.author.trustScore}%
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 text-xs text-gray-500">
          {recommendation.location && (
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{recommendation.location}</span>
            </div>
          )}
          {recommendation.timeCommitment && (
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{recommendation.timeCommitment}</span>
            </div>
          )}
          {recommendation.metadata?.deadline && (
            <div className="flex items-center space-x-1">
              <span>Deadline: {recommendation.metadata.deadline}</span>
            </div>
          )}
        </div>

        {recommendation.skills && recommendation.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {recommendation.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {recommendation.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{recommendation.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}

        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-xs font-medium text-blue-900 mb-1">Why this matches you:</div>
          <div className="text-xs text-blue-700">{recommendation.reasoning}</div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            {recommendation.metadata?.likes && (
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{recommendation.metadata.likes}</span>
              </div>
            )}
            {recommendation.metadata?.responses && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{recommendation.metadata.responses}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onInteract(recommendation.id, 'view')}
            >
              View Details
            </Button>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onInteract(recommendation.id, 'respond')}
            >
              {recommendation.type === 'connection' ? 'Connect' : 
               recommendation.type === 'help_opportunity' ? 'Help' : 'Join'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecommendationCard;
