
import { UserProfileData } from '@/components/dashboard/UserProfileTypes';

// Define the profile type we expect from the database
export interface DatabaseProfile {
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

export interface UseUserProfileReturn {
  profileData: UserProfileData | null;
  loading: boolean;
  error: string | null;
  updateProfile: (updatedData: UserProfileData) => Promise<void>;
}
