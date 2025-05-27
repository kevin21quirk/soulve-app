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
  replies?: Comment[];
  reactions?: Reaction[];
}

export interface Reaction {
  type: 'like' | 'love' | 'laugh' | 'angry' | 'sad' | 'wow';
  emoji: string;
  count: number;
  hasReacted: boolean;
}

export interface FeedPost {
  id: string;
  author: string;
  avatar: string;
  title: string;
  description: string;
  category: "help-needed" | "help-offered" | "success-story" | "announcement" | "question" | "recommendation" | "event" | "lost-found";
  timestamp: string;
  location: string;
  responses: number;
  likes: number;
  isLiked: boolean;
  media?: MediaItem[];
  reactions?: Reaction[];
  comments?: Comment[];
  shares: number;
  isBookmarked: boolean;
  isShared: boolean;
  urgency?: 'low' | 'medium' | 'high' | 'urgent';
  feeling?: string;
  tags?: string[];
  visibility?: 'public' | 'friends' | 'private';
}
