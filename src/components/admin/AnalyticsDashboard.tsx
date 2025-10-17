import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, Activity, MapPin } from 'lucide-react';
import { LoadingState } from '@/components/ui/loading-state';

export const AnalyticsDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [engagementData, setEngagementData] = useState<any[]>([]);
  const [campaignPerformance, setcampaignPerformance] = useState<any[]>([]);
  const [demographics, setDemographics] = useState<any[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      // User growth over last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Group by date
      const growthByDate: Record<string, number> = {};
      profiles?.forEach(p => {
        const date = new Date(p.created_at).toLocaleDateString();
        growthByDate[date] = (growthByDate[date] || 0) + 1;
      });

      const growthData = Object.entries(growthByDate).map(([date, count]) => ({
        date,
        users: count
      }));
      setUserGrowth(growthData);

      // Engagement metrics (posts, interactions)
      const { data: posts } = await supabase
        .from('posts')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      const { data: interactions } = await supabase
        .from('post_interactions')
        .select('created_at')
        .gte('created_at', thirtyDaysAgo.toISOString());

      setEngagementData([
        { name: 'Posts', value: posts?.length || 0 },
        { name: 'Interactions', value: interactions?.length || 0 }
      ]);

      // Campaign performance
      const { data: campaigns } = await supabase
        .from('campaigns')
        .select('status, current_amount, goal_amount')
        .eq('status', 'active');

      const performanceData = campaigns?.map(c => ({
        id: c.status,
        raised: c.current_amount || 0,
        goal: c.goal_amount || 0,
        percentage: ((c.current_amount || 0) / (c.goal_amount || 1)) * 100
      }));
      setcampaignPerformance(performanceData || []);

      // Demographics (waitlist status)
      const { data: statusData } = await supabase
        .from('profiles')
        .select('waitlist_status');

      const statusCount: Record<string, number> = {};
      statusData?.forEach(p => {
        statusCount[p.waitlist_status] = (statusCount[p.waitlist_status] || 0) + 1;
      });

      const demoData = Object.entries(statusCount).map(([status, count]) => ({
        name: status,
        value: count
      }));
      setDemographics(demoData);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingState message="Loading analytics..." />;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Platform insights and performance metrics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userGrowth.reduce((acc, curr) => acc + curr.users, 0)}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {engagementData.reduce((acc, curr) => acc + curr.value, 0)}
            </div>
            <p className="text-xs text-muted-foreground">Total interactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{campaignPerformance.length}</div>
            <p className="text-xs text-muted-foreground">Fundraising campaigns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demographics</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{demographics.reduce((acc, curr) => acc + curr.value, 0)}</div>
            <p className="text-xs text-muted-foreground">Total users</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
            <CardDescription>New users over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Platform Engagement</CardTitle>
            <CardDescription>Posts and interactions breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Status Distribution</CardTitle>
            <CardDescription>Waitlist status breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={demographics}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {demographics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>Active fundraising campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaignPerformance.length === 0 ? (
                <p className="text-sm text-muted-foreground">No active campaigns</p>
              ) : (
                campaignPerformance.slice(0, 5).map((campaign, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Campaign {i + 1}</span>
                      <span className="font-medium">{campaign.percentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${Math.min(campaign.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};