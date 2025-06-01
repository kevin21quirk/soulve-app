
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SearchFilters {
  location?: string;
  skills?: string[];
  interests?: string[];
  query?: string;
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
}

export const useUserSearch = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState<SearchFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const searchUsers = useCallback(async (): Promise<SearchedUser[]> => {
    if (!user) return [];

    let query = supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, location, bio, skills, interests')
      .neq('id', user.id); // Exclude current user

    // Apply text search filter
    if (filters.query) {
      query = query.or(`first_name.ilike.%${filters.query}%,last_name.ilike.%${filters.query}%,bio.ilike.%${filters.query}%`);
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

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Error searching users:', error);
      throw error;
    }

    return data || [];
  }, [user, filters]);

  const { data: searchResults = [], isLoading, error, refetch } = useQuery({
    queryKey: ['user-search', filters],
    queryFn: searchUsers,
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
    setSearchQuery('');
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    updateFilters({ query });
  }, [updateFilters]);

  // Memoized unique values for filter options
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
    isLoading,
    error,
    filters,
    searchQuery,
    updateFilters,
    clearFilters,
    handleSearch,
    refetch,
    filterOptions
  };
};
