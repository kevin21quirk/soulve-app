import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ESG_EXTENDED_QUERY_KEYS } from "@/services/esgService";
import { useDownloadESGReport } from "@/hooks/esg/useDownloadESGReport";
import { format } from "date-fns";
import GenerateReportButton from "./GenerateReportButton";

interface ESGReportsPanelProps {
  organizationId: string;
}

const ESGReportsPanel = ({ organizationId }: ESGReportsPanelProps) => {
  const downloadReport = useDownloadESGReport();

  const { data: reports, isLoading } = useQuery({
    queryKey: ESG_EXTENDED_QUERY_KEYS.ESG_REPORTS(organizationId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('esg_reports')
        .select('*')
        .eq('organization_id', organizationId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'draft': return <Clock className="h-4 w-4" />;
      case 'under_review': return <AlertCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleDownload = (report: any) => {
    downloadReport.mutate({
      reportId: report.id,
      reportName: report.report_name,
      htmlContent: report.generated_content || '<html><body><h1>Report content not available</h1></body></html>'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-centre">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-centre justify-between">
        <div>
          <h2 className="text-2xl font-bold">ESG Reports</h2>
          <p className="text-muted-foreground mt-1">
            Download and manage your organisation's ESG reports
          </p>
        </div>
        <div className="flex items-centre gap-3">
          <Badge variant="soulve">
            {reports?.length || 0} Reports
          </Badge>
          <GenerateReportButton organizationId={organizationId} />
        </div>
      </div>

      {reports && reports.length > 0 ? (
        <div className="grid gap-4">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <CardTitle className="text-lg">{report.report_name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reporting Period: {report.reporting_period_start} to {report.reporting_period_end}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(report.status)}>
                    <span className="flex items-centre gap-1">
                      {getStatusIcon(report.status)}
                      {report.status.replace('_', ' ')}
                    </span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-centre justify-between">
                  <div className="text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 inline mr-1" />
                    Generated: {format(new Date(report.created_at), 'PPP')}
                  </div>
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleDownload(report)}
                    disabled={!report.generated_content || downloadReport.isPending}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-centre">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Reports Yet</h3>
            <p className="text-muted-foreground">
              Generate your first ESG report to get started
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ESGReportsPanel;
