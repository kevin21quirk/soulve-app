
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";

const DonationTrendChart = () => {
  // Mock data for demonstration
  const dailyData = [
    { date: "Jan 1", donations: 245, amount: 1240 },
    { date: "Jan 2", donations: 180, amount: 890 },
    { date: "Jan 3", donations: 320, amount: 1650 },
    { date: "Jan 4", donations: 290, amount: 1480 },
    { date: "Jan 5", donations: 410, amount: 2100 },
    { date: "Jan 6", donations: 380, amount: 1920 },
    { date: "Jan 7", donations: 450, amount: 2300 },
    { date: "Jan 8", donations: 380, amount: 1950 },
    { date: "Jan 9", donations: 520, amount: 2680 },
    { date: "Jan 10", donations: 480, amount: 2450 },
  ];

  const hourlyData = [
    { hour: "00:00", donations: 12 },
    { hour: "06:00", donations: 8 },
    { hour: "12:00", donations: 45 },
    { hour: "18:00", donations: 52 },
    { hour: "24:00", donations: 23 },
  ];

  return (
    <div className="space-y-6">
      {/* Daily Donation Trends */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Daily Donation Trends</CardTitle>
            <Badge variant="outline">Last 10 days</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="donations" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Donations Count"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Amount ($)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Hourly Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Donation Activity by Hour</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="donations" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Trend Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Peak Time</h4>
              <p className="text-blue-700">6 PM - 8 PM shows highest activity</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Growth Trend</h4>
              <p className="text-green-700">+15% increase over last week</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-semibold text-purple-900">Average Amount</h4>
              <p className="text-purple-700">$85 per donation (up 8%)</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900">Frequency</h4>
              <p className="text-orange-700">2.3 donations per donor average</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DonationTrendChart;
