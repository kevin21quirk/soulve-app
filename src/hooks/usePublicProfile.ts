
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

        // Check if we can view this profile (connection status or public)
        let hasAccess = false;
        
        if (currentUser?.id === userId) {
          // Own profile
          hasAccess = true;
        } else if (currentUser?.id) {
          // Check if connected
          const { data: connection } = await supabase
            .from('connections')
            .select('status')
            .or(`and(requester_id.eq.${currentUser.id},addressee_id.eq.${userId}),and(requester_id.eq.${userId},addressee_id.eq.${currentUser.id})`)
            .eq('status', 'accepted')
            .maybeSingle();
          
          hasAccess = !!connection;
        } else {
          // Anonymous access to public profiles
          hasAccess = true;
        }

        setCanView(hasAccess);

        if (!hasAccess) {
          setError('Profile is private or you need to be connected to view it.');
          return;
        }

        // Fetch profile data
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

        // Get user data from auth for join date and email
        const { data: { user }, error: userError } = await supabase.auth.admin.getUserById(userId);
        
        if (userError && userError.message !== 'User not found') {
          console.warn('Could not fetch user auth data:', userError);
        }

        // Map to UserProfileData format
        const userProfileData = mapDatabaseProfileToUserProfile(
          user || { id: userId, email: '', created_at: new Date().toISOString() },
          profile
        );

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
