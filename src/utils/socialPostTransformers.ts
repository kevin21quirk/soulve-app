
import { FeedPost } from "@/types/feed";

export const transformSocialPostToFeedPost = (post: any): FeedPost => {
  // Transform media_urls array to media objects format expected by feed components
  const media = post.media_urls?.map((url: string, index: number) => ({
    id: `${post.id}_media_${index}`,
    type: url.toLowerCase().includes('.mp4') || url.toLowerCase().includes('.mov') || url.toLowerCase().includes('.webm') ? 'video' : 'image',
    url: url,
    filename: url.split('/').pop() || `media_${index}`
  })) || [];

  return {
    id: post.id,
    author: post.author_name || 'Unknown User',
    avatar: post.author_avatar || '',
    title: post.title,
    description: post.content,
    category: post.category as any,
    timestamp: new Date(post.created_at).toLocaleDateString(),
    location: post.location || '',
    responses: post.comments_count || 0,
    likes: post.likes_count || 0,
    shares: post.shares_count || 0,
    isLiked: post.is_liked || false,
    isBookmarked: post.is_bookmarked || false,
    isShared: false,
    urgency: post.urgency as any,
    tags: post.tags || [],
    media: media, // This is the key fix - properly transform media_urls to media objects
    visibility: post.visibility as any,
    reactions: [],
    comments: []
  };
};
