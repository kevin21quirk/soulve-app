
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Star, 
  Award, 
  Target,
  Calendar,
  BarChart3
} from "lucide-react";
import { useRealConnections } from "@/services/realConnectionsService";

const NetworkInsights = () => {
  const { data: connections = [] } = useRealConnections();

  const acceptedConnections = connections.filter(conn => conn.status === 'accepted');
  const pendingConnections = connections.filter(conn => conn.status === 'pending');

  const networkStats = {
    totalConnections: acceptedConnections.length,
    pendingRequests: pendingConnections.length,
    networkGrowth: 15, // Mock data
    trustScore: 85, // Mock data
    helpfulActions: 23, // Mock data
    communitiesJoined: 5, // Mock data
  };

  const achievements = [
    { icon: Users, title: "Community Builder", description: "Connected with 10+ people", earned: true },
    { icon: Star, title: "Trusted Helper", description: "85% trust score", earned: true },
    { icon: Globe, title: "Global Connector", description: "Connected across 3+ cities", earned: false },
    { icon: Award, title: "Campaign Champion", description: "Participated in 5+ campaigns", earned: false },
  ];

  const insights = [
    {
      title: "Network Growth",
      value: `+${networkStats.networkGrowth}%`,
      description: "This month",
      trend: "up",
      color: "text-green-600"
    },
    {
      title: "Trust Score",
      value: `${networkStats.trustScore}%`,
      description: "Above average",
      trend: "up",
      color: "text-blue-600"
    },
    {
      title: "Community Impact",
      value: `${networkStats.helpfulActions}`,
      description: "Helpful actions",
      trend: "up",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>Network Overview</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{networkStats.totalConnections}</div>
              <div className="text-sm text-gray-500">Total Connections</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{networkStats.pendingRequests}</div>
              <div className="text-sm text-gray-500">Pending Requests</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{networkStats.communitiesJoined}</div>
              <div className="text-sm text-gray-500">Communities Joined</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>Key Insights</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-500">{insight.description}</p>
              </div>
              <div className={`text-right ${insight.color}`}>
                <div className="text-2xl font-bold">{insight.value}</div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3" />
                  <span className="text-xs">Trending up</span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Trust Score Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Trust Score Progress</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Current Trust Score</span>
              <span className="text-lg font-bold text-blue-600">{networkStats.trustScore}%</span>
            </div>
            <Progress value={networkStats.trustScore} className="h-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Ways to improve:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Complete profile verification</li>
                  <li>• Participate in more campaigns</li>
                  <li>• Get recommendations from connections</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Benefits of higher score:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Priority in help requests</li>
                  <li>• Access to exclusive groups</li>
                  <li>• Featured in recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span>Achievements</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg flex items-center space-x-3 ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <IconComponent 
                    className={`h-8 w-8 ${
                      achievement.earned ? 'text-green-600' : 'text-gray-400'
                    }`} 
                  />
                  <div className="flex-1">
                    <h4 className={`font-medium ${
                      achievement.earned ? 'text-green-900' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className={`text-sm ${
                      achievement.earned ? 'text-green-700' : 'text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-green-600 text-white">
                      Earned
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Network Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <span>Recent Network Activity</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "Connected with Sarah Johnson", time: "2 hours ago", type: "connection" },
              { action: "Joined 'Community Garden' group", time: "1 day ago", type: "group" },
              { action: "Participated in 'Clean Streets' campaign", time: "3 days ago", type: "campaign" },
              { action: "Helped with moving assistance", time: "5 days ago", type: "help" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-blue-200 bg-blue-50">
                <Target className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
                <Badge variant="outline" className="text-xs">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInsights;
