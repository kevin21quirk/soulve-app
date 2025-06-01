
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

// Hook to get posts for the feed with optimized queries
export const usePosts = (category?: string, urgency?: string) => {
  return useQuery({
    queryKey: ['posts', category, urgency],
    queryFn: async () => {
      console.log('Fetching posts...');
      
      // Get posts with basic info
      let query = supabase
        .from('posts')
        .select('*')
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

      console.log(`Fetched ${posts?.length || 0} posts`);

      // Get enhanced data for each post in parallel
      const postsWithInteractions = await Promise.all(
        (posts || []).map(async (post) => {
          const { data: user } = await supabase.auth.getUser();
          
          // Get all required data in parallel for better performance
          const [profileResult, likeCountResult, commentCountResult, userLikeResult] = await Promise.all([
            supabase
              .from('profiles')
              .select('first_name, last_name, avatar_url')
              .eq('id', post.author_id)
              .single(),
            supabase
              .from('post_interactions')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)
              .eq('interaction_type', 'like'),
            supabase
              .from('post_interactions')
              .select('*', { count: 'exact', head: true })
              .eq('post_id', post.id)
              .eq('interaction_type', 'comment'),
            user.user ? supabase
              .from('post_interactions')
              .select('id')
              .eq('post_id', post.id)
              .eq('user_id', user.user.id)
              .eq('interaction_type', 'like')
              .single() : Promise.resolve({ data: null })
          ]);

          return {
            ...post,
            author_profile: profileResult.data,
            interactions: {
              like_count: likeCountResult.count || 0,
              comment_count: commentCountResult.count || 0,
              user_liked: !!userLikeResult.data,
            },
          };
        })
      );

      console.log('Enhanced posts with interaction data');
      return postsWithInteractions;
    },
    staleTime: 1000 * 30, // 30 seconds - posts can be stale for a bit since we have real-time updates
    refetchOnWindowFocus: true,
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
      console.log('Creating new post:', postData);
      
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

      // Create activity log
      await supabase
        .from('user_activities')
        .insert({
          user_id: user.user.id,
          activity_type: 'post_created',
          title: 'New Post Created',
          description: postData.title,
          metadata: { post_id: data.id, category: postData.category }
        });

      console.log('Post created successfully:', data);
      return data;
    },
    onSuccess: () => {
      // Invalidate posts to trigger refetch (real-time will also handle this)
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      toast({
        title: "Post created!",
        description: "Your post is now live and visible to everyone.",
      });
    },
    onError: (error: any) => {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create post.",
        variant: "destructive",
      });
    },
  });
};

// Hook to interact with posts (like, comment) with optimistic updates
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
      console.log(`${interactionType} interaction on post:`, postId);
      
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
          console.log('Post unliked');
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

          // Send notification to post author
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

          console.log('Post liked');
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

        // Send notification to post author
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

        console.log('Comment added');
        return { action: 'commented', data };
      }
    },
    onSuccess: () => {
      // Real-time updates will handle the refresh, but we can also invalidate for immediate feedback
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
    onError: (error: any) => {
      console.error('Interaction error:', error);
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
