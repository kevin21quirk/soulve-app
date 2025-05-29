
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Eye, Share2, Target, Calendar } from "lucide-react";

const CampaignAnalytics = () => {
  // Mock data for demonstration
  const engagementData = [
    { name: 'Jan', views: 1200, shares: 89, donations: 45 },
    { name: 'Feb', views: 1890, shares: 123, donations: 67 },
    { name: 'Mar', views: 2390, shares: 156, donations: 89 },
    { name: 'Apr', views: 3490, shares: 201, donations: 112 },
    { name: 'May', views: 4200, shares: 267, donations: 134 },
    { name: 'Jun', views: 3800, shares: 234, donations: 98 },
  ];

  const campaignPerformance = [
    { name: 'Clean Water Project', raised: 25000, goal: 30000, supporters: 450 },
    { name: 'Community Garden', raised: 8500, goal: 10000, supporters: 123 },
    { name: 'Education Fund', raised: 15000, goal: 20000, supporters: 267 },
    { name: 'Animal Shelter', raised: 5500, goal: 8000, supporters: 89 },
  ];

  const donationSources = [
    { name: 'Individual Donors', value: 65, color: '#0891b2' },
    { name: 'Corporate Sponsors', value: 25, color: '#0d9488' },
    { name: 'Grants', value: 10, color: '#0f766e' },
  ];

  const COLORS = ['#0891b2', '#0d9488', '#0f766e'];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Raised</p>
                <p className="text-2xl font-bold text-gray-900">$54,000</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+12.5%</span>
                </div>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Supporters</p>
                <p className="text-2xl font-bold text-gray-900">929</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+8.3%</span>
                </div>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Campaign Views</p>
                <p className="text-2xl font-bold text-gray-900">18.7K</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">-2.1%</span>
                </div>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social Shares</p>
                <p className="text-2xl font-bold text-gray-900">1,070</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+15.2%</span>
                </div>
              </div>
              <div className="p-2 bg-teal-100 rounded-lg">
                <Share2 className="h-6 w-6 text-teal-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Campaign Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience Insights</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Trends</CardTitle>
                <CardDescription>Views, shares, and donations over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="views" stroke="#0891b2" strokeWidth={2} />
                    <Line type="monotone" dataKey="shares" stroke="#0d9488" strokeWidth={2} />
                    <Line type="monotone" dataKey="donations" stroke="#0f766e" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Donation Sources</CardTitle>
                <CardDescription>Where your support is coming from</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={donationSources}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {donationSources.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest campaign milestones and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Clean Water Project reached 80% funding goal</p>
                    <p className="text-xs text-gray-600">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Community Garden gained 50 new supporters</p>
                    <p className="text-xs text-gray-600">1 day ago</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Education Fund update shared 200+ times</p>
                    <p className="text-xs text-gray-600">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance Comparison</CardTitle>
              <CardDescription>Progress towards goals across all campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">{campaign.supporters} supporters</Badge>
                        <span className="text-sm text-gray-600">
                          ${campaign.raised.toLocaleString()} / ${campaign.goal.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <Progress value={(campaign.raised / campaign.goal) * 100} className="h-2" />
                    <div className="text-sm text-gray-600">
                      {((campaign.raised / campaign.goal) * 100).toFixed(1)}% complete
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Supporter Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>United States</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Canada</span>
                    <span className="font-medium">22%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>United Kingdom</span>
                    <span className="font-medium">18%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Australia</span>
                    <span className="font-medium">15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supporter Demographics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Age 25-34</span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Age 35-44</span>
                    <span className="font-medium">28%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Age 45-54</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Age 55+</span>
                    <span className="font-medium">17%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Engagement</CardTitle>
              <CardDescription>Track how your audience interacts with your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="views" fill="#0891b2" />
                  <Bar dataKey="shares" fill="#0d9488" />
                  <Bar dataKey="donations" fill="#0f766e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignAnalytics;
