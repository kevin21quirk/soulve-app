import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface DownloadReportParams {
  reportId: string;
  reportName: string;
  htmlContent: string;
}

export const useDownloadESGReport = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ reportId, reportName, htmlContent }: DownloadReportParams) => {
      // Create a Blob from the HTML content
      const blob = new Blob([htmlContent], { type: 'text/html' });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `${reportName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${reportId.slice(0, 8)}.html`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
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
