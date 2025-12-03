
export interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  size: number;
}

export interface GifData {
  id: string;
  title: string;
  url: string;
  preview: string;
}

export interface PollData {
  question: string;
  options: Array<{ id: string; text: string; votes: number }>;
  allowMultiple: boolean;
  duration: number;
}

export interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees?: number;
  isVirtual: boolean;
  virtualLink?: string;
}

export interface LiveVideoData {
  streamId: string;
  title: string;
  startTime: Date;
  stream?: MediaStream;
}

export interface URLPreviewData {
  url: string;
  title: string | null;
  description: string | null;
  image_url: string | null;
  site_name: string | null;
  favicon: string | null;
}

export interface ImportedContent {
  sourceUrl: string;
  sourcePlatform: string;
  sourceTitle: string;
  sourceAuthor?: string;
  thumbnailUrl?: string;
  importedAt: Date;
}

export interface PostFormData {
  title: string;
  description: string;
  category: string;
  location: string;
  latitude?: number;
  longitude?: number;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  feeling: string;
  tags: string[];
  visibility: 'public' | 'friends' | 'private';
  allowComments: boolean;
  allowSharing: boolean;
  scheduledFor?: Date;
  // Enhanced features
  isLiveVideo?: boolean;
  liveVideoData?: LiveVideoData;
  hasGif?: boolean;
  selectedGif?: GifData;
  taggedUsers?: string[]; // Array of tagged user IDs
  taggedUserIds?: string[]; // Array of tagged user IDs (alternative field name)
  hasPoll?: boolean;
  pollOptions?: string[];
  pollData?: PollData;
  isEvent?: boolean;
  eventData?: EventData;
  eventDate?: Date;
  eventLocation?: string;
  // Media files
  selectedMedia?: MediaFile[];
  // Link preview
  linkPreview?: URLPreviewData;
  // Imported content
  importedContent?: ImportedContent;
}

// Re-export the constants for backward compatibility
export { FEELINGS, URGENCY_LEVELS, POST_CATEGORIES } from "./post-options/PostOptionsConfig";
