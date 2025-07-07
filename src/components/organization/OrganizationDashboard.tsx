
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  DollarSign, 
  TrendingUp, 
  UserPlus, 
  Calendar,
  FileText,
  Building,
  Target,
  Award,
  Package,
  Handshake,
  Globe
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import TeamManagement from "./TeamManagement";
import DonorManagement from "./DonorManagement";
import VolunteerManagement from "./VolunteerManagement";
import GrantManagement from "./GrantManagement";
import OrganizationAnalytics from "./OrganizationAnalytics";
import BusinessProductManagement from "./BusinessProductManagement";
import BusinessEmployeeEngagement from "./BusinessEmployeeEngagement";
import BusinessCSRManagement from "./BusinessCSRManagement";
import BusinessPartnershipManagement from "./BusinessPartnershipManagement";
import { OrganizationManagementService } from "@/services/organizationManagementService";
import { DonorManagementService } from "@/services/donorManagementService";
import { VolunteerManagementService } from "@/services/volunteerManagementService";
import { GrantManagementService } from "@/services/grantManagementService";
import { BusinessManagementService } from "@/services/businessManagementService";

interface OrganizationDashboardProps {
  organizationId: string;
  organizationName: string;
}

const OrganizationDashboard = ({ organizationId, organizationName }: OrganizationDashboardProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    teamMembers: 0,
    donors: 0,
    volunteers: 0,
    totalRaised: 0,
    activeGrants: 0,
    activeCampaigns: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, [organizationId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [teamMembers, donorAnalytics, volunteerAnalytics, grants] = await Promise.all([
        OrganizationManagementService.getTeamMembers(organizationId),
        DonorManagementService.getDonorAnalytics(organizationId),
        VolunteerManagementService.getVolunteerAnalytics(organizationId),
        GrantManagementService.getGrants(organizationId)
      ]);

      setStats({
        teamMembers: teamMembers.length,
        donors: donorAnalytics?.totalDonors || 0,
        volunteers: volunteerAnalytics?.totalVolunteers || 0,
        totalRaised: donorAnalytics?.totalRaised || 0,
        activeGrants: grants.filter(g => g.status === 'active').length,
        activeCampaigns: 0 // Would need to fetch campaigns
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
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
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
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
          <h1 className="text-3xl font-bold text-gray-900">{organizationName}</h1>
          <p className="text-gray-600">Organization Management Dashboard</p>
        </div>
        <Badge className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          Pro Organization
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Team Members</p>
                <p className="text-2xl font-bold">{stats.teamMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Donors</p>
                <p className="text-2xl font-bold">{stats.donors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Volunteers</p>
                <p className="text-2xl font-bold">{stats.volunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold">£{stats.totalRaised.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Active Grants</p>
                <p className="text-2xl font-bold">{stats.activeGrants}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-indigo-600" />
              <div>
                <p className="text-sm text-gray-600">Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="employees">Employees</TabsTrigger>
          <TabsTrigger value="csr">CSR</TabsTrigger>
          <TabsTrigger value="partnerships">Partners</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <p className="text-sm">New volunteer application received</p>
                    <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-sm">Campaign milestone reached</p>
                    <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <p className="text-sm">Grant deadline approaching</p>
                    <span className="text-xs text-gray-500 ml-auto">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Upcoming Deadlines</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div>
                      <p className="font-medium text-red-900">Community Grant Application</p>
                      <p className="text-sm text-red-600">Due in 5 days</p>
                    </div>
                    <Badge variant="destructive">Urgent</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div>
                      <p className="font-medium text-yellow-900">Volunteer Training Session</p>
                      <p className="text-sm text-yellow-600">Due in 2 weeks</p>
                    </div>
                    <Badge variant="secondary">Upcoming</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="team" className="mt-4">
          <TeamManagement organizationId={organizationId} />
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

        <TabsContent value="grants" className="mt-4">
          <GrantManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="analytics" className="mt-4">
          <OrganizationAnalytics organizationId={organizationId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationDashboard;
