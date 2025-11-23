import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { SocialPost } from "@/hooks/useRealSocialFeed";
import SocialPostCard from "../SocialPostCard";
import { transformSocialPostToFeedPost } from "@/utils/socialPostTransformers";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const UserPostsTimeline = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading: loading } = useQuery({
    queryKey: ['user-posts', user?.id],
    queryFn: async (): Promise<SocialPost[]> => {
      if (!user?.id) return [];

      // Fetch posts by current user
      const { data: postsData, error } = await supabase
        .from('posts')
        .select('*')
        .eq('author_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user profile for author info
      const { data: profileData } = await supabase
        .from('profiles')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single();

      const authorName = profileData 
        ? `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() || 'You'
        : 'You';

      // Transform posts
      const transformedPosts: SocialPost[] = (postsData || []).map(post => ({
        id: post.id,
        title: post.title,
        content: post.content,
        author_id: post.author_id,
        author_name: authorName,
        author_avatar: profileData?.avatar_url || '',
        category: post.category,
        urgency: post.urgency,
        location: post.location,
        tags: post.tags || [],
        media_urls: post.media_urls || [],
        created_at: post.created_at,
        updated_at: post.updated_at,
        likes_count: 0,
        comments_count: 0,
        shares_count: 0,
        is_liked: false,
        is_bookmarked: false,
        import_source: post.import_source || null,
        external_id: post.external_id || null,
        import_metadata: post.import_metadata ? (post.import_metadata as any) : null,
        imported_at: post.imported_at || null
      }));

      return transformedPosts;
    },
    enabled: !!user?.id,
    staleTime: 0, // Always refetch on invalidation for immediate updates
  });

  const handlePostDeleted = (postId: string) => {
    // Optimistically update cache
    queryClient.setQueryData(['user-posts', user?.id], (oldPosts: SocialPost[] = []) => 
      oldPosts.filter((p) => p.id !== postId)
    );
    // Also invalidate profile to update post count
    queryClient.invalidateQueries({ queryKey: ['user-profile', user?.id] });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Posts & Updates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Your Posts & Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {posts.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
            <p className="text-gray-600">
              Start sharing your journey with the community!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <SocialPostCard
                key={post.id}
                post={transformSocialPostToFeedPost(post)}
                onLike={() => {}}
                onShare={() => {}}
                onBookmark={() => {}}
                onComment={() => {}}
                onPostDeleted={() => handlePostDeleted(post.id)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserPostsTimeline;
