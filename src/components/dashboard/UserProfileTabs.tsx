
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { UserProfileData } from "./UserProfileTypes";
import { useProfileEditing } from "./hooks/useProfileEditing";
import ProfileActions from "./ProfileActions";
import ProfileEditingMode from "./ProfileEditingMode";
import ProfileDisplayMode from "./ProfileDisplayMode";

interface UserProfileTabsProps {
  profileData: UserProfileData;
  onProfileUpdate: (data: UserProfileData) => void;
  onViewPointsDetails: () => void;
  onPostsClick?: () => void;
}

const UserProfileTabs = ({ 
  profileData, 
  onProfileUpdate, 
  onViewPointsDetails,
  onPostsClick 
}: UserProfileTabsProps) => {
  const {
    isEditing,
    editData,
    bannerFile,
    setBannerFile,
    handleEdit,
    handleSave,
    handleCancel,
    handleInputChange,
    handleAvatarUpdate,
    handleSkillsChange,
    handleInterestsChange,
    handleSocialLinksChange,
    handleOrganizationInfoChange
  } = useProfileEditing({ profileData, onProfileUpdate });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
            {isEditing ? "Edit Profile" : "Profile"}
          </CardTitle>
          <ProfileActions
            isEditing={isEditing}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
          />
        </div>
      </CardHeader>
      
      {isEditing ? (
        <ProfileEditingMode
          editData={editData}
          bannerFile={bannerFile}
          setBannerFile={setBannerFile}
          onViewPointsDetails={onViewPointsDetails}
          onAvatarUpdate={handleAvatarUpdate}
          onInputChange={handleInputChange}
          onSkillsChange={handleSkillsChange}
          onInterestsChange={handleInterestsChange}
          onSocialLinksChange={handleSocialLinksChange}
          onOrganizationInfoChange={handleOrganizationInfoChange}
          setEditData={() => {}} // This will be handled by the hook
        />
      ) : (
        <ProfileDisplayMode
          profileData={profileData}
          onViewPointsDetails={onViewPointsDetails}
          onPostsClick={onPostsClick}
        />
      )}
    </Card>
  );
};

export default UserProfileTabs;
