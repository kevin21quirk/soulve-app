
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, TrendingUp, Users, MapPin, Star, BarChart3 } from "lucide-react";
import { ConnectionRequest, Group } from "@/types/connections";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface NetworkAnalyticsProps {
  connectedPeople: ConnectionRequest[];
  myGroups: Group[];
  onClose: () => void;
}

const NetworkAnalytics = ({ connectedPeople, myGroups, onClose }: NetworkAnalyticsProps) => {
  // Location distribution
  const locationData = connectedPeople.reduce((acc, person) => {
    acc[person.location] = (acc[person.location] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locationChartData = Object.entries(locationData).map(([location, count]) => ({
    name: location,
    value: count,
    percentage: ((count / connectedPeople.length) * 100).toFixed(1)
  }));

  // Skills distribution
  const skillsData = connectedPeople.flatMap(person => person.skills).reduce((acc, skill) => {
    acc[skill] = (acc[skill] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topSkills = Object.entries(skillsData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([skill, count]) => ({ skill, count }));

  // Trust score distribution
  const trustScoreRanges = {
    "90-100%": connectedPeople.filter(p => p.trustScore >= 90).length,
    "80-89%": connectedPeople.filter(p => p.trustScore >= 80 && p.trustScore < 90).length,
    "70-79%": connectedPeople.filter(p => p.trustScore >= 70 && p.trustScore < 80).length,
    "60-69%": connectedPeople.filter(p => p.trustScore >= 60 && p.trustScore < 70).length,
    "<60%": connectedPeople.filter(p => p.trustScore < 60).length,
  };

  const trustScoreData = Object.entries(trustScoreRanges).map(([range, count]) => ({
    range,
    count,
    percentage: ((count / connectedPeople.length) * 100).toFixed(1)
  }));

  // Network growth simulation (mock data for demo)
  const networkGrowthData = [
    { month: "Jan", connections: 12, groups: 2 },
    { month: "Feb", connections: 18, groups: 3 },
    { month: "Mar", connections: 25, groups: 4 },
    { month: "Apr", connections: 32, groups: 5 },
    { month: "May", connections: 41, groups: 6 },
    { month: "Jun", connections: connectedPeople.length, groups: myGroups.length },
  ];

  const avgTrustScore = connectedPeople.length > 0 
    ? (connectedPeople.reduce((sum, p) => sum + p.trustScore, 0) / connectedPeople.length).toFixed(1)
    : "0";

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1', '#d084d0'];

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>Network Analytics</span>
        </CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <p className="text-2xl font-bold text-blue-900">{connectedPeople.length}</p>
            <p className="text-sm text-blue-700">Total Connections</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Star className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <p className="text-2xl font-bold text-green-900">{avgTrustScore}%</p>
            <p className="text-sm text-green-700">Avg Trust Score</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <p className="text-2xl font-bold text-purple-900">{myGroups.length}</p>
            <p className="text-sm text-purple-700">Groups Joined</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-orange-600" />
            <p className="text-2xl font-bold text-orange-900">{Object.keys(locationData).length}</p>
            <p className="text-sm text-orange-700">Locations</p>
          </div>
        </div>

        {/* Network Growth */}
        <div>
          <h4 className="font-semibold mb-4 flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Network Growth Over Time
          </h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={networkGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="connections" stroke="#8884d8" strokeWidth={2} />
              <Line type="monotone" dataKey="groups" stroke="#82ca9d" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Location Distribution */}
          <div>
            <h4 className="font-semibold mb-4">Connections by Location</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={locationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} (${percentage}%)`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {locationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Top Skills */}
          <div>
            <h4 className="font-semibold mb-4">Most Common Skills</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={topSkills} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="skill" type="category" width={80} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trust Score Distribution */}
        <div>
          <h4 className="font-semibold mb-4">Trust Score Distribution</h4>
          <div className="grid grid-cols-5 gap-2 mb-4">
            {trustScoreData.map((item, index) => (
              <div key={item.range} className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-lg font-bold" style={{ color: COLORS[index] }}>
                  {item.count}
                </p>
                <p className="text-xs text-gray-600">{item.range}</p>
                <p className="text-xs text-gray-500">{item.percentage}%</p>
              </div>
            ))}
          </div>
        </div>

        {/* Network Insights */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h4 className="font-semibold mb-2 text-blue-900">Network Insights</h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>• Your network has an average trust score of {avgTrustScore}%, which is excellent!</p>
            <p>• You're connected to people in {Object.keys(locationData).length} different locations.</p>
            <p>• Your most common connection skills are: {topSkills.slice(0, 3).map(s => s.skill).join(", ")}.</p>
            <p>• You've joined {myGroups.length} groups, helping you stay engaged with your community.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkAnalytics;
