
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
  onPostsClick?: () => void;
}

const ProfileDisplayMode = ({ profileData, onViewPointsDetails, onPostsClick }: ProfileDisplayModeProps) => {
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
          onPostsClick={onPostsClick}
        />
      </div>
      
      {/* Details sections with spacing */}
      <div className="px-6 space-y-6 pb-6">
        {/* Badge Showcase */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#0ce4af]" />
            <h3 className="text-lg font-semibold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">Badges & Recognition</h3>
          </div>
          <ProfileBadgeShowcase userId={profileData.id} maxDisplay={5} />
        </div>

        <UserProfileDetails profileData={profileData} onPostsClick={onPostsClick} />
        
        <OrganizationConnections 
          connections={profileData.organizationConnections}
          isEditing={false}
        />
      </div>
    </CardContent>
  );
};

export default ProfileDisplayMode;
