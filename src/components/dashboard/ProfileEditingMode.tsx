
import { CardContent } from "@/components/ui/card";
import { UserProfileData, MediaFile } from "./UserProfileTypes";
import UserProfileBanner from "./UserProfileBanner";
import UserProfileHeader from "./UserProfileHeader";
import UserProfileEditForm from "./UserProfileEditForm";
import { useProfileBannerManager } from "./ProfileBannerManager";

interface ProfileEditingModeProps {
  editData: UserProfileData;
  bannerFile: MediaFile | null;
  setBannerFile: (file: MediaFile | null) => void;
  onViewPointsDetails: () => void;
  onAvatarUpdate: (newAvatarUrl: string) => void;
  onInputChange: (field: keyof UserProfileData, value: string) => void;
  onSkillsChange: (value: string) => void;
  onInterestsChange: (value: string) => void;
  onSocialLinksChange: (field: string, value: string) => void;
  onOrganizationInfoChange: (field: string, value: string) => void;
  setEditData: (updater: (prev: UserProfileData) => UserProfileData) => void;
}

const ProfileEditingMode = ({
  editData,
  bannerFile,
  setBannerFile,
  onViewPointsDetails,
  onAvatarUpdate,
  onInputChange,
  onSkillsChange,
  onInterestsChange,
  onSocialLinksChange,
  onOrganizationInfoChange,
  setEditData
}: ProfileEditingModeProps) => {
  const { handleBannerUpload, handleRemoveBanner } = useProfileBannerManager({ 
    setBannerFile, 
    setEditData 
  });

  return (
    <CardContent className="space-y-6">
      <UserProfileBanner
        banner={bannerFile ? bannerFile.preview : editData.banner}
        bannerType={bannerFile ? bannerFile.type : editData.bannerType}
        bannerFile={bannerFile}
        onBannerUpload={handleBannerUpload}
        onRemoveBanner={() => handleRemoveBanner(bannerFile, setEditData)}
        isEditing={true}
      />
      
      <UserProfileHeader 
        profileData={editData} 
        isEditing={true} 
        onViewPointsDetails={onViewPointsDetails}
        onAvatarUpdate={onAvatarUpdate}
      />
      
      <UserProfileEditForm
        editData={editData}
        onInputChange={onInputChange}
        onSkillsChange={onSkillsChange}
        onInterestsChange={onInterestsChange}
        onSocialLinksChange={onSocialLinksChange}
        onOrganizationInfoChange={onOrganizationInfoChange}
      />
    </CardContent>
  );
};

export default ProfileEditingMode;
