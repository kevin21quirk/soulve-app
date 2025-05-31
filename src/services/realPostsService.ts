
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface DatabasePost {
  id: string;
  author_id: string;
  title: string;
  content: string;
  category: 'help-needed' | 'help-offered' | 'success-story' | 'announcement' | 'question' | 'recommendation' | 'event' | 'lost-found';
  location?: string;
  urgency: 'low' | 'medium' | 'high' | 'urgent';
  media_urls?: string[];
  tags?: string[];
  visibility: 'public' | 'friends' | 'private';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PostWithProfile extends DatabasePost {
  author_profile?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
  interactions?: {
    like_count: number;
    comment_count: number;
    user_liked: boolean;
  };
}

// Hook to get posts for the feed
export const usePosts = (category?: string, urgency?: string) => {
  return useQuery({
    queryKey: ['posts', category, urgency],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          *,
          author_profile:profiles!posts_author_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('is_active', true)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      if (urgency && urgency !== 'all') {
        query = query.eq('urgency', urgency);
      }

      const { data: posts, error } = await query.limit(50);

      if (error) throw error;

      // Get interaction counts for each post
      const postsWithInteractions = await Promise.all(
        (posts || []).map(async (post) => {
          const { data: user } = await supabase.auth.getUser();
          
          // Get like count
          const { count: likeCount } = await supabase
            .from('post_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('interaction_type', 'like');

          // Get comment count
          const { count: commentCount } = await supabase
            .from('post_interactions')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
            .eq('interaction_type', 'comment');

          // Check if user liked this post
          let userLiked = false;
          if (user.user) {
            const { data: userLike } = await supabase
              .from('post_interactions')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.user.id)
              .eq('interaction_type', 'like')
              .single();
            
            userLiked = !!userLike;
          }

          return {
            ...post,
            interactions: {
              like_count: likeCount || 0,
              comment_count: commentCount || 0,
              user_liked: userLiked,
            },
          };
        })
      );

      return postsWithInteractions;
    },
  });
};

// Hook to create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: {
      title: string;
      content: string;
      category: string;
      urgency?: string;
      location?: string;
      tags?: string[];
      visibility?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('posts')
        .insert({
          author_id: user.user.id,
          title: postData.title,
          content: postData.content,
          category: postData.category,
          urgency: postData.urgency || 'medium',
          location: postData.location,
          tags: postData.tags || [],
          visibility: postData.visibility || 'public',
        })
        .select()
        .single();

      if (error) throw error;

      // Create activity
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.user.id,
          activity_type: 'post_created',
          title: 'New Post Created',
          description: postData.title,
          metadata: { post_id: data.id, category: postData.category }
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post.",
        variant: "destructive",
      });
    },
  });
};

// Hook to interact with posts (like, comment)
export const usePostInteraction = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({
      postId,
      interactionType,
      content,
    }: {
      postId: string;
      interactionType: 'like' | 'comment' | 'share' | 'bookmark';
      content?: string;
    }) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      if (interactionType === 'like') {
        // Check if user already liked this post
        const { data: existingLike } = await supabase
          .from('post_interactions')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.user.id)
          .eq('interaction_type', 'like')
          .single();

        if (existingLike) {
          // Unlike the post
          const { error } = await supabase
            .from('post_interactions')
            .delete()
            .eq('id', existingLike.id);
          
          if (error) throw error;
          return { action: 'unliked' };
        } else {
          // Like the post
          const { data, error } = await supabase
            .from('post_interactions')
            .insert({
              post_id: postId,
              user_id: user.user.id,
              interaction_type: 'like',
            })
            .select()
            .single();

          if (error) throw error;

          // Get post author to send notification
          const { data: post } = await supabase
            .from('posts')
            .select('author_id')
            .eq('id', postId)
            .single();

          if (post && post.author_id !== user.user.id) {
            await supabase
              .from('notifications')
              .insert({
                recipient_id: post.author_id,
                sender_id: user.user.id,
                type: 'post_interaction',
                title: 'Someone liked your post',
                message: 'Your post received a like',
                metadata: { post_id: postId, interaction_type: 'like' }
              });
          }

          return { action: 'liked', data };
        }
      } else if (interactionType === 'comment') {
        const { data, error } = await supabase
          .from('post_interactions')
          .insert({
            post_id: postId,
            user_id: user.user.id,
            interaction_type: 'comment',
            content: content || '',
          })
          .select()
          .single();

        if (error) throw error;

        // Get post author to send notification
        const { data: post } = await supabase
          .from('posts')
          .select('author_id')
          .eq('id', postId)
          .single();

        if (post && post.author_id !== user.user.id) {
          await supabase
            .from('notifications')
            .insert({
              recipient_id: post.author_id,
              sender_id: user.user.id,
              type: 'post_interaction',
              title: 'Someone commented on your post',
              message: content?.substring(0, 50) + (content && content.length > 50 ? '...' : ''),
              metadata: { post_id: postId, interaction_type: 'comment' }
            });
        }

        return { action: 'commented', data };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to interact with post.",
        variant: "destructive",
      });
    },
  });
};

// Hook to get comments for a post
export const usePostComments = (postId: string) => {
  return useQuery({
    queryKey: ['post-comments', postId],
    queryFn: async () => {
      const { data: comments, error } = await supabase
        .from('post_interactions')
        .select(`
          *,
          user_profile:profiles!post_interactions_user_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('post_id', postId)
        .eq('interaction_type', 'comment')
        .order('created_at', { ascending: true });

      if (error) throw error;
      return comments || [];
    },
    enabled: !!postId,
  });
};
