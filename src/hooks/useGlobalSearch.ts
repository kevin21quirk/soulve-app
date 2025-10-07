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
    console.log('🔍 [Global Search] Query:', searchQuery);
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      console.log('🔍 [Global Search] Query too short, clearing results');
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
    console.log('🔍 [Global Search] Starting search...');

    try {
      const searchTerm = `%${searchQuery.trim()}%`;
      console.log('🔍 [Global Search] Search term:', searchTerm);

      // Search users/profiles
      console.log('🔍 [Global Search] Searching profiles...');
      const { data: users, error: usersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, avatar_url, bio, location')
        .or(`first_name.ilike.${searchTerm},last_name.ilike.${searchTerm},bio.ilike.${searchTerm}`)
        .limit(10);
      
      console.log('🔍 [Global Search] Users found:', users?.length || 0, 'Error:', usersError);
      if (usersError) console.error('🔍 [Global Search] Users error details:', usersError);

      // Search campaigns
      console.log('🔍 [Global Search] Searching campaigns...');
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('id, title, description, featured_image, category')
        .eq('status', 'active')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);
      console.log('🔍 [Global Search] Campaigns found:', campaigns?.length || 0);

      // Search groups
      console.log('🔍 [Global Search] Searching groups...');
      const { data: groups, error: groupsError } = await supabase
        .from('groups')
        .select('id, name, description, cover_image')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);
      console.log('🔍 [Global Search] Groups found:', groups?.length || 0);

      // Search organizations - skip if RLS issues
      console.log('🔍 [Global Search] Searching organizations...');
      const { data: organizations, error: orgsError } = await supabase
        .from('organizations')
        .select('id, name, description, avatar_url')
        .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);
      
      if (orgsError?.code === '42P17') {
        console.warn('🔍 [Global Search] Organizations search skipped due to RLS recursion');
      } else {
        console.log('🔍 [Global Search] Organizations found:', organizations?.length || 0);
      }

      // Search posts
      console.log('🔍 [Global Search] Searching posts...');
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('id, content, title, created_at, author_id')
        .or(`content.ilike.${searchTerm},title.ilike.${searchTerm}`)
        .limit(10);
      console.log('🔍 [Global Search] Posts found:', posts?.length || 0);

      // Search volunteer opportunities - skip if RLS issues
      console.log('🔍 [Global Search] Searching opportunities...');
      const { data: opportunities, error: oppsError } = await supabase
        .from('volunteer_opportunities')
        .select('id, title, description, organization_id')
        .or(`title.ilike.${searchTerm},description.ilike.${searchTerm}`)
        .limit(10);
      
      if (oppsError?.code === '42P17') {
        console.warn('🔍 [Global Search] Opportunities search skipped due to RLS recursion');
      } else {
        console.log('🔍 [Global Search] Opportunities found:', opportunities?.length || 0);
      }

      // Check if critical searches failed (users, campaigns, groups, posts)
      const criticalErrors = [usersError, campaignsError, groupsError, postsError].filter(Boolean);
      if (criticalErrors.length === 4) {
        console.error('🔍 [Global Search] All critical searches failed');
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

      console.log('🔍 [Global Search] Total results:', totalCount, {
        users: userResults.length,
        campaigns: campaignResults.length,
        groups: groupResults.length,
        organizations: orgResults.length,
        posts: postResults.length,
        opportunities: oppResults.length
      });

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
      console.error('🔍 [Global Search] Error:', err);
      setError('Failed to perform search');
    } finally {
      setLoading(false);
      console.log('🔍 [Global Search] Search complete');
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