import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Settings, Download, RefreshCw, Building, Plus } from "lucide-react";
import { ReportCreationWizard } from "./ReportCreationWizard";
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
  const [showReportWizard, setShowReportWizard] = useState(false);
  
  // Report generation hooks
  const generateReport = useGenerateESGReport();
  const downloadReport = useDownloadESGReport();

  // Real-time queries for ESG data
  const { data: esgScore, isLoading: scoreLoading, refetch: refetchScore } = useESGScore(selectedOrganizationId);
  const { data: complianceData, isLoading: complianceLoading, refetch: refetchCompliance } = useESGComplianceStatus(selectedOrganizationId);
  const { data: carbonData, isLoading: carbonLoading, refetch: refetchCarbon } = useCarbonFootprint(selectedOrganizationId);
  const { data: engagementData, isLoading: engagementLoading, refetch: refetchEngagement } = useStakeholderEngagement(selectedOrganizationId);

  // Use real data only - no mock fallbacks
  const displayScore = esgScore || { overall: 0, environmental: 0, social: 0, governance: 0, trend: 'stable' as const };
  const displayCompliance = complianceData || [];
  const displayCarbon = carbonData || { total: 0, scope1: 0, scope2: 0, scope3: 0, trend: 'stable' as const };
  const displayEngagement = engagementData || { 
    totalStakeholders: 0, 
    activeEngagements: 0, 
    responseRate: 0,
    stakeholderBreakdown: {},
    overallEngagement: 0
  };

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
      
      // Quick export removed - use ESG Reports panel to generate and download reports
      toast({
        title: "Use ESG Reports",
        description: "Please use the ESG Reports section to generate and download reports",
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
            variant="gradient"
            size="sm"
            onClick={() => setShowReportWizard(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Report
          </Button>
          <Button
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ESG Overview */}
      <ESGOverviewCard 
        esgScore={displayScore}
        isLoading={scoreLoading}
      />

      <Tabs defaultValue="dashboard" className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-6 bg-secondary/20">
          <TabsTrigger 
            value="dashboard"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger 
            value="data"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Data Management
          </TabsTrigger>
          <TabsTrigger 
            value="reports"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Reports
          </TabsTrigger>
          <TabsTrigger 
            value="insights"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Insights
          </TabsTrigger>
          <TabsTrigger 
            value="stakeholders"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Stakeholders
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent"
          >
            Settings
          </TabsTrigger>
        </MobileAwareTabsList>

        <TabsContent value="dashboard" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceStatusCard 
              complianceData={displayCompliance}
              isLoading={complianceLoading}
              organizationId={selectedOrganizationId}
            />
            <StakeholderEngagementCard 
              engagementData={displayEngagement}
              isLoading={engagementLoading}
            />
            <ESGGoalsCard 
              organizationId={selectedOrganizationId}
            />
            <ESGRecommendationsCard 
              organizationId={selectedOrganizationId}
            />
          </div>
          <div className="mt-6">
            <ESGRiskAssessmentCard 
              risks={[]}
              isLoading={false}
            />
          </div>
        </TabsContent>

        <TabsContent value="data" className="mt-6">
          <div className="space-y-6">
            <ESGDataInputForm organizationId={selectedOrganizationId} />
            <InitiativeManagementPanel organizationId={selectedOrganizationId} />
          </div>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <div className="space-y-6">
            <ReportPreviewPanel
              initiativeId={selectedOrganizationId}
              onGenerateReport={handleGenerateReport}
              isGenerating={generateReport.isPending}
            />
            <ESGReportBuilder organizationId={selectedOrganizationId} />
          </div>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <div className="space-y-6">
            <AIInsightsDashboard />
            <ESGBenchmarkingCard />
          </div>
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <StakeholderPortal organizationId={selectedOrganizationId} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="space-y-6">
            <MaterialityAssessmentMatrix />
            <InitiativeProgressDashboard organizationId={selectedOrganizationId} />
          </div>
        </TabsContent>
      </Tabs>

      <ReportCreationWizard
        open={showReportWizard}
        onOpenChange={setShowReportWizard}
        organizationId={selectedOrganizationId}
      />
    </div>
  );
};

export default ESGDashboard;