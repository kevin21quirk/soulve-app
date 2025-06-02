
import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type ReportType = 'spam' | 'harassment' | 'inappropriate_content' | 'fake_account' | 'other';

interface ReportContentParams {
  reportedUserId?: string;
  reportedPostId?: string;
  reportType: ReportType;
  reason: string;
}

export const useReportContent = () => {
  const { toast } = useToast();

  const reportContent = useMutation({
    mutationFn: async ({ reportedUserId, reportedPostId, reportType, reason }: ReportContentParams) => {
      const { data, error } = await supabase
        .from('reports')
        .insert({
          reported_user_id: reportedUserId || null,
          reported_post_id: reportedPostId || null,
          report_type: reportType,
          reason,
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
