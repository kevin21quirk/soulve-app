
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
}

export interface PostFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  feeling: string;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  allowComments: boolean;
  allowSharing: boolean;
  scheduledFor?: Date;
  // New features
  isLiveVideo?: boolean;
  hasGif?: boolean;
  taggedUsers?: string[];
  hasPoll?: boolean;
  pollOptions?: string[];
  isEvent?: boolean;
  eventDate?: Date;
  eventLocation?: string;
}

// Re-export the constants for backward compatibility
export { FEELINGS, URGENCY_LEVELS, POST_CATEGORIES } from "./post-options/PostOptionsConfig";
