
import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface OptimizedFeedPost {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  created_at: string;
  urgency: string;
  is_active: boolean;
  author?: {
    first_name: string;
    last_name: string;
    avatar_url: string;
  };
}

export const useOptimizedFeedData = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<OptimizedFeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Memoized query function to prevent recreation
  const fetchPosts = useCallback(async () => {
    if (!user) return;

    try {
      // Optimized query with proper indexing and selective fields
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          title,
          content,
          author_id,
          category,
          created_at,
          urgency,
          is_active,
          profiles!posts_author_id_fkey (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20); // Limit initial load for performance

      if (error) throw error;

      // Transform data efficiently
      const transformedPosts = data?.map(post => ({
        ...post,
        author: post.profiles ? {
          first_name: post.profiles.first_name || '',
          last_name: post.profiles.last_name || '',
          avatar_url: post.profiles.avatar_url || ''
        } : undefined
      })) || [];

      setPosts(transformedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [user]);

  // Optimized refresh function
  const refreshFeed = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      setLoading(true);
      await fetchPosts();
      setLoading(false);
    };

    loadInitialData();
  }, [fetchPosts]);

  // Optimized real-time subscription
  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel('optimized-posts-feed')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'posts',
          filter: 'is_active=eq.true'
        },
        () => {
          // Debounced refresh to avoid too many updates
          const timeoutId = setTimeout(refreshFeed, 500);
          return () => clearTimeout(timeoutId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, refreshFeed]);

  // Memoize return object
  return useMemo(() => ({
    posts,
    loading,
    refreshing,
    refreshFeed
  }), [posts, loading, refreshing, refreshFeed]);
};
