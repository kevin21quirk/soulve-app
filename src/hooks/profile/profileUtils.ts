
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';
import { DatabaseProfile } from './types';

export const createDefaultProfile = (user: any): UserProfileData => {
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
    organizationConnections: [],
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    isVerified: !!user.email_confirmed_at,
    verificationBadges: user.email_confirmed_at ? ['Email Verified'] : []
  };
};

export const mapDatabaseProfileToUserProfile = (user: any, profile?: DatabaseProfile | null): UserProfileData => {
  // If we have a database profile, use it; otherwise use auth metadata
  const displayName = profile?.first_name || profile?.last_name 
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user.user_metadata?.display_name || user.email?.split('@')[0] || 'User';

  return {
    id: user.id,
    name: displayName,
    email: user.email || '',
    phone: profile?.phone || user.user_metadata?.phone || '',
    location: profile?.location || 'Location not set',
    bio: profile?.bio || 'No bio added yet',
    avatar: profile?.avatar_url || user.user_metadata?.avatar_url || '',
    banner: profile?.banner_url || '',
    bannerType: profile?.banner_type as 'image' | 'video' | null || null,
    joinDate: new Date(user.created_at).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    }),
    trustScore: 95,
    helpCount: 0,
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
    organizationConnections: [],
    followerCount: 0,
    followingCount: 0,
    postCount: 0,
    isVerified: !!user.email_confirmed_at,
    verificationBadges: user.email_confirmed_at ? ['Email Verified'] : []
  };
};

export const mapUserProfileToDatabase = (userData: UserProfileData) => {
  return {
    id: userData.id,
    first_name: userData.name.split(' ')[0] || '',
    last_name: userData.name.split(' ').slice(1).join(' ') || '',
    phone: userData.phone,
    location: userData.location,
    bio: userData.bio,
    avatar_url: userData.avatar,
    banner_url: userData.banner,
    banner_type: userData.bannerType,
    skills: userData.skills,
    interests: userData.interests,
    website: userData.socialLinks.website,
    facebook: userData.socialLinks.facebook,
    twitter: userData.socialLinks.twitter,
    instagram: userData.socialLinks.instagram,
    linkedin: userData.socialLinks.linkedin
  };
};
