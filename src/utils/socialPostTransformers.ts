
import { FeedPost } from '@/types/feed';

export const transformSocialPostToFeedPost = (socialPost: any): FeedPost => {
  return {
    id: socialPost.id,
    author: socialPost.author_name || 'Anonymous',
    authorId: socialPost.author_id, // Include the author ID for delete functionality
    avatar: socialPost.author_avatar || '',
    timestamp: formatTimestamp(socialPost.created_at),
    title: socialPost.title,
    description: socialPost.content,
    category: socialPost.category,
    urgency: socialPost.urgency || 'medium',
    location: socialPost.location,
    tags: socialPost.tags || [],
    media: transformMediaUrls(socialPost.media_urls || []),
    likes: socialPost.likes_count || 0,
    responses: socialPost.comments_count || 0,
    shares: socialPost.shares_count || 0,
    isLiked: socialPost.is_liked || false,
    isBookmarked: socialPost.is_bookmarked || false,
    comments: []
  };
};

const transformMediaUrls = (mediaUrls: string[]) => {
  return mediaUrls.map((url, index) => ({
    id: `media-${index}`,
    type: url.includes('.mp4') || url.includes('.mov') ? 'video' as const : 'image' as const,
    url,
    filename: `media-${index}`
  }));
};

const formatTimestamp = (timestamp: string) => {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  } catch (error) {
    return 'Unknown time';
  }
};
