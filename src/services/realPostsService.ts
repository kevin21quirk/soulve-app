
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SocialPost {
  id: string;
  title: string;
  content: string;
  description: string;
  author_id: string;
  author_name: string;
  author_avatar: string;
  category: string;
  urgency: string;
  location: string;
  tags: string[];
  media_urls: string[]; // This is where uploaded media URLs are stored
  visibility: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  status: string;
}

export const usePosts = () => {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      console.log('Fetching posts with media...');
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Raw posts data:', data);

      const transformedPosts = data?.map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        description: post.content,
        author_id: post.author_id,
        author_name: `${post.profiles?.first_name || ''} ${post.profiles?.last_name || ''}`.trim() || 'Anonymous',
        author_avatar: post.profiles?.avatar_url || '',
        category: post.category,
        urgency: post.urgency,
        location: post.location,
        tags: post.tags || [],
        media_urls: post.media_urls || [], // Ensure media_urls are included
        visibility: post.visibility,
        is_active: post.is_active,
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_liked: false,
        is_bookmarked: false,
        status: 'active'
      })) || [];

      console.log('Transformed posts with media:', transformedPosts);
      return transformedPosts;
    },
  });
};

export const usePostInteraction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ postId, interactionType, content }: { 
      postId: string; 
      interactionType: string; 
      content?: string;
    }) => {
      const { data, error } = await supabase
        .from('post_interactions')
        .insert({
          post_id: postId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          interaction_type: interactionType,
          content: content
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
};
