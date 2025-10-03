
import { CardContent } from "@/components/ui/card";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileDetails from "./UserProfileDetails";
import OrganizationConnections from "./profile/OrganizationConnections";

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
