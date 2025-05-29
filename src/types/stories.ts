
export interface Story {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  timestamp: string;
  duration: number; // in seconds
  isViewed: boolean;
  viewCount: number;
  location?: string;
  category?: 'help-needed' | 'help-offered' | 'success-story' | 'announcement' | 'update';
}

export interface StoryGroup {
  userId: string;
  username: string;
  avatar: string;
  stories: Story[];
  hasUnviewedStories: boolean;
  isOwn: boolean;
}
