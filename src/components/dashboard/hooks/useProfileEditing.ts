
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { UserProfileData, MediaFile } from "../UserProfileTypes";
import { useProfileBannerManager } from "../ProfileBannerManager";

interface UseProfileEditingProps {
  profileData: UserProfileData;
  onProfileUpdate: (data: UserProfileData) => void;
}

export const useProfileEditing = ({ profileData, onProfileUpdate }: UseProfileEditingProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UserProfileData>(profileData);
  const [bannerFile, setBannerFile] = useState<MediaFile | null>(null);

  const { uploadBannerToStorage } = useProfileBannerManager({ 
    setBannerFile, 
    setEditData 
  });

  const handleEdit = () => {
    setEditData(profileData);
    setIsEditing(true);
  };

  const handleSave = async () => {
    let updatedData = { ...editData };
    
    // If there's a new banner file, upload it to storage
    if (bannerFile && user) {
      const uploadedUrl = await uploadBannerToStorage(bannerFile.file, user.id);
      if (uploadedUrl) {
        updatedData.banner = uploadedUrl;
        updatedData.bannerType = bannerFile.type;
      } else {
        toast({
          title: "Upload failed",
          description: "Failed to upload banner. Please try again.",
          variant: "destructive"
        });
        return;
      }
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
