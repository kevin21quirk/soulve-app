
import { FeedPost, Comment } from "@/types/feed";
import { PostWithProfile } from "@/services/realPostsService";

export const transformPostToFeedPost = (post: PostWithProfile): FeedPost => {
  // Extract author name from profile
  let authorName = 'Anonymous';
  if (post.author_profile && typeof post.author_profile === 'object') {
    const profile = post.author_profile as any;
    if ('first_name' in profile || 'last_name' in profile) {
      authorName = `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous';
    }
  }

  // Extract avatar URL from profile
  let avatarUrl = '';
  if (post.author_profile && typeof post.author_profile === 'object') {
    const profile = post.author_profile as any;
    if ('avatar_url' in profile) {
      avatarUrl = profile.avatar_url || '';
    }
  }

  // Transform media_urls to media objects format
  const media = post.media_urls?.map((url: string, index: number) => ({
    id: `${post.id}_media_${index}`,
    type: url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.mov') || url.toLowerCase().includes('.webm') ? 'video' as const : 'image' as const,
    url: url,
    filename: url.split('/').pop() || `media_${index}`
  })) || [];

  // Transform comments
  const transformedComments: Comment[] = [];

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
    id: post.id,
    author: authorName,
    authorId: post.author_id,
    avatar: avatarUrl,
    title: post.title,
    description: post.content,
    category: post.category as FeedPost['category'],
    timestamp: getRelativeTime(post.created_at),
    location: post.location || 'Location not specified',
    responses: post.comments_count || 0,
    likes: post.likes_count || 0,
    isLiked: post.is_liked || false,
    shares: post.shares_count || 0,
    isBookmarked: post.is_bookmarked || false,
    isShared: false,
    urgency: post.urgency as FeedPost['urgency'] || 'medium',
    tags: post.tags || [],
    visibility: 'public',
    feeling: undefined,
    media: media,
    reactions: [],
    comments: transformedComments
  };
};
