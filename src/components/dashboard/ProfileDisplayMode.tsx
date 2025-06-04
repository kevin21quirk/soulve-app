
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
    <CardContent className="space-y-6">
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
      
      <UserProfileDetails profileData={profileData} />
      
      <OrganizationConnections 
        connections={profileData.organizationConnections}
        isEditing={false}
      />
    </CardContent>
  );
};

export default ProfileDisplayMode;
