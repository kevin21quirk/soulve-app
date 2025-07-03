
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

  // Memoized query function with manual joins
  const fetchPosts = useCallback(async () => {
    if (!user) return;

    try {
      // First, fetch posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select('id, title, content, author_id, category, created_at, urgency, is_active')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        return;
      }

      // Get all unique author IDs
      const authorIds = [...new Set(postsData.map(post => post.author_id))];

      // Fetch profiles for all authors
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url')
        .in('id', authorIds);

      if (profilesError) {
        console.warn('Error fetching profiles:', profilesError);
      }

      // Create a map of profiles for quick lookup
      const profilesMap = new Map();
      if (profilesData) {
        profilesData.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Manually join the data
      const transformedPosts = postsData.map(post => {
        const profile = profilesMap.get(post.author_id);
        
        return {
          ...post,
          author: profile ? {
            first_name: profile.first_name || '',
            last_name: profile.last_name || '',
            avatar_url: profile.avatar_url || ''
          } : undefined
        };
      });

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
