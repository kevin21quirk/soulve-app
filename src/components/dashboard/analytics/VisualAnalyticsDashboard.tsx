
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart 
} from "recharts";

interface VisualAnalyticsData {
  weeklyActivity: Array<{
    day: string;
    posts: number;
    likes: number;
    comments: number;
    connections: number;
  }>;
  monthlyTrends: Array<{
    month: string;
    impact: number;
    engagement: number;
    growth: number;
  }>;
  categoryBreakdown: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  timeSpentData: Array<{
    hour: string;
    activeUsers: number;
    yourActivity: number;
  }>;
}

const VisualAnalyticsDashboard = ({
  weeklyActivity,
  monthlyTrends,
  categoryBreakdown,
  timeSpentData
}: VisualAnalyticsData) => {
  const [activeTab, setActiveTab] = useState("weekly");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Visual Analytics Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="weekly">Weekly Activity</TabsTrigger>
            <TabsTrigger value="trends">Monthly Trends</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="timing">Activity Timing</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="posts" fill="#3b82f6" name="Posts" />
                  <Bar dataKey="likes" fill="#10b981" name="Likes" />
                  <Bar dataKey="comments" fill="#f59e0b" name="Comments" />
                  <Bar dataKey="connections" fill="#8b5cf6" name="Connections" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="impact" 
                    stackId="1" 
                    stroke="#3b82f6" 
                    fill="#3b82f6" 
                    fillOpacity={0.6}
                    name="Impact Score"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stackId="1" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    fillOpacity={0.6}
                    name="Engagement"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="growth" 
                    stackId="1" 
                    stroke="#f59e0b" 
                    fill="#f59e0b" 
                    fillOpacity={0.6}
                    name="Growth"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryBreakdown}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="timing" className="space-y-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSpentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="activeUsers" 
                    stroke="#8b5cf6" 
                    strokeWidth={2}
                    name="Community Activity"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="yourActivity" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    name="Your Activity"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default VisualAnalyticsDashboard;
