import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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
  return useQuery({
    queryKey: ['esg', 'ai-recommendations', organizationId],
    queryFn: async () => {
      if (!organizationId) throw new Error('Organization ID required');

      const { data, error } = await supabase.functions.invoke('ai-esg-insights', {
        body: {
          organizationId,
          analysisType: 'recommendations'
        }
      });

      if (error) throw error;

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
    enabled: !!organizationId,
    staleTime: 5 * 60 * 1000, // 5 minutes - recommendations don't change that frequently
    retry: 1
  });
};
