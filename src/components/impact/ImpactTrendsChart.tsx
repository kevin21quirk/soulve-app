
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { BarChart3 } from 'lucide-react';
import { ImpactAnalyticsService, ImpactTrend } from '@/services/impactAnalyticsService';

interface ImpactTrendsChartProps {
  userId: string;
  timeRange: '7d' | '30d' | '90d';
}

const ImpactTrendsChart = ({ userId, timeRange }: ImpactTrendsChartProps) => {
  const [trends, setTrends] = useState<ImpactTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrends();
  }, [userId, timeRange]);

  const loadTrends = async () => {
    setLoading(true);
    try {
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const trendsData = await ImpactAnalyticsService.getImpactTrends(userId, days);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading trends:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform data for chart
  const chartData = trends.reduce((acc: any[], trend) => {
    const existing = acc.find(item => item.date === trend.date);
    if (existing) {
      existing[trend.metric] = trend.value;
    } else {
      acc.push({
        date: trend.date,
        [trend.metric]: trend.value
      });
    }
    return acc;
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse h-64 bg-gray-200 rounded"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <span>Impact Trends</span>
          </CardTitle>
          <CardDescription>
            Track your impact metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value, name) => [value, name.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())]}
                />
                <Legend 
                  formatter={(value) => value.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                />
                <Line 
                  type="monotone" 
                  dataKey="helpProvided" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="helpProvided"
                />
                <Line 
                  type="monotone" 
                  dataKey="volunteerHours" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="volunteerHours"
                />
                <Line 
                  type="monotone" 
                  dataKey="trustScore" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="trustScore"
                />
                <Line 
                  type="monotone" 
                  dataKey="impactScore" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  name="impactScore"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ImpactTrendsChart;
