import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText, Settings, Download, RefreshCw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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

const ESGDashboard = () => {
  const { user } = useAuth();
  const [selectedOrganizationId] = useState("demo-org-id"); // In real app, get from context or props
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ESG Analytics Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your Environmental, Social, and Governance performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
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
        <TabsList className="grid w-full grid-cols-4 bg-gray-100">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="compliance"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Compliance
          </TabsTrigger>
          <TabsTrigger 
            value="environmental"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Environmental
          </TabsTrigger>
          <TabsTrigger 
            value="social"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white"
          >
            Social
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
          </div>
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

        <TabsContent value="environmental" className="mt-6">
          <div className="space-y-6">
            <CarbonFootprintCard 
              carbonData={mockData.carbonFootprint}
              isLoading={false}
            />
            
            {/* Additional Environmental Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Water Usage</h4>
                <div className="text-2xl font-bold text-green-700">1.2M</div>
                <div className="text-sm text-green-600">Liters per month</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Waste Reduction</h4>
                <div className="text-2xl font-bold text-blue-700">85%</div>
                <div className="text-sm text-blue-600">Recycling rate</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200">
                <h4 className="font-medium text-yellow-800 mb-2">Renewable Energy</h4>
                <div className="text-2xl font-bold text-yellow-700">45%</div>
                <div className="text-sm text-yellow-600">Of total consumption</div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <div className="space-y-6">
            <StakeholderEngagementCard 
              engagementData={mockData.stakeholderEngagement}
              isLoading={false}
            />
            
            {/* Additional Social Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200">
                <h4 className="font-medium text-purple-800 mb-2">Employee Diversity</h4>
                <div className="text-2xl font-bold text-purple-700">67%</div>
                <div className="text-sm text-purple-600">Leadership diversity</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200">
                <h4 className="font-medium text-pink-800 mb-2">Training Hours</h4>
                <div className="text-2xl font-bold text-pink-700">42.5</div>
                <div className="text-sm text-pink-600">Hours per employee</div>
              </Card>
              
              <Card className="p-4 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200">
                <h4 className="font-medium text-indigo-800 mb-2">Safety Score</h4>
                <div className="text-2xl font-bold text-indigo-700">98.2%</div>
                <div className="text-sm text-indigo-600">Incident-free days</div>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ESGDashboard;