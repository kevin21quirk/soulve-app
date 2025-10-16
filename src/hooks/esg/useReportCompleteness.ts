import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface CompletenessData {
  overall: number;
  environmental: number;
  social: number;
  governance: number;
  totalRequests: number;
  completedRequests: number;
  pendingRequests: number;
}

export const useReportCompleteness = (initiativeId: string) => {
  return useQuery({
    queryKey: ['report-completeness', initiativeId],
    queryFn: async (): Promise<CompletenessData> => {
      // Fetch all data requests for this initiative
      const { data: requests, error } = await supabase
        .from('esg_data_requests')
        .select(`
          *,
          indicator:esg_indicators(category),
          contributions:stakeholder_data_contributions(
            id,
            contribution_status,
            verification_status
          )
        `)
        .eq('initiative_id', initiativeId);

      if (error) throw error;

      const totalRequests = requests?.length || 0;
      
      // Count completed requests (have approved contributions)
      const completedRequests = requests?.filter(r => 
        r.contributions?.some((c: any) => 
          c.contribution_status === 'submitted' && 
          c.verification_status === 'verified'
        )
      ).length || 0;

      const pendingRequests = totalRequests - completedRequests;

      // Calculate by category
      const environmental = requests?.filter(r => r.indicator?.category === 'environmental') || [];
      const social = requests?.filter(r => r.indicator?.category === 'social') || [];
      const governance = requests?.filter(r => r.indicator?.category === 'governance') || [];

      const envCompleted = environmental.filter(r => 
        r.contributions?.some((c: any) => 
          c.contribution_status === 'submitted' && 
          c.verification_status === 'verified'
        )
      ).length;

      const socCompleted = social.filter(r => 
        r.contributions?.some((c: any) => 
          c.contribution_status === 'submitted' && 
          c.verification_status === 'verified'
        )
      ).length;

      const govCompleted = governance.filter(r => 
        r.contributions?.some((c: any) => 
          c.contribution_status === 'submitted' && 
          c.verification_status === 'verified'
        )
      ).length;

      const overall = totalRequests > 0 ? (completedRequests / totalRequests) * 100 : 0;
      const envPercent = environmental.length > 0 ? (envCompleted / environmental.length) * 100 : 0;
      const socPercent = social.length > 0 ? (socCompleted / social.length) * 100 : 0;
      const govPercent = governance.length > 0 ? (govCompleted / governance.length) * 100 : 0;

      return {
        overall: Math.round(overall),
        environmental: Math.round(envPercent),
        social: Math.round(socPercent),
        governance: Math.round(govPercent),
        totalRequests,
        completedRequests,
        pendingRequests
      };
    },
    enabled: !!initiativeId
  });
};