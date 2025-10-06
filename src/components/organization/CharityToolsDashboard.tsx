import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { MobileAwareTabsList } from "@/components/ui/mobile-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Heart, 
  DollarSign, 
  UserPlus, 
  FileText,
  TrendingUp,
  Calendar
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import TeamManagement from "./TeamManagement";
import DonorManagement from "./DonorManagement";
import VolunteerManagement from "./VolunteerManagement";
import GrantManagement from "./GrantManagement";
import OrganizationAnalytics from "./OrganizationAnalytics";
import { OrganizationManagementService } from "@/services/organizationManagementService";
import { DonorManagementService } from "@/services/donorManagementService";
import { VolunteerManagementService } from "@/services/volunteerManagementService";
import { GrantManagementService } from "@/services/grantManagementService";

interface CharityToolsDashboardProps {
  organizationId: string;
  organizationName: string;
}

const CharityToolsDashboard = ({ organizationId, organizationName }: CharityToolsDashboardProps) => {
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
  });

  useEffect(() => {
    loadDashboardData();
  }, [organizationId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load basic stats - if empty, default to 0
      const [teamData, donorData, volunteerData, grantData] = await Promise.allSettled([
        OrganizationManagementService.getTeamMembers(organizationId),
        DonorManagementService.getDonors(organizationId),
        VolunteerManagementService.getOpportunities(organizationId),
        GrantManagementService.getGrants(organizationId),
      ]);

      setStats({
        teamMembers: teamData.status === 'fulfilled' ? teamData.value.length : 0,
        donors: donorData.status === 'fulfilled' ? donorData.value.length : 0,
        volunteers: volunteerData.status === 'fulfilled' ? volunteerData.value.length : 0,
        totalRaised: donorData.status === 'fulfilled' 
          ? donorData.value.reduce((sum: number, d: any) => sum + (d.total_donated || 0), 0) 
          : 0,
        activeGrants: grantData.status === 'fulfilled' 
          ? grantData.value.filter((g: any) => g.status === 'active').length 
          : 0,
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
          <p className="text-muted-foreground">Charity Management Tools</p>
        </div>
        <Badge className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          Charity Tools
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
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Donors</p>
                <p className="text-2xl font-bold text-foreground">{stats.donors}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Volunteers</p>
                <p className="text-2xl font-bold text-foreground">{stats.volunteers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Total Raised</p>
                <p className="text-2xl font-bold text-foreground">£{stats.totalRaised.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Grants</p>
                <p className="text-2xl font-bold text-foreground">{stats.activeGrants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <MobileAwareTabsList className="grid w-full grid-cols-6 bg-secondary/20">
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
            value="volunteers"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Volunteers
          </TabsTrigger>
          <TabsTrigger 
            value="donors"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Donors
          </TabsTrigger>
          <TabsTrigger 
            value="grants"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            Grants
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <Button 
                    onClick={() => setActiveTab("team")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Users className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Manage Team</p>
                      <p className="text-xs text-muted-foreground">Add and invite members</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("volunteers")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <UserPlus className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Volunteers</p>
                      <p className="text-xs text-muted-foreground">Create opportunities</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("donors")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <Heart className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Donors</p>
                      <p className="text-xs text-muted-foreground">Add and track donors</p>
                    </div>
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("grants")}
                    variant="outline"
                    className="h-auto flex-col items-start p-4 gap-2"
                  >
                    <FileText className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Grants</p>
                      <p className="text-xs text-muted-foreground">Manage applications</p>
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
                      <p className="text-sm text-foreground">New volunteer application received</p>
                      <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <p className="text-sm text-foreground">New donor contribution</p>
                      <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <p className="text-sm text-foreground">Grant deadline approaching</p>
                      <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Calendar className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-foreground">Upcoming Deadlines</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Community Grant Application</p>
                        <p className="text-sm text-muted-foreground">Due in 5 days</p>
                      </div>
                      <Badge variant="destructive">Urgent</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Volunteer Training Session</p>
                        <p className="text-sm text-muted-foreground">Due in 2 weeks</p>
                      </div>
                      <Badge variant="secondary">Upcoming</Badge>
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

        <TabsContent value="volunteers" className="mt-4">
          <VolunteerManagement organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="donors" className="mt-4">
          <DonorManagement organizationId={organizationId} />
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

export default CharityToolsDashboard;
