
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CampaignPerformanceChart = () => {
  const [timeRange, setTimeRange] = useState("30d");

  // Mock data for different chart types
  const donationData = [
    { date: '2024-01-01', amount: 1200, supporters: 15 },
    { date: '2024-01-02', amount: 2340, supporters: 28 },
    { date: '2024-01-03', amount: 1890, supporters: 22 },
    { date: '2024-01-04', amount: 3200, supporters: 35 },
    { date: '2024-01-05', amount: 2800, supporters: 31 },
    { date: '2024-01-06', amount: 4100, supporters: 42 },
    { date: '2024-01-07', amount: 3600, supporters: 38 }
  ];

  const engagementData = [
    { date: '2024-01-01', views: 450, shares: 12, comments: 8 },
    { date: '2024-01-02', views: 680, shares: 18, comments: 15 },
    { date: '2024-01-03', views: 590, shares: 14, comments: 11 },
    { date: '2024-01-04', views: 820, shares: 25, comments: 19 },
    { date: '2024-01-05', views: 750, shares: 21, comments: 16 },
    { date: '2024-01-06', views: 920, shares: 28, comments: 22 },
    { date: '2024-01-07', views: 880, shares: 26, comments: 20 }
  ];

  const demographicsData = [
    { name: '18-24', value: 25, color: '#8884d8' },
    { name: '25-34', value: 35, color: '#82ca9d' },
    { name: '35-44', value: 20, color: '#ffc658' },
    { name: '45-54', value: 15, color: '#ff7300' },
    { name: '55+', value: 5, color: '#00ff88' }
  ];

  const sourceData = [
    { source: 'Direct', visitors: 1200, supporters: 68 },
    { source: 'Social Media', visitors: 890, supporters: 45 },
    { source: 'Email', visitors: 560, supporters: 42 },
    { source: 'Search', visitors: 340, supporters: 18 },
    { source: 'Referral', visitors: 210, supporters: 12 }
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Campaign Performance</CardTitle>
            <CardDescription>
              Detailed analytics and trends for your campaign
            </CardDescription>
          </div>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="donations" className="space-y-4">
          <TabsList>
            <TabsTrigger value="donations">Donations</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="demographics">Demographics</TabsTrigger>
            <TabsTrigger value="sources">Traffic Sources</TabsTrigger>
          </TabsList>

          <TabsContent value="donations" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={donationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    labelFormatter={(value) => `Date: ${value}`}
                    formatter={(value, name) => [
                      name === 'amount' ? `£${value}` : value,
                      name === 'amount' ? 'Amount Raised' : 'New Supporters'
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="views"
                    stroke="#8884d8"
                    strokeWidth={2}
                    name="Views"
                  />
                  <Line
                    type="monotone"
                    dataKey="shares"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    name="Shares"
                  />
                  <Line
                    type="monotone"
                    dataKey="comments"
                    stroke="#ffc658"
                    strokeWidth={2}
                    name="Comments"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="demographics" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicsData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {demographicsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="space-y-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sourceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="source" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="visitors" fill="#8884d8" name="Visitors" />
                  <Bar dataKey="supporters" fill="#82ca9d" name="Supporters" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CampaignPerformanceChart;
