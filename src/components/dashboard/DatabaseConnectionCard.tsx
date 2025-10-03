
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DatabaseProfile } from "@/services/realConnectionsService";
import { MapPin, Users, Clock, UserPlus, UserCheck, UserX, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DatabaseConnectionCardProps {
  profile: DatabaseProfile;
  onSendRequest?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  getTrustScoreColor: (score: number) => string;
  variant: "suggested" | "pending" | "connected";
  mutualConnections?: number;
  lastActive?: string;
}

const DatabaseConnectionCard = ({ 
  profile, 
  onSendRequest, 
  onAccept, 
  onDecline, 
  getTrustScoreColor, 
  variant,
  mutualConnections = 0,
  lastActive = "recently"
}: DatabaseConnectionCardProps) => {
  const displayName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <Avatar 
              className="h-12 w-12 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate(`/profile/${profile.id}`)}
            >
              <AvatarImage src={profile.avatar_url || ''} />
              <AvatarFallback>
                {displayName.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h4 
                className="font-medium text-gray-900 truncate cursor-pointer hover:underline"
                onClick={() => navigate(`/profile/${profile.id}`)}
              >
                {displayName}
              </h4>
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <MapPin className="h-3 w-3" />
                <span>{profile.location || 'Location not specified'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Trust Score</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTrustScoreColor(85)}`}>
                85%
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Users className="h-3 w-3" />
                <span>{mutualConnections} mutual</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>Active {lastActive}</span>
              </div>
            </div>
          </div>

          {profile.bio && (
            <p className="text-sm text-gray-600 line-clamp-2">{profile.bio}</p>
          )}

          <div className="flex flex-wrap gap-1">
            {(profile.skills || []).slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {(profile.interests || []).slice(0, 2).map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>

          <div className="flex space-x-2">
            {variant === "suggested" && onSendRequest && (
              <Button 
                onClick={() => onSendRequest(profile.id)}
                variant="default"
                className="flex-1 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:from-[#0ce4af] hover:to-[#18a5fe]"
                size="sm"
              >
                <UserPlus className="h-4 w-4 mr-1" />
                Send Request
              </Button>
            )}
            
            {variant === "pending" && onAccept && onDecline && (
              <>
                <Button 
                  onClick={() => onAccept(profile.id)}
                  variant="default"
                  className="flex-1 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:from-[#0ce4af] hover:to-[#18a5fe]"
                  size="sm"
                >
                  <UserCheck className="h-4 w-4 mr-1" />
                  Accept
                </Button>
                <Button 
                  onClick={() => onDecline(profile.id)}
                  variant="outline" 
                  size="sm"
                >
                  <UserX className="h-4 w-4 mr-1" />
                  Decline
                </Button>
              </>
            )}
            
            {variant === "connected" && (
              <>
                <Button variant="outline" className="flex-1" size="sm">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Message
                </Button>
                <Button variant="ghost" size="sm" disabled>
                  <UserCheck className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DatabaseConnectionCard;
