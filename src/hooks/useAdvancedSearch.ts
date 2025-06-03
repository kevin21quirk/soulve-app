
import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from '@/hooks/use-debounce';

export interface SearchFilters {
  category?: string;
  location?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  tags?: string[];
  author?: string;
  contentType?: 'all' | 'posts' | 'messages' | 'campaigns';
}

export interface SearchResult {
  id: string;
  type: 'post' | 'message' | 'campaign' | 'user';
  title: string;
  content: string;
  author: string;
  timestamp: string;
  highlights: string[];
  relevanceScore: number;
}

export const useAdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string, searchFilters: SearchFilters) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);

    // Simulate search API call
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock search results
    const mockResults: SearchResult[] = [
      {
        id: '1',
        type: 'post',
        title: 'Help needed with moving',
        content: 'Looking for help to move furniture this weekend...',
        author: 'John Doe',
        timestamp: '2 hours ago',
        highlights: [searchQuery],
        relevanceScore: 0.95
      },
      {
        id: '2',
        type: 'campaign',
        title: 'Food Drive Campaign',
        content: 'Organizing a food drive for local families...',
        author: 'Jane Smith',
        timestamp: '1 day ago',
        highlights: [searchQuery],
        relevanceScore: 0.87
      }
    ].filter(result => 
      result.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      result.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(mockResults);
    setIsSearching(false);
  }, []);

  const generateSuggestions = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    // Mock suggestions
    const mockSuggestions = [
      'help with moving',
      'food donation',
      'community support',
      'volunteer opportunities',
      'emergency assistance'
    ].filter(suggestion => 
      suggestion.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setSuggestions(mockSuggestions);
  }, []);

  // Perform search when debounced query changes
  useMemo(() => {
    if (debouncedQuery) {
      performSearch(debouncedQuery, filters);
      generateSuggestions(debouncedQuery);
    } else {
      setResults([]);
      setSuggestions([]);
    }
  }, [debouncedQuery, filters, performSearch, generateSuggestions]);

  const updateFilters = useCallback((newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    query,
    setQuery,
    filters,
    updateFilters,
    clearFilters,
    results,
    suggestions,
    isSearching,
    performSearch
  };
};
