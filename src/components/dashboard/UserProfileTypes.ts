
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface OrganizationInfo {
  organizationType?: 'individual' | 'business' | 'charity' | 'community-group' | 'religious-group' | 'social-group';
  establishedYear?: string;
  registrationNumber?: string;
  description?: string;
  mission?: string;
  vision?: string;
}

export interface UserProfileData {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  avatar: string;
  banner: string;
  bannerType: 'image' | 'video' | null;
  joinDate: string;
  trustScore: number;
  helpCount: number;
  skills: string[];
  interests: string[];
  socialLinks: SocialLinks;
  organizationInfo: OrganizationInfo;
  followerCount: number;
  followingCount: number;
  postCount: number;
  isVerified: boolean;
  verificationBadges: string[];
}
