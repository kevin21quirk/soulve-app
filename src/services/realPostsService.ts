
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
  import_source?: string | null;
  external_id?: string | null;
  import_metadata?: {
    sourceAuthor?: string;
    sourceTitle?: string;
  } | null;
  imported_at?: string | null;
}

export interface PostWithProfile extends SocialPost {
  author_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
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

      const transformedPosts = data?.map(post => {
        // Handle the profiles relationship correctly
        const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
        
        // Type cast to access new import fields until Supabase types are regenerated
        const postData = post as any;
        
        return {
          id: post.id,
          title: post.title,
          content: post.content,
          description: post.content,
          author_id: post.author_id,
          author_name: profile ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Anonymous' : 'Anonymous',
          author_avatar: profile?.avatar_url || '',
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
          status: 'active',
          import_source: postData.import_source || null,
          external_id: postData.external_id || null,
          import_metadata: postData.import_metadata || null,
          imported_at: postData.imported_at || null
        };
      }) || [];

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
