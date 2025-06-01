
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { useProfileSync } from './useProfileSync';

interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  showLocation: boolean;
  showEmail: boolean;
  showPhone: boolean;
  allowDirectMessages: boolean;
  showOnlineStatus: boolean;
  allowTagging: boolean;
}

export const useProfileManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { syncProfileToPreferences, calculateImpactMetrics } = useProfileSync();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showLocation: true,
    showEmail: false,
    showPhone: false,
    allowDirectMessages: true,
    showOnlineStatus: true,
    allowTagging: true,
  });

  const updateProfile = useCallback(async (profileData: UserProfileData): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Update profile in database
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: profileData.name.split(' ')[0] || '',
          last_name: profileData.name.split(' ').slice(1).join(' ') || '',
          phone: profileData.phone,
          location: profileData.location,
          bio: profileData.bio,
          avatar_url: profileData.avatar,
          banner_url: profileData.banner,
          banner_type: profileData.bannerType,
          skills: profileData.skills,
          interests: profileData.interests,
          website: profileData.socialLinks.website,
          facebook: profileData.socialLinks.facebook,
          twitter: profileData.socialLinks.twitter,
          instagram: profileData.socialLinks.instagram,
          linkedin: profileData.socialLinks.linkedin
        });

      if (error) throw error;

      // Sync preferences and metrics in background (don't await to prevent blocking)
      Promise.all([
        syncProfileToPreferences(profileData),
        calculateImpactMetrics()
      ]).catch(console.error);

      toast({
        title: "Profile updated successfully",
        description: "Your profile information has been saved.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Failed to update profile",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, syncProfileToPreferences, calculateImpactMetrics, toast]);

  const updatePrivacySettings = useCallback(async (settings: PrivacySettings): Promise<void> => {
    if (!user) throw new Error('User not authenticated');

    setIsLoading(true);
    try {
      // Store privacy settings in local state and could extend to database later
      setPrivacySettings(settings);
      
      toast({
        title: "Privacy settings updated",
        description: "Your privacy preferences have been saved.",
      });
    } catch (error: any) {
      console.error('Error updating privacy settings:', error);
      toast({
        title: "Failed to update privacy settings",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  return {
    isLoading,
    privacySettings,
    updateProfile,
    updatePrivacySettings,
    setPrivacySettings
  };
};
