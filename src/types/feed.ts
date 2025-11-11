
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
  // Campaign-specific fields
  status?: string;
  goalAmount?: number;
  currentAmount?: number;
  endDate?: string | null;
  campaignCategory?: string;
  currency?: string;
  campaignStats?: {
    donorCount: number;
    recentDonations24h: number;
    recentDonors: any[];
    averageDonation: number;
    progressPercentage: number;
    daysRemaining: number | null;
    isOngoing: boolean;
  };
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
  organizationId?: string;
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
  emoji: string;
  type?: string; // For backward compatibility
  count: number;
  userReacted?: boolean;
  hasReacted?: boolean; // For backward compatibility
  users?: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
}
