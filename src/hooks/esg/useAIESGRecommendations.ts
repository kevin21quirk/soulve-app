import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

export interface AIESGRecommendation {
  id: string;
  title: string;
  recommendation_type: 'efficiency' | 'best_practice' | 'risk_mitigation' | 'compliance';
  priority_score: number;
  description: string;
  implementation_effort: 'low' | 'medium' | 'high';
  potential_impact: string;
  status: 'new' | 'in_progress' | 'completed';
}

export const useAIESGRecommendations = (organizationId: string | undefined) => {
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  const query = useQuery({
    queryKey: ['esg', 'ai-recommendations', organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID required');
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase.functions.invoke('ai-esg-insights', {
        body: {
          organizationId,
          analysisType: 'recommendations'
        }
      });

      if (error) {
        // Handle specific error cases
        if (error.message?.includes('Rate limit exceeded')) {
          throw new Error('AI_RATE_LIMIT');
        }
        if (error.message?.includes('credits depleted')) {
          throw new Error('AI_CREDITS_DEPLETED');
        }
        if (error.message?.includes('Unauthorized')) {
          throw new Error('UNAUTHORIZED');
        }
        throw error;
      }

      // Parse the AI response - it should return JSON array
      try {
        const insights = data.insights;
        // Try to extract JSON from markdown code blocks if present
        const jsonMatch = insights.match(/```json\s*([\s\S]*?)\s*```/) || 
                         insights.match(/\[[\s\S]*\]/);
        
        if (jsonMatch) {
          const jsonStr = jsonMatch[1] || jsonMatch[0];
          const recommendations = JSON.parse(jsonStr);
          
          // Add unique IDs and ensure proper typing
          return recommendations.map((rec: any, index: number) => ({
            ...rec,
            id: `ai-rec-${Date.now()}-${index}`,
            status: rec.status || 'new'
          })) as AIESGRecommendation[];
        }
        
        // Fallback: return empty array if parsing fails
        console.warn('Could not parse AI recommendations from response:', insights);
        return [];
      } catch (parseError) {
        console.error('Error parsing AI recommendations:', parseError);
        return [];
      }
    },
    enabled: !!organizationId && !!user && !loading, // Wait for auth to complete
    staleTime: 5 * 60 * 1000, // 5 minutes - recommendations don't change that frequently
    retry: (failureCount, error: any) => {
      // Don't retry on auth or rate limit errors
      if (error.message === 'UNAUTHORIZED' || error.message === 'AI_RATE_LIMIT' || error.message === 'AI_CREDITS_DEPLETED') {
        return false;
      }
      return failureCount < 1;
    }
  });

  // Show user-friendly error toasts
  useEffect(() => {
    if (query.error) {
      const errorMessage = (query.error as Error).message;
      
      if (errorMessage === 'AI_RATE_LIMIT') {
        toast({
          title: "Rate Limit Reached",
          description: "You've made too many AI requests. Please wait an hour and try again.",
          variant: "destructive",
        });
      } else if (errorMessage === 'AI_CREDITS_DEPLETED') {
        toast({
          title: "AI Credits Depleted",
          description: "Your AI usage credits have been exhausted. Please add more credits to continue.",
          variant: "destructive",
        });
      } else if (errorMessage === 'UNAUTHORIZED') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access this organization's data.",
          variant: "destructive",
        });
      }
    }
  }, [query.error, toast]);

  return query;
};
