import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from '@/hooks/useDebounce';

export interface SearchResult {
  id: string;
  type: 'user' | 'campaign' | 'group' | 'organization' | 'post' | 'opportunity';
  title: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  metadata?: Record<string, any>;
}

export interface SearchResults {
  users: SearchResult[];
  campaigns: SearchResult[];
  groups: SearchResult[];
  organizations: SearchResult[];
  posts: SearchResult[];
  opportunities: SearchResult[];
  totalCount: number;
}

export const useGlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults>({
    users: [],
    campaigns: [],
    groups: [],
    organizations: [],
    posts: [],
    opportunities: [],
    totalCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setResults({
        users: [],
        campaigns: [],
        groups: [],
        organizations: [],
        posts: [],
        opportunities: [],
        totalCount: 0,
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchTerm = `%${searchQuery.trim()}%`;

      // Search users/profiles
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, bio, location')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(10);

      // Search campaigns
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, title, description, featured_image, category')
        .eq('status', 'active')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);

      // Search groups
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('id, name, description, cover_image')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);

      // Search organizations
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, description, avatar_url')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);

      // Search posts
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, content, title, created_at, author_id')
        .or(`content.ilike.${searchTerm},title.ilike.${searchTerm}`)
        .limit(10);

      // Search volunteer opportunities
      const { data: opportunities, error: oppsError } = await supabase
        .from('volunteer_opportunities')
        .select('id, title, description, organization_id')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);

      if (usersError || campaignsError || groupsError || orgsError || postsError || oppsError) {
        throw new Error('Search failed');
      }

      // Transform results
      const userResults: SearchResult[] = (users || []).map(u => ({
        id: u.id,
        type: 'user' as const,
        title: `${u.first_name} ${u.last_name}`,
        subtitle: u.location || undefined,
        description: u.bio || undefined,
        imageUrl: u.avatar_url || undefined,
      }));

      const campaignResults: SearchResult[] = (campaigns || []).map(c => ({
        id: c.id,
        type: 'campaign' as const,
        title: c.title,
        subtitle: c.category,
        description: c.description || undefined,
        imageUrl: c.featured_image || undefined,
      }));

      const groupResults: SearchResult[] = (groups || []).map(g => ({
        id: g.id,
        type: 'group' as const,
        title: g.name,
        description: g.description || undefined,
        imageUrl: g.cover_image || undefined,
      }));

      const orgResults: SearchResult[] = (organizations || []).map(o => ({
        id: o.id,
        type: 'organization' as const,
        title: o.name,
        description: o.description || undefined,
        imageUrl: o.avatar_url || undefined,
      }));

      const postResults: SearchResult[] = (posts || []).map(p => ({
        id: p.id,
        type: 'post' as const,
        title: p.title || 'Post',
        description: p.content?.substring(0, 150) || undefined,
      }));

      const oppResults: SearchResult[] = (opportunities || []).map(o => ({
        id: o.id,
        type: 'opportunity' as const,
        title: o.title,
        description: o.description || undefined,
      }));

      const totalCount = userResults.length + campaignResults.length + 
                        groupResults.length + orgResults.length + 
                        postResults.length + oppResults.length;

      setResults({
        users: userResults,
        campaigns: campaignResults,
        groups: groupResults,
        organizations: orgResults,
        posts: postResults,
        opportunities: oppResults,
        totalCount,
      });
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    performSearch(debouncedQuery);
  }, [debouncedQuery, performSearch]);

  return {
    query,
    setQuery,
    results,
    loading,
    error,
    clearSearch: () => setQuery(''),
  };
};