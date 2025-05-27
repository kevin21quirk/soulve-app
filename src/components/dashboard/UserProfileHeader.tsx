
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Star, Camera, Shield, Award, Crown } from "lucide-react";
import { UserProfileData } from "./UserProfileTypes";

interface UserProfileHeaderProps {
  profileData: UserProfileData;
  isEditing: boolean;
}

const getTrustBadge = (trustScore: number) => {
  if (trustScore >= 95) {
    return { icon: Crown, label: "Elite Helper", color: "bg-gradient-to-r from-yellow-400 to-orange-500" };
  } else if (trustScore >= 85) {
    return { icon: Award, label: "Trusted Helper", color: "bg-gradient-to-r from-blue-500 to-purple-600" };
  } else if (trustScore >= 70) {
    return { icon: Shield, label: "Verified Helper", color: "bg-gradient-to-r from-green-500 to-emerald-600" };
  } else {
    return { icon: Star, label: "Community Member", color: "bg-gradient-to-r from-gray-500 to-gray-600" };
  }
};

const UserProfileHeader = ({ profileData, isEditing }: UserProfileHeaderProps) => {
  const trustBadge = getTrustBadge(profileData.trustScore);
  const TrustIcon = trustBadge.icon;

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
    <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
      <div className="flex flex-col items-center space-y-4">
        <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
          <AvatarImage src={profileData.avatar} />
          <AvatarFallback className="text-2xl font-bold">
            {profileData.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        
        {/* Trust Score - Prominently displayed under avatar */}
        <div className="flex flex-col items-center space-y-2">
          <div className={`${trustBadge.color} text-white px-4 py-2 rounded-full flex items-center space-x-2 shadow-lg`}>
            <TrustIcon className="h-5 w-5" />
            <span className="font-bold text-lg">{profileData.trustScore}</span>
            <span className="text-sm">Trust Score</span>
          </div>
          <Badge variant="secondary" className="text-sm font-medium">
            {trustBadge.label}
          </Badge>
        </div>
      </div>

      <div className="flex-1 space-y-4">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">{profileData.name}</h2>
          
          {/* Location and Join Date */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-2 sm:space-y-0 text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-500" />
              <span className="font-medium">{profileData.location}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <span>Joined {profileData.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Help Count - More prominent */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 p-2 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-green-700">{profileData.helpCount}</p>
              <p className="text-sm text-green-600 font-medium">People Helped</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
