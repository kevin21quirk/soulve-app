
import { useState, useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface RecommendationResult {
  id: string;
  type: 'user' | 'post' | 'campaign';
  title: string;
  description: string;
  relevanceScore: number;
  location?: string;
  tags?: string[];
  avatar?: string;
  metadata: any;
}

export const useEnhancedRecommendations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    location: '',
    interests: [] as string[],
    maxDistance: 50, // km
    minRelevanceScore: 30
  });

  const fetchRecommendations = useCallback(async (): Promise<RecommendationResult[]> => {
    if (!user?.id) return [];

    try {
      // Get user's location and interests for enhanced matching
      const { data: profile } = await supabase
        .from('profiles')
        .select('location, interests, skills')
        .eq('id', user.id)
        .single();

      const userLocation = filters.location || profile?.location || '';
      const userInterests = filters.interests.length > 0 ? filters.interests : (profile?.interests || []);

      // Fetch user recommendations with enhanced scoring
      const { data: userRecs } = await supabase
        .from('profiles')
        .select(`
          id, first_name, last_name, avatar_url, location, bio, 
          skills, interests
        `)
        .neq('id', user.id)
        .limit(10);

      // Fetch relevant posts
      const { data: postRecs } = await supabase
        .from('posts')
        .select(`
          id, title, content, location, tags, category, urgency,
          author_id, created_at
        `)
        .eq('is_active', true)
        .neq('author_id', user.id)
        .limit(10);

      // Fetch active campaigns
      const { data: campaignRecs } = await supabase
        .from('campaigns')
        .select(`
          id, title, description, location, tags, category,
          current_amount, goal_amount, creator_id
        `)
        .in('status', ['active', 'published'])
        .neq('creator_id', user.id)
        .limit(10);

      const recommendations: RecommendationResult[] = [];

      // Process user recommendations with enhanced scoring
      userRecs?.forEach(user => {
        const locationScore = calculateLocationRelevance(userLocation, user.location);
        const interestScore = calculateInterestRelevance(userInterests, user.interests || []);
        const skillScore = calculateSkillRelevance(profile?.skills || [], user.skills || []);
        
        const relevanceScore = Math.round(
          (locationScore * 0.3) + (interestScore * 0.4) + (skillScore * 0.3)
        );

        if (relevanceScore >= filters.minRelevanceScore) {
          recommendations.push({
            id: user.id,
            type: 'user',
            title: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
            description: user.bio || 'Community member',
            relevanceScore,
            location: user.location,
            tags: user.interests,
            avatar: user.avatar_url,
            metadata: {
              skills: user.skills,
              interests: user.interests
            }
          });
        }
      });

      // Process post recommendations
      postRecs?.forEach(post => {
        const locationScore = calculateLocationRelevance(userLocation, post.location);
        const tagScore = calculateTagRelevance(userInterests, post.tags || []);
        const urgencyScore = post.urgency === 'urgent' ? 20 : post.urgency === 'high' ? 15 : 10;
        
        const relevanceScore = Math.round(
          (locationScore * 0.4) + (tagScore * 0.4) + (urgencyScore * 0.2)
        );

        if (relevanceScore >= filters.minRelevanceScore) {
          recommendations.push({
            id: post.id,
            type: 'post',
            title: post.title,
            description: post.content?.substring(0, 100) + '...' || '',
            relevanceScore,
            location: post.location,
            tags: post.tags,
            metadata: {
              category: post.category,
              urgency: post.urgency,
              author_id: post.author_id
            }
          });
        }
      });

      // Process campaign recommendations
      campaignRecs?.forEach(campaign => {
        const locationScore = calculateLocationRelevance(userLocation, campaign.location);
        const tagScore = calculateTagRelevance(userInterests, campaign.tags || []);
        const progressScore = campaign.goal_amount > 0 ? 
          (campaign.current_amount / campaign.goal_amount) * 20 : 0;
        
        const relevanceScore = Math.round(
          (locationScore * 0.3) + (tagScore * 0.5) + (progressScore * 0.2)
        );

        if (relevanceScore >= filters.minRelevanceScore) {
          recommendations.push({
            id: campaign.id,
            type: 'campaign',
            title: campaign.title,
            description: campaign.description?.substring(0, 100) + '...' || '',
            relevanceScore,
            location: campaign.location,
            tags: campaign.tags,
            metadata: {
              progress: campaign.goal_amount > 0 ? 
                (campaign.current_amount / campaign.goal_amount) * 100 : 0,
              category: campaign.category
            }
          });
        }
      });

      // Sort by relevance score
      return recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Failed to load recommendations",
        description: "Please try again later",
        variant: "destructive"
      });
      return [];
    }
  }, [user?.id, filters, toast]);

  const { data: recommendations = [], isLoading, error, refetch } = useQuery({
    queryKey: ['enhanced-recommendations', user?.id, filters],
    queryFn: fetchRecommendations,
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });

  const updateFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    recommendations,
    isLoading,
    error,
    filters,
    updateFilters,
    refetch
  };
};

// Helper functions for relevance scoring
function calculateLocationRelevance(userLocation: string, targetLocation?: string): number {
  if (!userLocation || !targetLocation) return 0;
  
  // Simple string matching - in production, use proper geocoding
  const userLower = userLocation.toLowerCase();
  const targetLower = targetLocation.toLowerCase();
  
  if (userLower === targetLower) return 100;
  if (userLower.includes(targetLower) || targetLower.includes(userLower)) return 70;
  
  // Check for common city/region names
  const userParts = userLower.split(/[,\s]+/);
  const targetParts = targetLower.split(/[,\s]+/);
  
  const commonParts = userParts.filter(part => 
    targetParts.some(tPart => tPart.includes(part) || part.includes(tPart))
  );
  
  return Math.min(50, commonParts.length * 25);
}

function calculateInterestRelevance(userInterests: string[], targetInterests: string[]): number {
  if (!userInterests.length || !targetInterests.length) return 0;
  
  const commonInterests = userInterests.filter(interest =>
    targetInterests.some(tInterest => 
      tInterest.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(tInterest.toLowerCase())
    )
  );
  
  return Math.min(100, (commonInterests.length / userInterests.length) * 100);
}

function calculateSkillRelevance(userSkills: string[], targetSkills: string[]): number {
  if (!userSkills.length || !targetSkills.length) return 0;
  
  const commonSkills = userSkills.filter(skill =>
    targetSkills.some(tSkill => 
      tSkill.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(tSkill.toLowerCase())
    )
  );
  
  return Math.min(100, (commonSkills.length / Math.max(userSkills.length, targetSkills.length)) * 100);
}

function calculateTagRelevance(userInterests: string[], tags: string[]): number {
  if (!userInterests.length || !tags.length) return 0;
  
  const relevantTags = tags.filter(tag =>
    userInterests.some(interest => 
      tag.toLowerCase().includes(interest.toLowerCase()) ||
      interest.toLowerCase().includes(tag.toLowerCase())
    )
  );
  
  return Math.min(100, (relevantTags.length / tags.length) * 100);
}
