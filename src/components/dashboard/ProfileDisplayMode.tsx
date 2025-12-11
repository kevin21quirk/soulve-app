import { CardContent } from "@/components/ui/card";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileDetails from "./UserProfileDetails";
import OrganizationConnections from "./profile/OrganizationConnections";
import ProfileBadgeShowcase from "../profile/ProfileBadgeShowcase";

interface ProfileDisplayModeProps {
  profileData: UserProfileData;
  onViewPointsDetails: () => void;
  onPostsClick?: () => void;
}

const ProfileDisplayMode = ({ profileData, onViewPointsDetails, onPostsClick }: ProfileDisplayModeProps) => {
  return (
    <CardContent className="p-0">
      {/* Banner + Header */}
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
      
      {/* Content - Compact sections */}
      <div className="px-6 pb-6 space-y-4">
        {/* Badge Showcase - Inline */}
        <ProfileBadgeShowcase userId={profileData.id} maxDisplay={5} />

        <UserProfileDetails profileData={profileData} onPostsClick={onPostsClick} />
        
        <OrganizationConnections connections={profileData.organizationConnections} />
      </div>
    </CardContent>
  );
};

export default ProfileDisplayMode;

