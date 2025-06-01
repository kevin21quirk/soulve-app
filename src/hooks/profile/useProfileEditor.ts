
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export interface ProfileEditState {
  isEditing: boolean;
  hasUnsavedChanges: boolean;
  isSaving: boolean;
}

export const useProfileEditor = (
  profileData: UserProfileData,
  onSave: (data: UserProfileData) => Promise<void>
) => {
  const { toast } = useToast();
  const [editState, setEditState] = useState<ProfileEditState>({
    isEditing: false,
    hasUnsavedChanges: false,
    isSaving: false
  });
  const [editData, setEditData] = useState<UserProfileData>(profileData);

  const startEditing = () => {
    setEditData(profileData);
    setEditState(prev => ({ ...prev, isEditing: true, hasUnsavedChanges: false }));
  };

  const cancelEditing = () => {
    setEditData(profileData);
    setEditState({ isEditing: false, hasUnsavedChanges: false, isSaving: false });
  };

  const updateField = (field: keyof UserProfileData, value: any) => {
    setEditData(prev => ({ ...prev, [field]: value }));
    setEditState(prev => ({ ...prev, hasUnsavedChanges: true }));
  };

  const addSkill = (skill: string) => {
    if (skill.trim() && !editData.skills.includes(skill.trim())) {
      const newSkills = [...editData.skills, skill.trim()];
      updateField('skills', newSkills);
    }
  };

  const removeSkill = (skill: string) => {
    const newSkills = editData.skills.filter(s => s !== skill);
    updateField('skills', newSkills);
  };

  const addInterest = (interest: string) => {
    if (interest.trim() && !editData.interests.includes(interest.trim())) {
      const newInterests = [...editData.interests, interest.trim()];
      updateField('interests', newInterests);
    }
  };

  const removeInterest = (interest: string) => {
    const newInterests = editData.interests.filter(i => i !== interest);
    updateField('interests', newInterests);
  };

  const updateSocialLink = (platform: string, url: string) => {
    const newSocialLinks = { ...editData.socialLinks, [platform]: url };
    updateField('socialLinks', newSocialLinks);
  };

  const saveChanges = async () => {
    setEditState(prev => ({ ...prev, isSaving: true }));
    
    try {
      await onSave(editData);
      setEditState({ isEditing: false, hasUnsavedChanges: false, isSaving: false });
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      setEditState(prev => ({ ...prev, isSaving: false }));
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };

  return {
    editState,
    editData,
    startEditing,
    cancelEditing,
    updateField,
    addSkill,
    removeSkill,
    addInterest,
    removeInterest,
    updateSocialLink,
    saveChanges
  };
};
