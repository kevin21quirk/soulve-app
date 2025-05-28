
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData, MediaFile } from "../UserProfileTypes";

interface UseProfileEditingProps {
  profileData: UserProfileData;
  onProfileUpdate: (data: UserProfileData) => void;
}

export const useProfileEditing = ({ profileData, onProfileUpdate }: UseProfileEditingProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfileData>(profileData);
  const [bannerFile, setBannerFile] = useState<MediaFile | null>(null);

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = () => {
    let updatedData = { ...editData };
    
    if (bannerFile) {
      updatedData.banner = bannerFile.preview;
      updatedData.bannerType = bannerFile.type;
    }
    
    onProfileUpdate(updatedData);
    setIsEditing(false);
    setBannerFile(null);
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleCancel = () => {
    setEditData(profileData);
    setBannerFile(null);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfileData, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    const updatedData = { ...editData, avatar: newAvatarUrl };
    setEditData(updatedData);
    onProfileUpdate(updatedData);
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
    setEditData(prev => ({ ...prev, skills }));
  };

  const handleInterestsChange = (value: string) => {
    const interests = value.split(',').map(interest => interest.trim()).filter(interest => interest.length > 0);
    setEditData(prev => ({ ...prev, interests }));
  };

  const handleSocialLinksChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [field]: value
      }
    }));
  };

  const handleOrganizationInfoChange = (field: string, value: string) => {
    setEditData(prev => ({
      ...prev,
      organizationInfo: {
        ...prev.organizationInfo,
        [field]: value
      }
    }));
  };

  return {
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
  };
};
