
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
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        email: user.email || '',
        phone: profile.phone || '',
        location: profile.location || '',
        bio: profile.bio || '',
        avatar_url: profile.avatar_url || '',
        banner_url: profile.banner_url || '',
        skills: profile.skills || [],
        interests: profile.interests || [],
        website: profile.website || '',
        social_links: {
          facebook: profile.facebook || '',
          twitter: profile.twitter || '',
          instagram: profile.instagram || '',
          linkedin: profile.linkedin || ''
        },
        trust_score: metrics?.trust_score || 50,
        impact_score: metrics?.impact_score || 0,
        help_provided_count: metrics?.help_provided_count || 0,
        help_received_count: metrics?.help_received_count || 0,
        volunteer_hours: metrics?.volunteer_hours || 0,
        connections_count: metrics?.connections_count || 0,
        achievements: (achievements || []).map(achievement => ({
          id: achievement.achievement_id,
          title: achievement.achievement_id.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          description: `Achievement: ${achievement.achievement_id}`,
          icon: '🏆',
          unlocked_at: achievement.unlocked_at,
          progress: achievement.progress || 0,
          max_progress: achievement.max_progress || 1
        })),
        preferences: {
          notifications: {
            email: true,
            push: true,
            sms: false
          },
          privacy: {
            profile_visibility: 'public',
            show_activity: true,
            show_location: true
          }
        }
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
      // Update profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: updatedData.first_name,
          last_name: updatedData.last_name,
          phone: updatedData.phone,
          location: updatedData.location,
          bio: updatedData.bio,
          avatar_url: updatedData.avatar_url,
          banner_url: updatedData.banner_url,
          skills: updatedData.skills,
          interests: updatedData.interests,
          website: updatedData.website,
          facebook: updatedData.social_links?.facebook || '',
          twitter: updatedData.social_links?.twitter || '',
          instagram: updatedData.social_links?.instagram || '',
          linkedin: updatedData.social_links?.linkedin || '',
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
