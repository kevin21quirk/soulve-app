
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch profile data from the profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError(profileError.message);
          return;
        }

        // Create profile data object with real user data
        const userProfileData: UserProfileData = {
          id: user.id,
          name: profile?.first_name && profile?.last_name 
            ? `${profile.first_name} ${profile.last_name}` 
            : user.email?.split('@')[0] || 'User',
          email: user.email || '',
          phone: profile?.phone || '',
          location: profile?.location || 'Location not set',
          bio: profile?.bio || 'No bio added yet',
          avatar: profile?.avatar_url || '',
          banner: profile?.banner_url || '',
          bannerType: null,
          joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            year: 'numeric' 
          }),
          trustScore: 95, // Default for now
          helpCount: 0, // Default for now
          skills: profile?.skills || [],
          interests: profile?.interests || [],
          socialLinks: {
            website: profile?.website || '',
            facebook: profile?.facebook || '',
            twitter: profile?.twitter || '',
            instagram: profile?.instagram || '',
            linkedin: profile?.linkedin || ''
          },
          organizationInfo: {
            organizationType: 'individual',
            establishedYear: '',
            registrationNumber: '',
            description: '',
            mission: '',
            vision: ''
          },
          followerCount: 0, // Default for now
          followingCount: 0, // Default for now
          postCount: 0, // Default for now
          isVerified: !!user.email_confirmed_at,
          verificationBadges: user.email_confirmed_at ? ['Email Verified'] : []
        };

        setProfileData(userProfileData);
      } catch (err) {
        console.error('Error in fetchProfile:', err);
        setError('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const updateProfile = async (updatedData: UserProfileData) => {
    if (!user) return;

    try {
      // Update the profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          first_name: updatedData.name.split(' ')[0] || '',
          last_name: updatedData.name.split(' ').slice(1).join(' ') || '',
          phone: updatedData.phone,
          location: updatedData.location,
          bio: updatedData.bio,
          avatar_url: updatedData.avatar,
          banner_url: updatedData.banner,
          skills: updatedData.skills,
          interests: updatedData.interests,
          website: updatedData.socialLinks.website,
          facebook: updatedData.socialLinks.facebook,
          twitter: updatedData.socialLinks.twitter,
          instagram: updatedData.socialLinks.instagram,
          linkedin: updatedData.socialLinks.linkedin
        });

      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }

      setProfileData(updatedData);
    } catch (err) {
      console.error('Error in updateProfile:', err);
      throw err;
    }
  };

  return {
    profileData,
    loading,
    error,
    updateProfile
  };
};
