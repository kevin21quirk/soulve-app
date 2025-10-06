import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Package, 
  TrendingUp, 
  Handshake,
  Award,
  Target,
  Calendar,
  Leaf
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TeamManagement from "./TeamManagement";
import BusinessProductManagement from "./BusinessProductManagement";
import BusinessEmployeeEngagement from "./BusinessEmployeeEngagement";
import BusinessCSRManagement from "./BusinessCSRManagement";
import BusinessPartnershipManagement from "./BusinessPartnershipManagement";
import OrganizationAnalytics from "./OrganizationAnalytics";
import ESGDashboard from "@/components/dashboard/esg/ESGDashboard";
import { OrganizationManagementService } from "@/services/organizationManagementService";
import { BusinessManagementService } from "@/services/businessManagementService";

interface BusinessToolsDashboardProps {
  organizationId: string;
  organizationName: string;
}

const BusinessToolsDashboard = ({ organizationId, organizationName }: BusinessToolsDashboardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamMembers: 0,
    products: 0,
    employees: 0,
    csrInitiatives: 0,
    partnerships: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, [organizationId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load basic stats - if empty, default to 0
      const [teamData, productData, analyticsData] = await Promise.allSettled([
        OrganizationManagementService.getTeamMembers(organizationId),
        BusinessManagementService.getProducts(organizationId),
        BusinessManagementService.getBusinessAnalytics(organizationId),
      ]);

      setStats({
        teamMembers: teamData.status === 'fulfilled' ? teamData.value.length : 0,
        products: productData.status === 'fulfilled' ? productData.value.length : 0,
        employees: 0,
        csrInitiatives: 0,
        partnerships: analyticsData.status === 'fulfilled' ? analyticsData.value.totalPartnerships || 0 : 0,
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Notice",
        description: "Dashboard loaded. You can start creating your first items.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-secondary rounded mb-2"></div>
              <div className="h-8 bg-secondary rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{organizationName}</h1>
          <p className="text-muted-foreground">Business Management Tools</p>
        </div>
        <Badge className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          Business Tools
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Team Members</p>
                <p className="text-2xl font-bold text-foreground">{stats.teamMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Products</p>
                <p className="text-2xl font-bold text-foreground">{stats.products}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">CSR Initiatives</p>
                <p className="text-2xl font-bold text-foreground">{stats.csrInitiatives}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Handshake className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Partnerships</p>
                <p className="text-2xl font-bold text-foreground">{stats.partnerships}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-emerald-600" />
              <div>
                <p className="text-sm text-muted-foreground">ESG Score</p>
                <p className="text-2xl font-bold text-foreground">85</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-8 bg-secondary/20">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="team"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Team
          </TabsTrigger>
          <TabsTrigger 
            value="esg"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            ESG
          </TabsTrigger>
          <TabsTrigger 
            value="products"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Products
          </TabsTrigger>
          <TabsTrigger 
            value="employees"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Employees
          </TabsTrigger>
          <TabsTrigger 
            value="csr"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            CSR
          </TabsTrigger>
          <TabsTrigger 
            value="partnerships"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Partners
          </TabsTrigger>
          <TabsTrigger 
            value="analytics"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Analytics
          </TabsTrigger>
        </MobileAwareTabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                  <Button 
                    onClick={() => setActiveTab("team")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Manage Team</p>
                      <p className="text-xs text-muted-foreground">Add members</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("esg")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Leaf className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">ESG</p>
                      <p className="text-xs text-muted-foreground">Track metrics</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("products")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Package className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Products</p>
                      <p className="text-xs text-muted-foreground">Add products</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("csr")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Target className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">CSR</p>
                      <p className="text-xs text-muted-foreground">Manage initiatives</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("partnerships")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Handshake className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Partners</p>
                      <p className="text-xs text-muted-foreground">Add partners</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Recent Activity</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <p className="text-sm text-foreground">New product launched successfully</p>
                      <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-foreground">ESG report published</p>
                      <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <p className="text-sm text-foreground">New partnership established</p>
                      <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Upcoming Milestones</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Q4 ESG Compliance Report</p>
                        <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                      </div>
                      <Badge variant="secondary">Upcoming</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Annual CSR Review</p>
                        <p className="text-sm text-muted-foreground">Due in 1 month</p>
                      </div>
                      <Badge variant="secondary">Scheduled</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <TeamManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="esg" className="mt-4">
          <ESGDashboard />
        </TabsContent>

        <TabsContent value="products" className="mt-4">
          <BusinessProductManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="employees" className="mt-4">
          <BusinessEmployeeEngagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="csr" className="mt-4">
          <BusinessCSRManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-4">
          <BusinessPartnershipManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <OrganizationAnalytics organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BusinessToolsDashboard;
