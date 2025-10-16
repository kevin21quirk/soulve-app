import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface GenerateReportParams {
  organizationId: string;
  reportType: string;
  reportName?: string;
  frameworkVersion?: string;
  reportingPeriodStart?: string;
  reportingPeriodEnd?: string;
  executiveSummary?: string;
  selectedSections?: string[];
}

export const useGenerateESGReport = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: GenerateReportParams) => {
      const { data, error } = await supabase.functions.invoke('generate-esg-report', {
        body: {
          organizationId: params.organizationId,
          reportName: params.reportName || `ESG Report ${new Date().toLocaleDateString()}`,
          reportType: params.reportType || 'sustainability',
          frameworkVersion: params.frameworkVersion || 'GRI 2021',
          reportingPeriodStart: params.reportingPeriodStart || new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0],
          reportingPeriodEnd: params.reportingPeriodEnd || new Date().toISOString().split('T')[0],
          executiveSummary: params.executiveSummary || '',
          selectedSections: params.selectedSections || ['environmental', 'social', 'governance']
        }
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['esg-reports'] });
      toast({
        title: "Report Generated",
        description: "Your ESG report has been successfully generated",
      });
    },
    onError: (error) => {
      console.error('Error generating report:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate ESG report. Please try again.",
        variant: "destructive"
      });
    }
  });
};