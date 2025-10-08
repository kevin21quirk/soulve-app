
export interface FeedPost {
  id: string;
  author: string;
  authorId: string;
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
  isShared: boolean;
  comments?: Comment[];
  reactions?: Reaction[];
  feeling?: string;
  visibility?: string;
  import_source?: string | null;
  external_id?: string | null;
  import_metadata?: {
    sourceAuthor?: string;
    sourceTitle?: string;
    thumbnailUrl?: string;
  } | null;
  imported_at?: string | null;
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
  authorId: string;
  avatar: string;
  content: string;
  timestamp: string;
  likes: number;
  isLiked: boolean;
  parentCommentId?: string;
  editedAt?: string;
  isDeleted: boolean;
  replies?: Comment[];
  isOrganization?: boolean;
  organizationName?: string | null;
}

export interface Reaction {
  type: string;
  emoji: string;
  count: number;
  hasReacted: boolean;
}
