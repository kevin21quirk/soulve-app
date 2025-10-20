
import { CardContent } from "@/components/ui/card";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileDetails from "./UserProfileDetails";
import OrganizationConnections from "./profile/OrganizationConnections";
import ProfileBadgeShowcase from "../profile/ProfileBadgeShowcase";
import { Award } from "lucide-react";

interface ProfileDisplayModeProps {
  profileData: UserProfileData;
  onViewPointsDetails: () => void;
}

const ProfileDisplayMode = ({ profileData, onViewPointsDetails }: ProfileDisplayModeProps) => {
  return (
    <CardContent className="p-0">
      {/* Banner + Header with overlap */}
      <div className="relative">
        <UserProfileBanner
          banner={profileData.banner}
          bannerType={profileData.bannerType}
          bannerFile={null}
          onBannerUpload={() => {}}
          onRemoveBanner={() => {}}
          isEditing={false}
        />
        
        <UserProfileHeader 
          profileData={profileData} 
          isEditing={false} 
          onViewPointsDetails={onViewPointsDetails}
        />
      </div>
      
      {/* Details sections with spacing */}
      <div className="px-6 space-y-6 pb-6">
        {/* Badge Showcase */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Badges & Recognition</h3>
          </div>
          <ProfileBadgeShowcase userId={profileData.id} maxDisplay={5} />
        </div>

        <UserProfileDetails profileData={profileData} />
        
        <OrganizationConnections 
          connections={profileData.organizationConnections}
          isEditing={false}
        />
      </div>
    </CardContent>
  );
};

export default ProfileDisplayMode;
