
import { CardContent } from "@/components/ui/card";
import { UserProfileData } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileDisplay from "./UserProfileDisplay";

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
        onAvatarUpdate={() => {}}
      />
      
      <UserProfileDisplay profileData={profileData} />
    </CardContent>
  );
};

export default ProfileDisplayMode;
