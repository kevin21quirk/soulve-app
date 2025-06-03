
import { SocialPost } from '@/hooks/useRealSocialFeed';
import { FeedPost } from '@/types/feed';

export const transformSocialPostToFeedPost = (socialPost: SocialPost): FeedPost => {
  // Calculate relative timestamp
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  };

  return {
    id: socialPost.id,
    author: socialPost.author_name,
    avatar: socialPost.author_avatar,
    title: socialPost.title,
    description: socialPost.content,
    category: socialPost.category as FeedPost['category'],
    timestamp: getRelativeTime(socialPost.created_at),
    location: socialPost.location || 'Location not specified',
    responses: socialPost.comments_count,
    likes: socialPost.likes_count,
    isLiked: socialPost.is_liked,
    shares: socialPost.shares_count,
    isBookmarked: socialPost.is_bookmarked,
    isShared: false,
    urgency: socialPost.urgency as FeedPost['urgency'] || 'medium',
    tags: socialPost.tags,
    visibility: 'public',
    feeling: undefined,
    media: socialPost.media_urls.map(url => ({ type: 'image' as const, url })),
    reactions: [],
    comments: [],
    taggedUsers: []
  };
};
