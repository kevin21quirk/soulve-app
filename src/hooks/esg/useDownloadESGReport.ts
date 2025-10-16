import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DownloadReportParams {
  reportId: string;
  reportName: string;
  htmlUrl?: string;
  pdfUrl?: string;
  format?: 'html' | 'pdf';
}

export const useDownloadESGReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reportId, reportName, htmlUrl, pdfUrl, format = 'html' }: DownloadReportParams) => {
      const downloadUrl = format === 'pdf' ? pdfUrl : htmlUrl;
      
      if (!downloadUrl) {
        throw new Error('Report URL not available');
      }

      // Fetch the file from storage
      const response = await fetch(downloadUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      // Create download link
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${reportId.slice(0, 8)}.${format}`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Increment download count
      await supabase.rpc('increment_report_download', { report_id: reportId });
      
      return { success: true };
    },
    onSuccess: () => {
      toast({
        title: "Download Started",
        description: "Your ESG report is being downloaded",
      });
    },
    onError: (error) => {
      console.error('Error downloading report:', error);
      toast({
        title: "Download Failed",
        description: "Failed to download the ESG report",
        variant: "destructive"
      });
    }
  });
};
