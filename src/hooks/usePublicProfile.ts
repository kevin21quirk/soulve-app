
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

        // Map to UserProfileData format - profile table has all we need
        const userProfileData = mapDatabaseProfileToUserProfile(
          { 
            id: userId, 
            email: '', 
            created_at: profile.created_at || new Date().toISOString() 
          },
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
