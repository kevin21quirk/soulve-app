
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

// Define the profile type we expect from the database
interface DatabaseProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar_url?: string;
  banner_url?: string;
  skills?: string[];
  interests?: string[];
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

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
        setError(null);
        
        // Try to fetch profile data from the profiles table with type assertion
        const { data: profile, error: profileError } = await (supabase as any)
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle() as { data: DatabaseProfile | null; error: any };

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          
          // If the table doesn't exist, create a default profile from user data
          if (profileError.code === '42P01') {
            console.log('Profiles table does not exist, using user data for profile');
            const defaultProfile = createDefaultProfile(user);
            setProfileData(defaultProfile);
            setLoading(false);
            return;
          }
          
          setError(profileError.message);
          return;
        }

        // Create profile data object with real user data or defaults
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
        // Fallback to default profile if everything fails
        const defaultProfile = createDefaultProfile(user);
        setProfileData(defaultProfile);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const createDefaultProfile = (user: any): UserProfileData => {
    return {
      id: user.id,
      name: user.user_metadata?.first_name && user.user_metadata?.last_name 
        ? `${user.user_metadata.first_name} ${user.user_metadata.last_name}`
        : user.email?.split('@')[0] || 'User',
      email: user.email || '',
      phone: user.user_metadata?.phone || '',
      location: 'Location not set',
      bio: 'No bio added yet',
      avatar: user.user_metadata?.avatar_url || '',
      banner: '',
      bannerType: null,
      joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        year: 'numeric' 
      }),
      trustScore: 95,
      helpCount: 0,
      skills: [],
      interests: [],
      socialLinks: {
        website: '',
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: ''
      },
      organizationInfo: {
        organizationType: 'individual',
        establishedYear: '',
        registrationNumber: '',
        description: '',
        mission: '',
        vision: ''
      },
      followerCount: 0,
      followingCount: 0,
      postCount: 0,
      isVerified: !!user.email_confirmed_at,
      verificationBadges: user.email_confirmed_at ? ['Email Verified'] : []
    };
  };

  const updateProfile = async (updatedData: UserProfileData) => {
    if (!user) return;

    try {
      // Try to update the profiles table with type assertion
      const { error } = await (supabase as any)
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
        
        // If table doesn't exist, just update local state
        if (error.code === '42P01') {
          console.log('Profiles table does not exist, updating local state only');
          setProfileData(updatedData);
          return;
        }
        
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
