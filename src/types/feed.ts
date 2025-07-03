
export interface FeedPost {
  id: string;
  author: string;
  authorId?: string; // Make sure this field exists
  avatar: string;
  timestamp: string;
  title: string;
  description: string;
  category: string;
  urgency: string;
  location?: string;
  tags?: string[];
  media?: MediaItem[];
  likes: number;
  responses: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  comments?: Comment[];
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  filename: string;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
}
