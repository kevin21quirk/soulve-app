
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Star, Clock, MessageCircle } from "lucide-react";

interface EnhancedDiscoverCardProps {
  type: "person" | "group" | "campaign" | "event";
  data: any;
  onAction: (id: string, type: string) => void;
  onViewProfile?: (id: string) => void;
}

const EnhancedDiscoverCard = ({ type, data, onAction, onViewProfile }: EnhancedDiscoverCardProps) => {
  const getCardContent = () => {
    switch (type) {
      case "person":
        return (
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={data.avatar} />
                <AvatarFallback>{data.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{data.name}</h3>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span>{data.location}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs text-gray-500">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>{data.trustScore}% Trust</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-1">
              {data.skills?.slice(0, 3).map((skill: string) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="gradient" 
                className="flex-1"
                onClick={() => onAction(data.id, "connect")}
              >
                Connect
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onViewProfile?.(data.id)}
              >
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );

      case "group":
        return (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{data.name}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{data.description}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{data.memberCount} members</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {data.category}
              </Badge>
            </div>

            <Button 
              size="sm" 
              variant="gradient" 
              className="w-full"
              onClick={() => onAction(data.id, "join")}
            >
              {data.isJoined ? "Joined" : "Join Group"}
            </Button>
          </div>
        );

      case "campaign":
        return (
          <div className="space-y-3">
            <div>
              <h3 className="font-semibold text-sm">{data.title}</h3>
              <p className="text-xs text-gray-600 line-clamp-2">{data.description}</p>
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{data.participantCount} joined</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{data.endDate}</span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Badge 
                variant={data.urgency === "high" ? "destructive" : "outline"} 
                className="text-xs"
              >
                {data.urgency} priority
              </Badge>
              <Badge variant="outline" className="text-xs">
                {data.category}
              </Badge>
            </div>

            <Button 
              size="sm" 
              variant="gradient" 
              className="w-full"
              onClick={() => onAction(data.id, "join")}
            >
              {data.isParticipating ? "Participating" : "Join Campaign"}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        {getCardContent()}
      </CardContent>
    </Card>
  );
};

export default EnhancedDiscoverCard;
