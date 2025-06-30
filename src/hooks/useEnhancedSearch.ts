
import { useState, useCallback, useMemo } from 'react';
import { useRealSocialFeed } from './useRealSocialFeed';
import { transformSocialPostToFeedPost } from '@/utils/socialPostTransformers';
import { useToast } from '@/hooks/use-toast';

export const useEnhancedSearch = () => {
  const { toast } = useToast();
  const { posts, loading: postsLoading, refreshFeed } = useRealSocialFeed();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'recent' | 'relevant' | 'urgent'>('recent');
  const [loading, setLoading] = useState(false);

  // Transform posts for search
  const transformedPosts = useMemo(() => {
    try {
      return posts.map(post => transformSocialPostToFeedPost(post));
    } catch (error) {
      console.error('Error transforming posts:', error);
      toast({
        title: "Search Error",
        description: "Failed to process search results",
        variant: "destructive"
      });
      return [];
    }
  }, [posts, toast]);

  // Enhanced search with better filtering
  const filteredPosts = useMemo(() => {
    let filtered = [...transformedPosts];

    // Text search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(post => {
        return (
          post.title.toLowerCase().includes(query) ||
          post.description.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query)) ||
          post.location?.toLowerCase().includes(query)
        );
      });
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(post => 
        selectedCategories.includes(post.category)
      );
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(post =>
        selectedTags.some(tag => post.tags.includes(tag))
      );
    }

    // Sort results
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'urgent':
          const urgencyOrder = { urgent: 3, high: 2, medium: 1, low: 0 };
          const aUrgency = urgencyOrder[a.urgency as keyof typeof urgencyOrder] || 0;
          const bUrgency = urgencyOrder[b.urgency as keyof typeof urgencyOrder] || 0;
          return bUrgency - aUrgency;
        
        case 'relevant':
          // Simple relevance based on interactions
          const aRelevance = (a.likes || 0) + (a.comments || 0) + (a.shares || 0);
          const bRelevance = (b.likes || 0) + (b.comments || 0) + (b.shares || 0);
          return bRelevance - aRelevance;
        
        case 'recent':
        default:
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
    });

    return filtered;
  }, [transformedPosts, searchQuery, selectedCategories, selectedTags, sortBy]);

  // Get available categories and tags
  const availableCategories = useMemo(() => {
    const categories = new Set(transformedPosts.map(post => post.category));
    return Array.from(categories).sort();
  }, [transformedPosts]);

  const availableTags = useMemo(() => {
    const tags = new Set(transformedPosts.flatMap(post => post.tags));
    return Array.from(tags).sort();
  }, [transformedPosts]);

  const handleSearch = useCallback(async (query: string) => {
    setLoading(true);
    try {
      setSearchQuery(query);
      // Refresh posts to get latest data
      await refreshFeed();
    } catch (error) {
      console.error('Search error:', error);
      toast({
        title: "Search Failed",
        description: "Please try again",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [refreshFeed, toast]);

  const toggleCategory = useCallback((category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  }, []);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSelectedTags([]);
    setSortBy('recent');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filteredPosts,
    selectedCategories,
    selectedTags,
    sortBy,
    setSortBy,
    loading: loading || postsLoading,
    availableCategories,
    availableTags,
    handleSearch,
    toggleCategory,
    toggleTag,
    clearFilters,
    totalResults: filteredPosts.length,
    hasFilters: searchQuery.trim() !== '' || selectedCategories.length > 0 || selectedTags.length > 0
  };
};
