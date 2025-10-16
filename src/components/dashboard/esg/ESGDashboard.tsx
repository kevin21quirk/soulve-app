import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Settings, Download, RefreshCw, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  useESGScore, 
  useESGComplianceStatus, 
  useCarbonFootprint, 
  useStakeholderEngagement,
  getMockESGData,
  useGenerateESGReport
} from "@/services/esgService";
import { toast } from "@/hooks/use-toast";
import { useDownloadESGReport } from "@/hooks/esg/useDownloadESGReport";

import ESGOverviewCard from "./ESGOverviewCard";
import ComplianceStatusCard from "./ComplianceStatusCard";
import CarbonFootprintCard from "./CarbonFootprintCard";
import StakeholderEngagementCard from "./StakeholderEngagementCard";
import ESGGoalsCard from "./ESGGoalsCard";
import ESGRecommendationsCard from "./ESGRecommendationsCard";
import ESGRiskAssessmentCard from "./ESGRiskAssessmentCard";
import ESGDataInputForm from "./ESGDataInputForm";
import MaterialityAssessmentMatrix from "./MaterialityAssessmentMatrix";
import ESGBenchmarkingCard from "./ESGBenchmarkingCard";
import ESGReportBuilder from "./ESGReportBuilder";
import AIInsightsDashboard from "./AIInsightsDashboard";
import StakeholderPortal from "./StakeholderPortal";
import InitiativeManagementPanel from "./InitiativeManagementPanel";
import InitiativeProgressDashboard from "./InitiativeProgressDashboard";
import NotificationBell from "./NotificationBell";
import ReportPreviewPanel from "./ReportPreviewPanel";

interface Organization {
  id: string;
  organizationId: string;
  organizationName: string;
  role: string;
  title?: string;
  isCurrent: boolean;
}

interface ESGDashboardProps {
  organizations?: Organization[];
}

