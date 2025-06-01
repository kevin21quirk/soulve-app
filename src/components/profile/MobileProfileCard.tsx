
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Award, Users, MessageSquare, UserPlus } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";

interface MobileProfileCardProps {
  profileData: UserProfileData;
  onSendMessage?: () => void;
  onConnect?: () => void;
  connectionStatus?: 'none' | 'pending' | 'connected';
  compact?: boolean;
}

const MobileProfileCard = ({ 
  profileData, 
  onSendMessage, 
  onConnect, 
  connectionStatus = 'none',
  compact = false 
}: MobileProfileCardProps) => {
  return (
    <Card className="w-full">
      <CardContent className={compact ? "p-3" : "p-4"}>
        <div className="flex items-start space-x-3">
          <Avatar className={compact ? "h-12 w-12" : "h-16 w-16"}>
            <AvatarImage src={profileData.avatar} />
            <AvatarFallback>
              {profileData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 truncate ${compact ? 'text-sm' : 'text-base'}`}>
              {profileData.name}
            </h3>
            
            <div className={`flex items-center text-gray-500 mt-1 ${compact ? 'text-xs' : 'text-sm'}`}>
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{profileData.location}</span>
            </div>
            
            <div className="flex items-center space-x-2 mt-2">
              <Badge
                variant="outline"
                className={`${getTrustScoreColor(profileData.trustScore)} text-xs`}
              >
                <Award className="h-3 w-3 mr-1" />
                {profileData.trustScore}%
              </Badge>
              
              {!compact && (
                <Badge variant="secondary" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {profileData.helpCount}
                </Badge>
              )}
            </div>
            
            {!compact && profileData.bio && profileData.bio !== 'No bio added yet' && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">{profileData.bio}</p>
            )}
          </div>
          
          <div className="flex flex-col space-y-1">
            {connectionStatus === 'connected' ? (
              <Button 
                onClick={onSendMessage} 
                size="sm" 
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-xs"
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                Message
              </Button>
            ) : connectionStatus === 'pending' ? (
              <Badge variant="outline" className="text-xs">
                Pending
              </Badge>
            ) : (
              <Button onClick={onConnect} variant="outline" size="sm" className="text-xs">
                <UserPlus className="h-3 w-3 mr-1" />
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProfileCard;
