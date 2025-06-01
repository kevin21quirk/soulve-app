
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Users, Calendar, Target, UserPlus } from "lucide-react";

interface EnhancedDiscoverCardProps {
  type: "person" | "group" | "campaign" | "event";
  data: any;
  onAction: (id: string, actionType: string) => void;
  onViewProfile?: (userId: string) => void;
}

const EnhancedDiscoverCard = ({ 
  type, 
  data, 
  onAction, 
  onViewProfile 
}: EnhancedDiscoverCardProps) => {
  const getTypeIcon = () => {
    switch (type) {
      case "person": return Users;
      case "group": return Users;
      case "campaign": return Target;
      case "event": return Calendar;
      default: return Users;
    }
  };

  const getActionButton = () => {
    switch (type) {
      case "person":
        return (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onAction(data.id, "connect")}
            className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af] hover:text-white"
          >
            <UserPlus className="h-4 w-4 mr-1" />
            Connect
          </Button>
        );
      case "group":
      case "campaign":
      case "event":
        return (
          <Button
            size="sm"
            variant="gradient"
            onClick={() => onAction(data.id, "join")}
          >
            Join
          </Button>
        );
      default:
        return null;
    }
  };

  const IconComponent = getTypeIcon();

  return (
    <Card className="w-full">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          {type === "person" ? (
            <Avatar className="h-12 w-12">
              <AvatarImage src={data.avatar || data.avatar_url} />
              <AvatarFallback>
                {data.name?.charAt(0) || data.first_name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-12 w-12 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center">
              <IconComponent className="h-6 w-6 text-white" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <h3 
              className="font-medium text-gray-900 truncate cursor-pointer hover:text-[#0ce4af]"
              onClick={() => type === "person" && onViewProfile?.(data.id)}
            >
              {data.name || data.title || `${data.first_name} ${data.last_name}`}
            </h3>
            
            {data.location && (
              <div className="flex items-center text-gray-500 text-sm mt-1">
                <MapPin className="h-3 w-3 mr-1" />
                <span className="truncate">{data.location}</span>
              </div>
            )}
            
            {data.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {data.description}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center space-x-2">
                {data.category && (
                  <Badge variant="secondary" className="text-xs">
                    {data.category}
                  </Badge>
                )}
                
                {data.memberCount && (
                  <span className="text-xs text-gray-500">
                    {data.memberCount} members
                  </span>
                )}
                
                {data.trustScore && (
                  <Badge variant="outline" className="text-xs">
                    {data.trustScore}% trust
                  </Badge>
                )}
              </div>
              
              {getActionButton()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedDiscoverCard;
