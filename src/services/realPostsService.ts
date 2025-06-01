
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedPost } from '@/types/feed';
import { transformPostToFeedPost } from '@/utils/dataTransformers';

// Types for database interaction
export interface PostWithProfile {
  id: string;
  title: string;
  content: string;
  category: string;
  urgency: string;
  location?: string;
  tags?: string[];
  created_at: string;
  author_profile: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  interactions?: {
    like_count: number;
    comment_count: number;
    user_liked?: boolean;
  };
  comments?: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: string;
    likes: number;
    isLiked: boolean;
    user_id: string;
    created_at: string;
  }>;
}

// Mock data for now - in a real app this would connect to your backend
const mockPostsData: PostWithProfile[] = [
  {
    id: '1',
    title: 'Help needed with grocery shopping',
    content: 'Looking for someone to help with weekly grocery runs for my elderly neighbor.',
    category: 'help-needed',
    urgency: 'medium',
    location: 'Downtown District',
    tags: ['transportation', 'elderly care'],
    created_at: new Date().toISOString(),
    author_profile: {
      first_name: 'Sarah',
      last_name: 'Chen',
      avatar_url: 'https://avatar.vercel.sh/sarah.png'
    },
    interactions: {
      like_count: 12,
      comment_count: 3,
      user_liked: false
    },
    comments: []
  },
  {
    id: '2',
    title: 'Volunteer opportunity at food bank',
    content: 'Join our team distributing meals to families in need every Saturday morning.',
    category: 'help-offered',
    urgency: 'high',
    location: 'Community Center',
    tags: ['volunteer', 'food assistance'],
    created_at: new Date().toISOString(),
    author_profile: {
      first_name: 'Maria',
      last_name: 'Rodriguez',
      avatar_url: 'https://avatar.vercel.sh/maria.png'
    },
    interactions: {
      like_count: 24,
      comment_count: 8,
      user_liked: false
    },
    comments: []
  }
];

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<FeedPost[]> => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Transform PostWithProfile data to FeedPost format
      return mockPostsData.map(transformPostToFeedPost);
    },
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      category: string;
      urgency: string;
      location?: string;
      tags?: string[];
      visibility?: string;
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newPostData: PostWithProfile = {
        id: Date.now().toString(),
        title: postData.title,
        content: postData.content,
        category: postData.category,
        urgency: postData.urgency,
        location: postData.location,
        tags: postData.tags || [],
        created_at: new Date().toISOString(),
        author_profile: {
          first_name: 'You',
          last_name: '',
          avatar_url: 'https://avatar.vercel.sh/user.png'
        },
        interactions: {
          like_count: 0,
          comment_count: 0,
          user_liked: false
        },
        comments: []
      };
      
      // Transform to FeedPost before returning
      return transformPostToFeedPost(newPostData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};

export const usePostInteraction = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      postId: string;
      interactionType: 'like' | 'comment';
      content?: string;
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      console.log('Post interaction:', data);
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
