
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Star, Camera } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileHeaderProps {
  profileData: UserProfileData;
  isEditing: boolean;
}

const UserProfileHeader = ({ profileData, isEditing }: UserProfileHeaderProps) => {
  if (isEditing) {
    return (
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profileData.avatar} />
          <AvatarFallback className="text-lg">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <Button variant="outline" size="sm">
          <Camera className="h-4 w-4 mr-2" />
          Change Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
      <Avatar className="h-24 w-24">
        <AvatarImage src={profileData.avatar} />
        <AvatarFallback className="text-xl">
          {profileData.name.split(' ').map(n => n[0]).join('')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <h2 className="text-3xl font-bold text-gray-900">{profileData.name}</h2>
        <div className="flex items-center space-x-4 mt-2 text-gray-600">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{profileData.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>Joined {profileData.joinDate}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center space-x-1">
          <Star className="h-5 w-5 text-yellow-500" />
          <span className="text-xl font-bold">{profileData.trustScore}</span>
          <span className="text-gray-500">Trust Score</span>
        </div>
        <span className="text-sm text-gray-500">{profileData.helpCount} people helped</span>
      </div>
    </div>
  );
};

export default UserProfileHeader;
