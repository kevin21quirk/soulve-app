
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Award, TrendingUp } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";
import { getTrustScoreColor } from "@/utils/trustScoreUtils";
import AvatarUpload from "./AvatarUpload";

interface UserProfileHeaderProps {
  profileData: UserProfileData;
  isEditing: boolean;
  onViewPointsDetails?: () => void;
  onAvatarUpdate?: (newAvatarUrl: string) => void;
}

const UserProfileHeader = ({ 
  profileData, 
  isEditing, 
  onViewPointsDetails,
  onAvatarUpdate 
}: UserProfileHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-centre space-y-4 md:space-y-0 md:space-x-6">
      <AvatarUpload
        currentAvatar={profileData.avatar}
        userName={profileData.name}
        onAvatarUpdate={onAvatarUpdate || (() => {})}
        isEditing={isEditing}
      />
      
      <div className="flex-1 space-y-3">
        <div>
          <h1 className="text-2xl font-bold text-grey-900">{profileData.name}</h1>
          <div className="flex flex-wrap items-centre gap-4 text-sm text-grey-600 mt-1">
            <div className="flex items-centre space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{profileData.location}</span>
            </div>
            <div className="flex items-centre space-x-1">
              <Calendar className="h-4 w-4" />
              <span>Joined {profileData.joinDate}</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="sm"
            className={`${getTrustScoreColor(profileData.trustScore)} cursor-pointer hover:scale-105 transition-transform`}
            onClick={onViewPointsDetails}
            disabled={isEditing}
          >
            <Award className="h-4 w-4 mr-1" />
            {profileData.trustScore}% Trust Score
            {!isEditing && <TrendingUp className="h-3 w-3 ml-1" />}
          </Button>
          
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Users className="h-3 w-3 mr-1" />
            {profileData.helpCount} people helped
          </Badge>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
