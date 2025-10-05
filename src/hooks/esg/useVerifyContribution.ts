import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ESG_EXTENDED_QUERY_KEYS } from '@/services/esgService';

interface VerifyContributionParams {
  contributionId: string;
  status: 'approved' | 'rejected' | 'needs_revision';
  notes?: string;
  revisionNotes?: string;
}

export const useVerifyContribution = (organizationId: string) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ contributionId, status, notes, revisionNotes }: VerifyContributionParams) => {
      const { data, error } = await supabase
        .from('stakeholder_data_contributions')
        .update({
          verification_status: status,
          verified_by: (await supabase.auth.getUser()).data.user?.id,
          verified_at: new Date().toISOString(),
          verification_notes: notes,
          revision_requested_notes: status === 'needs_revision' ? revisionNotes : null,
        })
        .eq('id', contributionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ESG_EXTENDED_QUERY_KEYS.STAKEHOLDER_CONTRIBUTIONS(organizationId) 
      });
      
      // Note: Email notifications can be enabled by integrating with the send-esg-notification edge function
      // This requires proper user email lookup and RESEND_API_KEY configuration
      
      const statusMessages = {
        approved: 'Contribution approved successfully',
        rejected: 'Contribution rejected',
        needs_revision: 'Revision requested - contributor will be notified'
      };
      
      toast({
        title: 'Verification Complete',
        description: statusMessages[variables.status],
      });
    },
    onError: (error) => {
      toast({
        title: 'Verification Failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });
};

export const useVerificationAuditLog = (contributionId: string) => {
  return useQuery({
    queryKey: ['esg', 'verification-audit', contributionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_verification_audit_log')
        .select('*, performed_by_profile:profiles!esg_verification_audit_log_performed_by_fkey(first_name, last_name, avatar_url)')
        .eq('contribution_id', contributionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!contributionId,
  });
};
