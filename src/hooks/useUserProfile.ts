
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfileData = useCallback(async () => {
    if (!user?.id) {
      setError('User not authenticated');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch profile data
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw new Error(profileError.message);
      }

      // Fetch impact metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (metricsError) {
        console.warn('Metrics fetch error:', metricsError);
      }

      // Fetch user achievements
      const { data: achievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select('*')
        .eq('user_id', user.id);

      if (achievementsError) {
        console.warn('Achievements fetch error:', achievementsError);
      }

      // Transform data to match UserProfileData interface
      const profileData: UserProfileData = {
        id: profile.id,
        name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown User',
        email: user.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar: profile.avatar_url || '',
        banner: profile.banner_url || '',
        bannerType: profile.banner_type || null,
        joinDate: profile.created_at || new Date().toISOString(),
        trustScore: metrics?.trust_score || 50,
        helpCount: metrics?.help_provided_count || 0,
        skills: profile.skills || [],
        interests: profile.interests || [],
        socialLinks: {
          website: profile.website || '',
          facebook: profile.facebook || '',
          twitter: profile.twitter || '',
          instagram: profile.instagram || '',
          linkedin: profile.linkedin || ''
        },
        organizationInfo: {
          organizationType: 'individual',
          establishedYear: '',
          registrationNumber: '',
          description: '',
          mission: '',
          vision: '',
          role: '',
          website: profile.website || ''
        },
        organizationConnections: [],
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        isVerified: false,
        verificationBadges: []
      };

      setProfileData(profileData);
    } catch (error: any) {
      console.error('Error fetching profile data:', error);
      setError(error.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  }, [user?.id, user?.email]);

  const updateProfile = useCallback(async (updatedData: UserProfileData) => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

    setUpdating(true);
    try {
      // Split the name into first and last name
      const nameParts = updatedData.name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: firstName,
          last_name: lastName,
          phone: updatedData.phone,
          location: updatedData.location,
          bio: updatedData.bio,
          avatar_url: updatedData.avatar,
          banner_url: updatedData.banner,
          banner_type: updatedData.bannerType,
          skills: updatedData.skills,
          interests: updatedData.interests,
          website: updatedData.socialLinks?.website || '',
          facebook: updatedData.socialLinks?.facebook || '',
          twitter: updatedData.socialLinks?.twitter || '',
          instagram: updatedData.socialLinks?.instagram || '',
          linkedin: updatedData.socialLinks?.linkedin || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Profile update error:', profileError);
        throw new Error(profileError.message);
      }

      // Update local state
      setProfileData(updatedData);

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setUpdating(false);
    }
  }, [user?.id, toast]);

  // Fetch profile data on mount and when user changes
  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  return {
    profileData,
    loading,
    updating,
    error,
    updateProfile,
    refreshProfile: fetchProfileData
  };
};
