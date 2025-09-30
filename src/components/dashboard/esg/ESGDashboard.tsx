import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  getMockESGData 
} from "@/services/esgService";

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

  // Use mock data for now - replace with real queries when organization data is available
  const mockData = getMockESGData();
  
  // Real queries (commented out until organization setup is complete)
  // const { data: esgScore, isLoading: scoreLoading } = useESGScore(selectedOrganizationId);
  // const { data: complianceData, isLoading: complianceLoading } = useESGComplianceStatus(selectedOrganizationId);
  // const { data: carbonData, isLoading: carbonLoading } = useCarbonFootprint(selectedOrganizationId);
  // const { data: engagementData, isLoading: engagementLoading } = useStakeholderEngagement(selectedOrganizationId);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleExportReport = () => {
    // Implement ESG report export functionality
    console.log("Exporting ESG report...");
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
        esgScore={mockData.esgScore}
        isLoading={false}
      />

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-8 bg-secondary/20 text-xs">
          <TabsTrigger 
            value="overview"
            className="text-gray-600 hover:bg-accent hover:text-accent-foreground data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white data-[state=active]:border-transparent text-xs"
          >
            Overview
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
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ComplianceStatusCard 
              complianceData={mockData.complianceStatus}
              isLoading={false}
            />
            <StakeholderEngagementCard 
              engagementData={mockData.stakeholderEngagement}
              isLoading={false}
            />
            <ESGGoalsCard 
              goals={mockData.goals}
              isLoading={false}
            />
            <ESGRecommendationsCard 
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


        <TabsContent value="materiality" className="mt-6">
          <MaterialityAssessmentMatrix />
        </TabsContent>

        <TabsContent value="benchmarks" className="mt-6">
          <ESGBenchmarkingCard />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ESGReportBuilder />
        </TabsContent>

        <TabsContent value="ai-insights" className="mt-6">
          <AIInsightsDashboard />
        </TabsContent>

        <TabsContent value="stakeholders" className="mt-6">
          <StakeholderPortal />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <div className="space-y-6">
            <ComplianceStatusCard 
              complianceData={mockData.complianceStatus}
              isLoading={false}
            />
            
            {/* Detailed Compliance Breakdown */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Framework Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mockData.complianceStatus.map((framework, index) => (
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
          <ESGDataInputForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGDashboard;