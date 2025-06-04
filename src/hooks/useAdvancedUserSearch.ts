
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AdvancedSearchFilters {
  query?: string;
  location?: string;
  skills?: string[];
  interests?: string[];
  radius?: number; // in kilometers
  sortBy?: 'relevance' | 'distance' | 'trust_score' | 'recent';
  availability?: 'online' | 'offline' | 'any';
}

interface SearchedUser {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  interests?: string[];
  trust_score?: number;
  last_active?: string;
  distance?: number;
}

export const useAdvancedUserSearch = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<AdvancedSearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  const searchUsers = useCallback(async (): Promise<SearchedUser[]> => {
    if (!user) return [];
    
    setIsSearching(true);

    try {
      let query = supabase
        .from('profiles')
        .select(`
          id, 
          first_name, 
          last_name, 
          avatar_url, 
          location, 
          bio, 
          skills, 
          interests
        `)
        .neq('id', user.id);

      // Apply text search filter
      if (filters.query) {
        query = query.or(`
          first_name.ilike.%${filters.query}%,
          last_name.ilike.%${filters.query}%,
          bio.ilike.%${filters.query}%
        `);
      }

      // Apply location filter
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }

      // Apply skills filter
      if (filters.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills);
      }

      // Apply interests filter
      if (filters.interests && filters.interests.length > 0) {
        query = query.overlaps('interests', filters.interests);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'trust_score':
          // Join with impact_metrics for trust score
          query = query.order('created_at', { ascending: false }); // Fallback
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('Error searching users:', error);
        throw error;
      }

      return data || [];
    } finally {
      setIsSearching(false);
    }
  }, [user, filters]);

  const { data: searchResults = [], isLoading, error, refetch } = useQuery({
    queryKey: ['advanced-user-search', filters],
    queryFn: searchUsers,
    enabled: !!user && Object.keys(filters).length > 0,
    staleTime: 5 * 60 * 1000,
  });

  const updateFilters = useCallback((newFilters: Partial<AdvancedSearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const handleSearch = useCallback((searchQuery: string, searchFilters?: Partial<AdvancedSearchFilters>) => {
    setFilters(prev => ({ 
      ...prev, 
      query: searchQuery, 
      ...searchFilters 
    }));
  }, []);

  // Get unique filter options from results
  const filterOptions = useMemo(() => {
    const allSkills = new Set<string>();
    const allInterests = new Set<string>();
    const allLocations = new Set<string>();

    searchResults.forEach(user => {
      user.skills?.forEach(skill => allSkills.add(skill));
      user.interests?.forEach(interest => allInterests.add(interest));
      if (user.location) allLocations.add(user.location);
    });

    return {
      skills: Array.from(allSkills),
      interests: Array.from(allInterests),
      locations: Array.from(allLocations)
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
