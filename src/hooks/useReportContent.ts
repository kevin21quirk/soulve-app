
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

type ReportType = 'spam' | 'harassment' | 'inappropriate_content' | 'fake_account' | 'other';

interface ReportContentParams {
  reportedUserId?: string;
  reportedPostId?: string;
  reportType: ReportType;
  reason: string;
}

export const useReportContent = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const reportContent = useMutation({
    mutationFn: async ({ reportedUserId, reportedPostId, reportType, reason }: ReportContentParams) => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('content_reports')
        .insert({
          reported_by: user.id,
          content_id: reportedPostId || reportedUserId || '',
          content_type: reportedPostId ? 'post' : 'user',
          content_owner_id: reportedUserId || null,
          reason: reportType,
          details: reason,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for helping keep our community safe. We'll review this report.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error submitting report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    reportContent: reportContent.mutate,
    isReporting: reportContent.isPending,
  };
};
