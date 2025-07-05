
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Award
} from "lucide-react";
import { DonorManagementService } from "@/services/donorManagementService";
import { VolunteerManagementService } from "@/services/volunteerManagementService";
import { GrantManagementService } from "@/services/grantManagementService";

interface OrganizationAnalyticsProps {
  organizationId: string;
}

const OrganizationAnalytics = ({ organizationId }: OrganizationAnalyticsProps) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>({
    donor: null,
    volunteer: null,
    grant: null
  });

  useEffect(() => {
    loadAnalyticsData();
  }, [organizationId]);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const [donorAnalytics, volunteerAnalytics, grantAnalytics] = await Promise.all([
        DonorManagementService.getDonorAnalytics(organizationId),
        VolunteerManagementService.getVolunteerAnalytics(organizationId),
        GrantManagementService.getGrantAnalytics(organizationId)
      ]);

      setAnalyticsData({
        donor: donorAnalytics,
        volunteer: volunteerAnalytics,
        grant: grantAnalytics
      });
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for charts (in a real app, this would come from your analytics service)
  const monthlyDonations = [
    { month: 'Jan', amount: 12000, donors: 45 },
    { month: 'Feb', amount: 15000, donors: 52 },
    { month: 'Mar', amount: 18000, donors: 61 },
    { month: 'Apr', amount: 14000, donors: 48 },
    { month: 'May', amount: 22000, donors: 73 },
    { month: 'Jun', amount: 25000, donors: 81 }
  ];

  const donorSegments = [
    { name: 'Major Donors (£1000+)', value: 35, color: '#8b5cf6' },
    { name: 'Regular Donors', value: 45, color: '#06b6d4' },
    { name: 'New Donors', value: 20, color: '#10b981' }
  ];

  const volunteerEngagement = [
    { month: 'Jan', hours: 120, volunteers: 15 },
    { month: 'Feb', hours: 145, volunteers: 18 },
    { month: 'Mar', hours: 168, volunteers: 21 },
    { month: 'Apr', hours: 190, volunteers: 23 },
    { month: 'May', hours: 215, volunteers: 27 },
    { month: 'Jun', hours: 240, volunteers: 30 }
  ];

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-32 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Organization Analytics</h2>
        <p className="text-gray-600">Comprehensive insights into your organization's performance</p>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Growth Rate</p>
                <p className="text-2xl font-bold text-green-600">+23%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-blue-600">87%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Goal Achievement</p>
                <p className="text-2xl font-bold text-purple-600">76%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Impact Score</p>
                <p className="text-2xl font-bold text-yellow-600">94</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs defaultValue="donations" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="grants">Grants</TabsTrigger>
          <TabsTrigger value="impact">Impact</TabsTrigger>
        </TabsList>

        <TabsContent value="donations" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Donation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyDonations}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'amount' ? `£${value.toLocaleString()}` : value,
                      name === 'amount' ? 'Amount' : 'Donors'
                    ]} />
                    <Bar dataKey="amount" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donor Segments</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={donorSegments}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {donorSegments.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {analyticsData.donor && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-blue-600">
                      £{analyticsData.donor.totalRaised.toLocaleString()}
                    </p>
                    <p className="text-sm text-gray-600">Total Raised</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">
                      {analyticsData.donor.totalDonors}
                    </p>
                    <p className="text-sm text-gray-600">Total Donors</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600">
                      {Math.round(analyticsData.donor.retentionRate)}%
                    </p>
                    <p className="text-sm text-gray-600">Retention Rate</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="volunteers" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Volunteer Engagement Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={volunteerEngagement}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="volunteers" stroke="#f59e0b" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Volunteer Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.volunteer && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Opportunities</span>
                      <Badge variant="secondary">{analyticsData.volunteer.totalOpportunities}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Active Opportunities</span>
                      <Badge className="bg-green-100 text-green-800">{analyticsData.volunteer.activeOpportunities}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Total Applications</span>
                      <Badge variant="secondary">{analyticsData.volunteer.totalApplications}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">Unique Volunteers</span>
                      <Badge className="bg-blue-100 text-blue-800">{analyticsData.volunteer.totalVolunteers}</Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="grants" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Grant Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                {analyticsData.grant && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Total Grants Tracked</p>
                        <p className="text-sm text-gray-600">All opportunities</p>
                      </div>
                      <Badge variant="secondary" className="text-lg px-3 py-1">
                        {analyticsData.grant.totalGrants}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Success Rate</p>
                        <p className="text-sm text-gray-600">Awarded vs Applied</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                        {Math.round(analyticsData.grant.successRate)}%
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Total Awarded</p>
                        <p className="text-sm text-gray-600">Successfully secured</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800 text-lg px-3 py-1">
                        £{analyticsData.grant.totalAwarded.toLocaleString()}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Grant Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Application Completion Rate</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Average Processing Time</span>
                      <span className="text-sm font-medium">42 days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600">Follow-up Response Rate</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="impact" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-lg text-white">
                    <p className="text-3xl font-bold">2,547</p>
                    <p className="text-sm opacity-90">People Directly Helped</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">£125K</p>
                      <p className="text-sm text-gray-600">Community Value Created</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">1,200</p>
                      <p className="text-sm text-gray-600">Volunteer Hours</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Return on Investment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-green-600 mb-2">4.2:1</p>
                    <p className="text-gray-600 mb-4">
                      Every £1 invested generates £4.20 in social value
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="text-sm">Program Investment</span>
                      <span className="font-medium">£45,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                      <span className="text-sm">Social Value Generated</span>
                      <span className="font-medium text-green-700">£189,000</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                      <span className="text-sm">Beneficiaries Reached</span>
                      <span className="font-medium text-blue-700">2,547 people</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OrganizationAnalytics;