const ESGDashboard = ({ organizations = [] }: ESGDashboardProps) => {
  const { user } = useAuth();
  const [selectedOrganizationId, setSelectedOrganizationId] = useState<string>(
    organizations.length > 0 ? organizations[0].organizationId : "demo-org-id"
  );
  const [refreshing, setRefreshing] = useState(false);
  const [reportData, setReportData] = useState<any>(null);
  
  // Report generation hooks
  const generateReport = useGenerateESGReport();
  const downloadReport = useDownloadESGReport();

  // Real-time queries for ESG data
  const { data: esgScore, isLoading: scoreLoading, refetch: refetchScore } = useESGScore(selectedOrganizationId);
  const { data: complianceData, isLoading: complianceLoading, refetch: refetchCompliance } = useESGComplianceStatus(selectedOrganizationId);
  const { data: carbonData, isLoading: carbonLoading, refetch: refetchCarbon } = useCarbonFootprint(selectedOrganizationId);
  const { data: engagementData, isLoading: engagementLoading, refetch: refetchEngagement } = useStakeholderEngagement(selectedOrganizationId);

  // Use mock data as fallback
  const mockData = getMockESGData();
  
  // Use real data if available, otherwise fall back to mock data
  const displayScore = esgScore || mockData.esgScore;
  const displayCompliance = complianceData || mockData.complianceStatus;
  const displayCarbon = carbonData || mockData.carbonFootprint;
  const displayEngagement = engagementData || mockData.stakeholderEngagement;

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchScore(),
        refetchCompliance(),
        refetchCarbon(),
        refetchEngagement()
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      await generateReport.mutateAsync({
        organizationId: selectedOrganizationId,
        reportType: 'esg_comprehensive'
      });
      toast({
        title: "Report Generated",
        description: "Your ESG report has been successfully generated",
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleExportReport = async () => {
    try {
      // Generate HTML content from report data
      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>ESG Report - ${selectedOrganizationId}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; }
              h1 { color: #0ce4af; }
            </style>
          </head>
          <body>
            <h1>ESG Report</h1>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </body>
        </html>
      `;
      
      await downloadReport.mutateAsync({
        reportId: selectedOrganizationId,
        reportName: `ESG_Report_${new Date().toISOString().split('T')[0]}`,
        htmlContent
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export report. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ESG Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your Environmental, Social, and Governance performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {organizations.length > 0 && (
            <Select value={selectedOrganizationId} onValueChange={setSelectedOrganizationId}>
              <SelectTrigger className="w-[250px]">
                <Building className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {organizations.map((org) => (
                  <SelectItem key={org.organizationId} value={org.organizationId}>
                    {org.organizationName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {user && (
            <NotificationBell 
              organizationId={selectedOrganizationId}
              userId={user.id}
            />
          )}
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
            <BarChart3 className="h-3 w-3 mr-1" />
            Enterprise Grade
          </Badge>
          <Button
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* ESG Overview */}
      <ESGOverviewCard 
        esgScore={displayScore}
        isLoading={scoreLoading}
      />

      <Tabs defaultValue="overview" className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-10 bg-secondary/20 text-xs">
          <TabsTrigger 
            value="overview"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="initiatives"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Initiatives
          </TabsTrigger>
          <TabsTrigger 
            value="progress"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Progress
          </TabsTrigger>
          <TabsTrigger 
            value="materiality"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Materiality
          </TabsTrigger>
          <TabsTrigger 
            value="benchmarks"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Benchmarks
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="ai-insights"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            AI Insights
          </TabsTrigger>
          <TabsTrigger 
            value="stakeholders"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Stakeholders
          </TabsTrigger>
          <TabsTrigger 
            value="compliance"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Compliance
          </TabsTrigger>
          <TabsTrigger 
            value="data-input"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Data Input
          </TabsTrigger>
        </MobileAwareTabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceStatusCard 
              complianceData={displayCompliance}
              isLoading={complianceLoading}
            />
            <StakeholderEngagementCard 
              engagementData={displayEngagement}
              isLoading={engagementLoading}
            />
            <ESGGoalsCard 
              goals={mockData.goals}
              isLoading={false}
            />
            <ESGRecommendationsCard 
              organizationId={selectedOrganizationId}
              recommendations={mockData.recommendations}
              isLoading={false}
            />
          </div>
          <div className="mt-6">
            <ESGRiskAssessmentCard 
              risks={mockData.risks}
              isLoading={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="initiatives" className="mt-6">
          <InitiativeManagementPanel organizationId={selectedOrganizationId} />
        </TabsContent>

        <TabsContent value="progress" className="mt-6">
          <InitiativeProgressDashboard organizationId={selectedOrganizationId} />
        </TabsContent>

        <TabsContent value="materiality" className="mt-6">
          <MaterialityAssessmentMatrix />
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-6">
          <ESGBenchmarkingCard />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <ReportPreviewPanel
              initiativeId={selectedOrganizationId}
              reportData={reportData}
              onGenerateReport={handleGenerateReport}
              isGenerating={generateReport.isPending}
            />
            <ESGReportBuilder organizationId={selectedOrganizationId} />
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-6">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <StakeholderPortal organizationId={selectedOrganizationId} />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            <ComplianceStatusCard 
              complianceData={displayCompliance}
              isLoading={complianceLoading}
            />
            
            {/* Detailed Compliance Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Framework Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {displayCompliance.map((framework, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gradient-to-br from-gray-50 to-gray-100">
                    <h4 className="font-medium text-sm mb-2">{framework.framework_name}</h4>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {framework.compliance_percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {framework.missing_indicators} missing indicators
                    </div>
                    <Button size="sm" variant="outline" className="w-full mt-3">
                      <FileText className="h-3 w-3 mr-1" />
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="data-input" className="mt-6">
          <ESGDataInputForm organizationId={selectedOrganizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGDashboard;