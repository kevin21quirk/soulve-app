
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Users, Heart, MessageSquare, Clock, Target } from "lucide-react";

const AnalyticsDashboard = () => {
  // Sample data for charts
  const helpActivityData = [
    { week: "Week 1", helped: 3, received: 1 },
    { week: "Week 2", helped: 7, received: 2 },
    { week: "Week 3", helped: 5, received: 4 },
    { week: "Week 4", helped: 9, received: 3 },
    { week: "Week 5", helped: 12, received: 5 },
    { week: "Week 6", helped: 8, received: 2 }
  ];

  const engagementData = [
    { day: "Mon", posts: 2, likes: 15, comments: 8 },
    { day: "Tue", posts: 1, likes: 22, comments: 12 },
    { day: "Wed", posts: 3, likes: 18, comments: 6 },
    { day: "Thu", posts: 2, likes: 25, comments: 15 },
    { day: "Fri", posts: 4, likes: 30, comments: 18 },
    { day: "Sat", posts: 1, likes: 12, comments: 5 },
    { day: "Sun", posts: 2, likes: 20, comments: 10 }
  ];

  const categoryData = [
    { name: "Moving Help", value: 35, color: "#8884d8" },
    { name: "Tutoring", value: 25, color: "#82ca9d" },
    { name: "Pet Care", value: 20, color: "#ffc658" },
    { name: "Tech Support", value: 12, color: "#ff7c7c" },
    { name: "Other", value: 8, color: "#8dd1e1" }
  ];

  const impactMetrics = [
    { title: "People Helped", value: 47, change: "+15%", trend: "up" },
    { title: "Community Impact", value: "312hrs", change: "+22%", trend: "up" },
    { title: "Trust Score", value: "94%", change: "+2%", trend: "up" },
    { title: "Response Time", value: "2.3h", change: "-18%", trend: "down" }
  ];

  return (
    <div className="space-y-6">
      {/* Impact Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {impactMetrics.map((metric, index) => (
          <Card key={index}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                  <p className="text-2xl font-bold">{metric.value}</p>
                </div>
                <div className={`flex items-center space-x-1 ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  <TrendingUp className={`h-4 w-4 ${
                    metric.trend === "down" ? "rotate-180" : ""
                  }`} />
                  <span className="text-sm font-medium">{metric.change}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Help Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Help Activity Trends</span>
            </CardTitle>
            <CardDescription>Your helping patterns over the last 6 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={helpActivityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="helped" fill="#8884d8" name="People Helped" />
                <Bar dataKey="received" fill="#82ca9d" name="Help Received" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Weekly Engagement</span>
            </CardTitle>
            <CardDescription>Your daily activity and community interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="likes" stroke="#8884d8" name="Likes" />
                <Line type="monotone" dataKey="comments" stroke="#82ca9d" name="Comments" />
                <Line type="monotone" dataKey="posts" stroke="#ffc658" name="Posts" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Help Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Help Categories</span>
            </CardTitle>
            <CardDescription>Distribution of your helping activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Community Impact</span>
            </CardTitle>
            <CardDescription>Your contribution to the community</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">47</div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">312</div>
                <div className="text-sm text-gray-600">Hours Contributed</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">85</div>
                <div className="text-sm text-gray-600">Connections</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">94%</div>
                <div className="text-sm text-gray-600">Trust Score</div>
              </div>
            </div>
            
            <div className="space-y-3 pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Most Active Day</span>
                <Badge>Friday</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Favorite Category</span>
                <Badge variant="outline">Moving Help</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <Badge className="bg-green-100 text-green-700">
                  <Clock className="h-3 w-3 mr-1" />
                  2.3 hours
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
