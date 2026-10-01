import { useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { isBlobUrl } from '@/lib/blobUrl';

interface DownloadReportParams {
  reportId: string;
  reportName: string;
  htmlUrl?: string;
  pdfUrl?: string;
  format?: 'html' | 'pdf';
}

export const useDownloadESGReport = () => {
  const { toast } = useToast();
  const { api } = useAuth();

  return useMutation({
    mutationFn: async ({ reportId, reportName, htmlUrl, pdfUrl, format = 'html' }: DownloadReportParams) => {
      const storedRef = format === 'pdf' ? pdfUrl : htmlUrl;

      if (!storedRef) {
        throw new Error('Report URL not available');
      }

      // Blob-backed reports go through the private-document endpoint:
      // Clerk auth → server-side org authorization → presigned GET URL.
      // The endpoint also increments esg_reports.download_count.
      let downloadUrl = storedRef;
      let countedServerSide = false;

      if (isBlobUrl(storedRef)) {
        if (!api) throw new Error('Not authenticated');
        const res = await api.get<{ presignedUrl?: string; legacy?: boolean; path?: string }>(
          `/documents/download?id=${reportId}&type=esg-report&field=${format}`
        );
        if (res.presignedUrl) {
          downloadUrl = res.presignedUrl;
          countedServerSide = true;
        } else if (res.legacy && res.path) {
          const { data } = await supabase.storage
            .from('esg-reports')
            .createSignedUrl(res.path, 60);
          if (!data?.signedUrl) throw new Error('Failed to create download URL');
          downloadUrl = data.signedUrl;
        }
      } else if (!/^https?:\/\//.test(storedRef)) {
        // Legacy Supabase storage path (not a URL at all).
        const { data } = await supabase.storage
          .from('esg-reports')
          .createSignedUrl(storedRef, 60);
        if (!data?.signedUrl) throw new Error('Failed to create download URL');
        downloadUrl = data.signedUrl;
      }

      // Fetch the file
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

      // Increment download count for legacy paths (Blob downloads are
      // counted server-side by the documents endpoint).
      if (!countedServerSide) {
        const { data: reportData } = await supabase
          .from('esg_reports')
          .select('download_count')
          .eq('id', reportId)
          .single();

        if (reportData) {
          await supabase
            .from('esg_reports')
            .update({ download_count: (reportData.download_count || 0) + 1 })
            .eq('id', reportId);
        }
      }

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
