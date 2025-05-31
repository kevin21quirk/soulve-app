
import { useState, useCallback, useMemo } from "react";
import { FeedPost } from "@/types/feed";

interface SearchFilters {
  categories: string[];
  urgency: string[];
  location: string;
  dateRange: string;
  author: string;
  tags: string[];
  trustScore: number[];
}

interface SearchResult {
  posts: FeedPost[];
  totalCount: number;
  facets: {
    categories: { [key: string]: number };
    locations: { [key: string]: number };
    urgency: { [key: string]: number };
  };
}

export const useAdvancedSearch = (posts: FeedPost[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    categories: [],
    urgency: [],
    location: "",
    dateRange: "all",
    author: "",
    tags: [],
    trustScore: [0, 100],
  });
  const [sortBy, setSortBy] = useState<"relevance" | "date" | "engagement">("relevance");

  // Advanced search with scoring
  const searchResults = useMemo((): SearchResult => {
    let filteredPosts = posts;

    // Text search with scoring
    if (searchQuery) {
      filteredPosts = posts
        .map(post => ({
          ...post,
          _searchScore: calculateSearchScore(post, searchQuery)
        }))
        .filter(post => post._searchScore > 0)
        .sort((a, b) => b._searchScore - a._searchScore);
    }

    // Apply filters
    if (filters.categories.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.categories.includes(post.category)
      );
    }

    if (filters.urgency.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        filters.urgency.includes(post.urgency || 'medium')
      );
    }

    if (filters.location) {
      filteredPosts = filteredPosts.filter(post => 
        post.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.author) {
      filteredPosts = filteredPosts.filter(post => 
        post.author.toLowerCase().includes(filters.author.toLowerCase())
      );
    }

    if (filters.tags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags?.some(tag => 
          filters.tags.some(filterTag => 
            tag.toLowerCase().includes(filterTag.toLowerCase())
          )
        )
      );
    }

    // Date range filtering
    if (filters.dateRange !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case "today":
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
      }
      
      filteredPosts = filteredPosts.filter(post => {
        // Mock date parsing since timestamp is string
        return post.timestamp.includes("min") || post.timestamp.includes("hour") || 
               post.timestamp.includes("day") || post.timestamp === "Just now";
      });
    }

    // Sort results
    switch (sortBy) {
      case "date":
        filteredPosts.sort((a, b) => {
          // Mock date sorting
          const aIsRecent = a.timestamp.includes("min") || a.timestamp.includes("hour") || a.timestamp === "Just now";
          const bIsRecent = b.timestamp.includes("min") || b.timestamp.includes("hour") || b.timestamp === "Just now";
          return bIsRecent ? 1 : aIsRecent ? -1 : 0;
        });
        break;
      case "engagement":
        filteredPosts.sort((a, b) => 
          (b.likes + b.responses + b.shares) - (a.likes + a.responses + a.shares)
        );
        break;
      // "relevance" is already sorted by search score
    }

    // Generate facets
    const facets = {
      categories: generateFacetCounts(filteredPosts, 'category'),
      locations: generateLocationFacets(filteredPosts),
      urgency: generateFacetCounts(filteredPosts, 'urgency'),
    };

    return {
      posts: filteredPosts,
      totalCount: filteredPosts.length,
      facets,
    };
  }, [posts, searchQuery, filters, sortBy]);

  const calculateSearchScore = (post: FeedPost, query: string): number => {
    const queryWords = query.toLowerCase().split(' ');
    let score = 0;

    queryWords.forEach(word => {
      // Title match (highest weight)
      if (post.title.toLowerCase().includes(word)) {
        score += 10;
      }
      
      // Description match
      if (post.description.toLowerCase().includes(word)) {
        score += 5;
      }
      
      // Author match
      if (post.author.toLowerCase().includes(word)) {
        score += 3;
      }
      
      // Location match
      if (post.location.toLowerCase().includes(word)) {
        score += 3;
      }
      
      // Tags match
      if (post.tags?.some(tag => tag.toLowerCase().includes(word))) {
        score += 2;
      }
      
      // Category match
      if (post.category.toLowerCase().includes(word)) {
        score += 2;
      }
    });

    // Boost score for urgent posts
    if (post.urgency === 'urgent') {
      score *= 1.5;
    }

    // Boost score for recent posts
    if (post.timestamp.includes("min") || post.timestamp === "Just now") {
      score *= 1.2;
    }

    return score;
  };

  const generateFacetCounts = (posts: FeedPost[], field: keyof FeedPost) => {
    const counts: { [key: string]: number } = {};
    posts.forEach(post => {
      const value = post[field] as string;
      if (value) {
        counts[value] = (counts[value] || 0) + 1;
      }
    });
    return counts;
  };

  const generateLocationFacets = (posts: FeedPost[]) => {
    const counts: { [key: string]: number } = {};
    posts.forEach(post => {
      // Extract city/area from location
      const location = post.location.split(',')[0].trim();
      counts[location] = (counts[location] || 0) + 1;
    });
    return counts;
  };

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      categories: [],
      urgency: [],
      location: "",
      dateRange: "all",
      author: "",
      tags: [],
      trustScore: [0, 100],
    });
  }, []);

  const addTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags : [...prev.tags, tag]
    }));
  }, []);

  const removeTag = useCallback((tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    updateFilter,
    clearFilters,
    addTag,
    removeTag,
    sortBy,
    setSortBy,
    searchResults,
  };
};
