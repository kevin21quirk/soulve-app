
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

  // Transform comments
  const transformedComments: Comment[] = (post.comments || []).map(comment => ({
    id: comment.id,
    author: comment.author,
    avatar: '', // Default empty avatar for comments
    content: comment.content,
    timestamp: comment.created_at || comment.timestamp || new Date().toISOString(),
    likes: comment.likes || 0,
    isLiked: comment.isLiked || false,
    replies: [],
    reactions: [],
    taggedUsers: []
  }));

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
    avatar: avatarUrl,
    title: post.title,
    description: post.content,
    category: post.category as FeedPost['category'],
    timestamp: getRelativeTime(post.created_at),
    location: post.location || 'Location not specified',
    responses: post.interactions?.comment_count || 0,
    likes: post.interactions?.like_count || 0,
    isLiked: post.interactions?.user_liked || false,
    shares: 0, // Not tracked in current schema
    isBookmarked: false, // Not tracked in current schema
    isShared: false, // Not tracked in current schema
    urgency: post.urgency as FeedPost['urgency'] || 'medium',
    tags: post.tags || [],
    visibility: 'public',
    feeling: undefined,
    media: [],
    reactions: [],
    comments: transformedComments,
    taggedUsers: []
  };
};
