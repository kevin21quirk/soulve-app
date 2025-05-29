
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { TrendingUp, DollarSign } from "lucide-react";

interface DonationTrendsChartProps {
  donations: Array<{
    id: string;
    amount: number;
    createdAt: string;
  }>;
}

const DonationTrendsChart = ({ donations }: DonationTrendsChartProps) => {
  // Process donations data for charts
  const processedData = React.useMemo(() => {
    const dailyData: Record<string, { date: string; amount: number; count: number }> = {};
    
    donations.forEach(donation => {
      const date = new Date(donation.createdAt).toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = { date, amount: 0, count: 0 };
      }
      dailyData[date].amount += donation.amount;
      dailyData[date].count += 1;
    });

    return Object.values(dailyData)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-30); // Last 30 days
  }, [donations]);

  const totalAmount = donations.reduce((sum, d) => sum + d.amount, 0);
  const averageDonation = donations.length > 0 ? totalAmount / donations.length : 0;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-sm text-gray-600">Total Raised</div>
                <div className="text-xl font-bold">${totalAmount.toLocaleString()}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-sm text-gray-600">Average Donation</div>
                <div className="text-xl font-bold">${averageDonation.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <div className="text-sm text-gray-600">Total Donors</div>
                <div className="text-xl font-bold">{donations.length}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Donation Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Amount']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#0ce4af" 
                  strokeWidth={2}
                  dot={{ fill: "#0ce4af" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Donation Count</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value: number) => [value, 'Donations']}
                />
                <Bar dataKey="count" fill="#18a5fe" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationTrendsChart;
