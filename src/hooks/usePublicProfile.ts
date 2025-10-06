
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { mapDatabaseProfileToUserProfile } from './profile/profileUtils';

export const usePublicProfile = (userId: string) => {
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [canView, setCanView] = useState(false);

  useEffect(() => {
    const loadPublicProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Profiles are public by default - everyone can view them
        // In the future, we can add privacy settings to make profiles private
        setCanView(true);

        // Fetch profile data with all related information
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          setError('Profile not found.');
          return;
        }

        // Fetch stats in parallel
        const [
          { data: impactMetrics },
          { count: connectionsCount },
          { data: postsData },
          { data: orgConnections }
        ] = await Promise.all([
          supabase
            .from('impact_metrics')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle(),
          supabase
            .from('connections')
            .select('*', { count: 'exact', head: true })
            .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
            .eq('status', 'accepted'),
          supabase
            .from('posts')
            .select('id')
            .eq('author_id', userId)
            .eq('is_active', true),
          supabase
            .from('organization_members')
            .select(`
              id,
              organization_id,
              role,
              title,
              is_current,
              is_public,
              organizations:organization_id (
                id,
                name
              )
            `)
            .eq('user_id', userId)
            .eq('is_active', true)
        ]);

        // Construct complete user profile data
        const displayName = profile.first_name || profile.last_name 
          ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
          : 'Anonymous User';

        const userProfileData: UserProfileData = {
          id: userId,
          name: displayName,
          email: '', // Don't expose email on public profiles
          phone: profile.phone || '',
          location: profile.location || 'Location not set',
          bio: profile.bio || 'No bio added yet',
          avatar: profile.avatar_url || '',
          banner: profile.banner_url || '',
          bannerType: profile.banner_type as 'image' | 'video' | null || null,
          joinDate: new Date(profile.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          trustScore: impactMetrics?.trust_score || 50,
          helpCount: impactMetrics?.help_provided_count || 0,
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
            vision: ''
          },
          organizationConnections: (orgConnections || []).map((conn: any) => ({
            id: conn.id,
            organizationId: conn.organization_id,
            organizationName: conn.organizations?.name || 'Unknown Organization',
            role: conn.role,
            title: conn.title,
            isCurrent: conn.is_current,
            isPublic: conn.is_public
          })),
          followerCount: connectionsCount || 0,
          followingCount: connectionsCount || 0,
          postCount: postsData?.length || 0,
          isVerified: false, // Can add verification logic later
          verificationBadges: []
        };

        setProfileData(userProfileData);
      } catch (err) {
        console.error('Error loading public profile:', err);
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };

    loadPublicProfile();
  }, [userId, currentUser?.id]);

  return {
    profileData,
    loading,
    error,
    canView
  };
};
