import { useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export const useUserProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const fetchProfileData = useCallback(async (): Promise<UserProfileData | null> => {
    if (!user?.id) {
      throw new Error('User not authenticated');
    }

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

    // Get real connection count (bidirectional - same for follower/following)
    const { count: connectionsCount } = await supabase
      .from('connections')
      .select('*', { count: 'exact', head: true })
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      .eq('status', 'accepted');

    const followerCount = connectionsCount || 0;
    const followingCount = connectionsCount || 0;

    // Get real post count (only active posts)
    const { count: postCount } = await supabase
      .from('posts')
      .select('*', { count: 'exact', head: true })
      .eq('author_id', user.id)
      .eq('is_active', true);

    // Get organization connections
    const { data: orgConnections } = await supabase
      .rpc('get_user_organizations', { target_user_id: user.id });

    // Transform organization connections to match interface
    const transformedOrgConnections = orgConnections?.map((org: any) => ({
      id: org.organization_id,
      organizationId: org.organization_id,
      organizationName: org.organization_name,
      role: org.role,
      title: org.title || '',
      isCurrent: org.is_current,
      isPublic: true
    })) || [];

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
      bannerType: (profile.banner_type as "video" | "image") || null,
      joinDate: profile.created_at || new Date().toISOString(),
      trustScore: metrics?.trust_score ?? 0,
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
      organizationConnections: transformedOrgConnections,
      followerCount: followerCount || 0,
      followingCount: followingCount || 0,
      postCount: postCount || 0,
      isVerified: (achievements?.length || 0) > 0,
      verificationBadges: achievements?.map(a => a.id) || []
    };

    return profileData;
  }, [user?.id, user?.email]);

  const { data: profileData, isLoading: loading, error } = useQuery({
    queryKey: ['user-profile', user?.id],
    queryFn: fetchProfileData,
    enabled: !!user?.id,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedData: UserProfileData) => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

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

      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated."
      });
    },
    onError: (error: any) => {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const refreshProfile = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
  }, [queryClient, user?.id]);

  return {
    profileData: profileData || null,
    loading,
    updating: updateProfileMutation.isPending,
    error: error ? (error as Error).message : null,
    updateProfile: updateProfileMutation.mutateAsync,
    refreshProfile
  };
};
