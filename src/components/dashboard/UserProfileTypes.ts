
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
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
}
