
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Award, Users } from "lucide-react";
import { UserProfileData } from "@/components/dashboard/UserProfileTypes";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";
import ConnectionButton from "../connections/ConnectionButton";

interface MobileProfileCardProps {
  profileData: UserProfileData;
  onMessage?: () => void;
  compact?: boolean;
}

const MobileProfileCard = ({ 
  profileData, 
  onMessage, 
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
          
          <div className="flex-shrink-0">
            <ConnectionButton 
              userId={profileData.id}
              variant="compact"
              onMessage={onMessage}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileProfileCard;
