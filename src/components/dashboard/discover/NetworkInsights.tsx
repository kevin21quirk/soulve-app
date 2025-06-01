
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Globe, 
  Star, 
  Award, 
  Target,
  Calendar,
  BarChart3,
  UserPlus,
  MessageSquare,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { useRealConnections } from "@/services/realConnectionsService";
import { useUserGroups } from "@/services/groupsService";
import { useUserCampaignParticipation } from "@/services/campaignsService";
import { useAuth } from "@/contexts/AuthContext";
import { useMemo } from "react";

const NetworkInsights = () => {
  const { user } = useAuth();
  const { data: connections = [] } = useRealConnections();
  const { data: userGroups = [] } = useUserGroups();
  const { data: userCampaigns = [] } = useUserCampaignParticipation();

  // Process connections data
  const { acceptedConnections, pendingConnections, networkStats } = useMemo(() => {
    const accepted = connections.filter(conn => conn.status === 'accepted');
    const pending = connections.filter(conn => conn.status === 'pending' && conn.addressee_id === user?.id);
    
    // Calculate network growth based on recent connections (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentConnections = accepted.filter(conn => 
      new Date(conn.created_at) > thirtyDaysAgo
    ).length;
    
    // Calculate trust score with more nuanced logic
    const baseScore = 50;
    const connectionBonus = Math.min(accepted.length * 3, 30); // Max 30 points from connections
    const groupBonus = Math.min(userGroups.length * 5, 15); // Max 15 points from groups
    const campaignBonus = Math.min(userCampaigns.length * 2, 10); // Max 10 points from campaigns
    const trustScore = Math.min(baseScore + connectionBonus + groupBonus + campaignBonus, 100);
    
    const stats = {
      totalConnections: accepted.length,
      pendingRequests: pending.length,
      networkGrowth: recentConnections,
      trustScore,
      helpfulActions: userCampaigns.length + userGroups.length,
      communitiesJoined: userGroups.length,
    };
    
    return { acceptedConnections: accepted, pendingConnections: pending, networkStats: stats };
  }, [connections, userGroups, userCampaigns, user?.id]);

  // More realistic achievement thresholds
  const achievements = [
    { 
      icon: Users, 
      title: "First Connection", 
      description: "Made your first connection", 
      earned: networkStats.totalConnections >= 1,
      progress: Math.min(networkStats.totalConnections, 1)
    },
    { 
      icon: Globe, 
      title: "Community Explorer", 
      description: "Joined your first group", 
      earned: networkStats.communitiesJoined >= 1,
      progress: Math.min(networkStats.communitiesJoined, 1)
    },
    { 
      icon: Star, 
      title: "Trusted Member", 
      description: "Reached 75% trust score", 
      earned: networkStats.trustScore >= 75,
      progress: Math.min(networkStats.trustScore / 75, 1)
    },
    { 
      icon: Award, 
      title: "Active Participant", 
      description: "Participated in 2+ campaigns", 
      earned: userCampaigns.length >= 2,
      progress: Math.min(userCampaigns.length / 2, 1)
    },
  ];

  const insights = [
    {
      title: "Network Growth",
      value: networkStats.networkGrowth > 0 ? `+${networkStats.networkGrowth}` : "0",
      description: "New connections this month",
      trend: networkStats.networkGrowth > 0 ? "up" : "neutral",
      color: networkStats.networkGrowth > 0 ? "text-green-600" : "text-gray-500",
      actionable: networkStats.networkGrowth === 0
    },
    {
      title: "Trust Score",
      value: `${networkStats.trustScore}%`,
      description: networkStats.trustScore >= 75 ? "Excellent reputation!" : "Keep building trust",
      trend: "up",
      color: networkStats.trustScore >= 75 ? "text-green-600" : networkStats.trustScore >= 50 ? "text-blue-600" : "text-yellow-600",
      actionable: networkStats.trustScore < 75
    },
    {
      title: "Community Impact",
      value: `${networkStats.helpfulActions}`,
      description: networkStats.helpfulActions > 5 ? "Highly active" : "Growing participation",
      trend: "up",
      color: networkStats.helpfulActions > 5 ? "text-purple-600" : "text-blue-500",
      actionable: networkStats.helpfulActions === 0
    }
  ];

  // Generate meaningful recent activity
  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Recent connections
    acceptedConnections.slice(-3).forEach(conn => {
      const partner = conn.requester_id === user?.id ? conn.addressee : conn.requester;
      const partnerName = partner ? 
        `${partner.first_name || ''} ${partner.last_name || ''}`.trim() || 'Someone' : 'Someone';
      
      activities.push({
        action: `Connected with ${partnerName}`,
        time: new Date(conn.created_at).toLocaleDateString(),
        type: "connection",
        icon: Users
      });
    });
    
    // Recent groups
    userGroups.slice(-2).forEach(group => {
      activities.push({
        action: `Joined '${group.name}' group`,
        time: new Date(group.created_at).toLocaleDateString(),
        type: "group",
        icon: Globe
      });
    });
    
    // Sort by most recent and limit
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [acceptedConnections, userGroups, user?.id]);

  const getNextMilestone = () => {
    if (networkStats.totalConnections === 0) return "Make your first connection";
    if (networkStats.communitiesJoined === 0) return "Join your first group";
    if (networkStats.trustScore < 75) return "Reach 75% trust score";
    if (userCampaigns.length === 0) return "Participate in a campaign";
    return "You're doing great! Keep engaging";
  };

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              <span>Network Overview</span>
            </div>
            {networkStats.totalConnections > 0 && (
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <Sparkles className="h-3 w-3 mr-1" />
                Growing
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-blue-50">
              <div className="text-3xl font-bold text-blue-600">{networkStats.totalConnections}</div>
              <div className="text-sm text-gray-600">Total Connections</div>
              {networkStats.totalConnections === 0 && (
                <Button variant="outline" size="sm" className="mt-2">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Find People
                </Button>
              )}
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50">
              <div className="text-3xl font-bold text-orange-600">{networkStats.pendingRequests}</div>
              <div className="text-sm text-gray-600">Pending Requests</div>
              {networkStats.pendingRequests > 0 && (
                <Button variant="outline" size="sm" className="mt-2">
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Review
                </Button>
              )}
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50">
              <div className="text-3xl font-bold text-green-600">{networkStats.communitiesJoined}</div>
              <div className="text-sm text-gray-600">Communities Joined</div>
              {networkStats.communitiesJoined === 0 && (
                <Button variant="outline" size="sm" className="mt-2">
                  <Globe className="h-4 w-4 mr-1" />
                  Explore Groups
                </Button>
              )}
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
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{insight.title}</h4>
                <p className="text-sm text-gray-500">{insight.description}</p>
                {insight.actionable && (
                  <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800">
                    Take action <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                )}
              </div>
              <div className={`text-right ${insight.color}`}>
                <div className="text-2xl font-bold">{insight.value}</div>
                {insight.trend === "up" && (
                  <div className="flex items-center justify-end space-x-1">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-xs">Trending up</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Next Milestone */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-blue-500" />
            <span>Next Milestone</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">{getNextMilestone()}</p>
              <p className="text-sm text-gray-600 mt-1">Complete this to unlock new opportunities</p>
            </div>
            <Button variant="gradient" size="sm">
              <ArrowRight className="h-4 w-4 mr-1" />
              Get Started
            </Button>
          </div>
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
                <h5 className="font-medium text-gray-900 mb-2">How to improve:</h5>
                <ul className="space-y-1 text-gray-600">
                  <li>• Make meaningful connections ({networkStats.totalConnections}/10)</li>
                  <li>• Join active communities ({networkStats.communitiesJoined}/3)</li>
                  <li>• Participate in campaigns ({userCampaigns.length}/2)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Trust score benefits:</h5>
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
                  className={`p-4 border rounded-lg flex items-center space-x-3 transition-all ${
                    achievement.earned 
                      ? 'bg-green-50 border-green-200 shadow-sm' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="relative">
                    <IconComponent 
                      className={`h-8 w-8 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} 
                    />
                    {!achievement.earned && (
                      <div className="absolute inset-0 bg-white bg-opacity-50 rounded-full"></div>
                    )}
                  </div>
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
                    {!achievement.earned && (
                      <div className="mt-2">
                        <Progress value={achievement.progress * 100} className="h-1" />
                      </div>
                    )}
                  </div>
                  {achievement.earned && (
                    <Badge className="bg-green-600 text-white">
                      <Star className="h-3 w-3 mr-1" />
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className="flex items-center space-x-3 p-3 border-l-4 border-blue-200 bg-blue-50 rounded-r-lg">
                    <IconComponent className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-600 font-medium mb-2">Ready to get started?</p>
                <p className="text-gray-500 text-sm mb-4">Connect with people and join groups to see your activity here!</p>
                <Button variant="gradient" size="sm">
                  <UserPlus className="h-4 w-4 mr-1" />
                  Find Your First Connection
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInsights;
