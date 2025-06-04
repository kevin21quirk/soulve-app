
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ContentSearchFilters {
  query?: string;
  contentType?: 'all' | 'posts' | 'campaigns';
  category?: string;
  location?: string;
  urgency?: string;
  dateRange?: 'today' | 'week' | 'month' | 'all';
  tags?: string[];
  sortBy?: 'relevance' | 'recent' | 'popular' | 'urgent';
}

interface SearchResult {
  id: string;
  type: 'post' | 'campaign';
  title: string;
  content?: string;
  description?: string;
  author_id: string;
  author_name?: string;
  location?: string;
  category?: string;
  urgency?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
  media_urls?: string[];
  current_amount?: number;
  goal_amount?: number;
  status?: string;
  is_active?: boolean;
}

export const useContentSearch = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<ContentSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const searchContent = useCallback(async (): Promise<SearchResult[]> => {
    if (!filters.query && Object.keys(filters).length <= 1) return [];
    
    setIsSearching(true);

    try {
      const results: SearchResult[] = [];

      // Search posts if needed
      if (filters.contentType === 'all' || filters.contentType === 'posts') {
        let postsQuery = supabase
          .from('posts')
          .select(`
            id,
            title,
            content,
            author_id,
            location,
            category,
            urgency,
            tags,
            created_at,
            updated_at,
            media_urls,
            is_active
          `)
          .eq('is_active', true);

        // Apply text search
        if (filters.query) {
          postsQuery = postsQuery.or(`
            title.ilike.%${filters.query}%,
            content.ilike.%${filters.query}%
          `);
        }

        // Apply category filter
        if (filters.category) {
          postsQuery = postsQuery.eq('category', filters.category);
        }

        // Apply location filter
        if (filters.location) {
          postsQuery = postsQuery.ilike('location', `%${filters.location}%`);
        }

        // Apply urgency filter
        if (filters.urgency) {
          postsQuery = postsQuery.eq('urgency', filters.urgency);
        }

        // Apply tags filter
        if (filters.tags && filters.tags.length > 0) {
          postsQuery = postsQuery.overlaps('tags', filters.tags);
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== 'all') {
          const now = new Date();
          let startDate: Date;
          
          switch (filters.dateRange) {
            case 'today':
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              break;
            case 'week':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            default:
              startDate = new Date(0);
          }
          
          postsQuery = postsQuery.gte('created_at', startDate.toISOString());
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'recent':
            postsQuery = postsQuery.order('created_at', { ascending: false });
            break;
          case 'urgent':
            postsQuery = postsQuery.order('urgency', { ascending: false });
            break;
          default:
            postsQuery = postsQuery.order('created_at', { ascending: false });
        }

        const { data: posts, error: postsError } = await postsQuery.limit(25);

        if (postsError) {
          console.error('Error searching posts:', postsError);
        } else if (posts) {
          results.push(...posts.map(post => ({
            ...post,
            type: 'post' as const,
            content: post.content || undefined,
            description: undefined
          })));
        }
      }

      // Search campaigns if needed
      if (filters.contentType === 'all' || filters.contentType === 'campaigns') {
        let campaignsQuery = supabase
          .from('campaigns')
          .select(`
            id,
            title,
            description,
            creator_id,
            location,
            category,
            urgency,
            tags,
            created_at,
            updated_at,
            current_amount,
            goal_amount,
            status
          `)
          .in('status', ['active', 'published']);

        // Apply text search
        if (filters.query) {
          campaignsQuery = campaignsQuery.or(`
            title.ilike.%${filters.query}%,
            description.ilike.%${filters.query}%
          `);
        }

        // Apply category filter
        if (filters.category) {
          campaignsQuery = campaignsQuery.eq('category', filters.category);
        }

        // Apply location filter
        if (filters.location) {
          campaignsQuery = campaignsQuery.ilike('location', `%${filters.location}%`);
        }

        // Apply urgency filter
        if (filters.urgency) {
          campaignsQuery = campaignsQuery.eq('urgency', filters.urgency);
        }

        // Apply tags filter
        if (filters.tags && filters.tags.length > 0) {
          campaignsQuery = campaignsQuery.overlaps('tags', filters.tags);
        }

        // Apply date range filter
        if (filters.dateRange && filters.dateRange !== 'all') {
          const now = new Date();
          let startDate: Date;
          
          switch (filters.dateRange) {
            case 'today':
              startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
              break;
            case 'week':
              startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              break;
            case 'month':
              startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
              break;
            default:
              startDate = new Date(0);
          }
          
          campaignsQuery = campaignsQuery.gte('created_at', startDate.toISOString());
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'recent':
            campaignsQuery = campaignsQuery.order('created_at', { ascending: false });
            break;
          case 'urgent':
            campaignsQuery = campaignsQuery.order('urgency', { ascending: false });
            break;
          default:
            campaignsQuery = campaignsQuery.order('created_at', { ascending: false });
        }

        const { data: campaigns, error: campaignsError } = await campaignsQuery.limit(25);

        if (campaignsError) {
          console.error('Error searching campaigns:', campaignsError);
        } else if (campaigns) {
          results.push(...campaigns.map(campaign => ({
            ...campaign,
            type: 'campaign' as const,
            author_id: campaign.creator_id,
            content: undefined,
            description: campaign.description || undefined
          })));
        }
      }

      // Sort combined results
      if (filters.sortBy === 'recent') {
        results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      }

      return results;
    } finally {
      setIsSearching(false);
    }
  }, [filters]);

  const { data: searchResults = [], isLoading, error, refetch } = useQuery({
    queryKey: ['content-search', filters],
    queryFn: searchContent,
    enabled: !!user && (!!filters.query || Object.keys(filters).length > 1),
    staleTime: 2 * 60 * 1000,
  });

  const updateFilters = useCallback((newFilters: Partial<ContentSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSearch = useCallback((searchQuery: string, searchFilters?: Partial<ContentSearchFilters>) => {
    setFilters(prev => ({ 
      ...prev, 
      query: searchQuery, 
      ...searchFilters 
    }));
  }, []);

  // Get available filter options from results
  const filterOptions = useMemo(() => {
    const categories = new Set<string>();
    const locations = new Set<string>();
    const allTags = new Set<string>();

    searchResults.forEach(result => {
      if (result.category) categories.add(result.category);
      if (result.location) locations.add(result.location);
      result.tags?.forEach(tag => allTags.add(tag));
    });

    return {
      categories: Array.from(categories),
      locations: Array.from(locations),
      tags: Array.from(allTags)
    };
  }, [searchResults]);

  return {
    searchResults,
    isLoading: isLoading || isSearching,
    error,
    filters,
    updateFilters,
    clearFilters,
    handleSearch,
    refetch,
    filterOptions
  };
};
