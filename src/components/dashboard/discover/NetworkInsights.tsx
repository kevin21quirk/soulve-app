import { useMemo, useEffect, useState } from "react";
import { useRealConnections } from "@/services/realConnectionsService";
import { useUserGroups } from "@/services/groupsService";
import { useUserCampaignParticipation } from "@/services/campaignsService";
import { useAuth } from "@/contexts/AuthContext";
import { useNetworkNavigation } from "@/hooks/useNetworkNavigation";
import { useNetworkRecommendations } from "@/hooks/useNetworkRecommendations";
import { useNetworkAnalytics } from "@/hooks/useNetworkAnalytics";
import { useNetworkGamification } from "@/hooks/useNetworkGamification";

// Refactored components
import NetworkOverviewCard from "./network-insights/NetworkOverviewCard";
import SmartRecommendationsCard from "./network-insights/SmartRecommendationsCard";
import NetworkAnalyticsCard from "./network-insights/NetworkAnalyticsCard";
import DailyChallengesCard from "./network-insights/DailyChallengesCard";
import TrustScoreCard from "./network-insights/TrustScoreCard";

// Keep remaining components inline for now
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy,
  Award,
  Star,
  Calendar,
  UserPlus,
  Users,
  Globe,
  MapPin
} from "lucide-react";

const NetworkInsights = () => {
  const { user } = useAuth();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const { data: connections = [], isLoading } = useRealConnections();
  const { data: userGroups = [] } = useUserGroups();
  const { data: userCampaigns = [] } = useUserCampaignParticipation();
  
  const navigation = useNetworkNavigation();
  const { recommendations } = useNetworkRecommendations();
  const { analytics } = useNetworkAnalytics();
  const { challenges, leaderboard, userStats } = useNetworkGamification();

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdate(Date.now());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Process connections data with real-time updates
  const { acceptedConnections, pendingConnections, networkStats } = useMemo(() => {
    const accepted = connections.filter(conn => conn.status === 'accepted');
    const pending = connections.filter(conn => conn.status === 'pending' && conn.addressee_id === user?.id);
    
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentConnections = accepted.filter(conn => 
      new Date(conn.created_at) > thirtyDaysAgo
    ).length;
    
    const baseScore = 50;
    const connectionBonus = Math.min(accepted.length * 3, 30);
    const groupBonus = Math.min(userGroups.length * 5, 15);
    const campaignBonus = Math.min(userCampaigns.length * 2, 10);
    const trustScore = Math.min(baseScore + connectionBonus + groupBonus + campaignBonus, 100);
    
    const stats = {
      totalConnections: accepted.length,
      pendingRequests: pending.length,
      networkGrowth: recentConnections,
      trustScore,
      helpfulActions: userCampaigns.length + userGroups.length,
      communitiesJoined: userGroups.length,
      weeklyGrowth: analytics.growthTrends[0]?.connections || 0,
      monthlyGrowth: analytics.growthTrends[1]?.connections || 0
    };
    
    return { acceptedConnections: accepted, pendingConnections: pending, networkStats: stats };
  }, [connections, userGroups, userCampaigns, user?.id, analytics.growthTrends, lastUpdate]);

  // Enhanced insights with actions
  const insights = [
    {
      title: "Network Growth",
      value: networkStats.networkGrowth > 0 ? `+${networkStats.networkGrowth}` : "0",
      description: `${networkStats.weeklyGrowth > 0 ? '+' + networkStats.weeklyGrowth : '0'} this week`,
      trend: (networkStats.networkGrowth > networkStats.weeklyGrowth ? "up" : networkStats.networkGrowth < networkStats.weeklyGrowth ? "down" : "neutral") as "up" | "down" | "neutral",
      color: networkStats.networkGrowth > 0 ? "text-green-600" : "text-gray-500",
      actionable: networkStats.networkGrowth === 0,
      action: () => navigation.navigateToDiscover(),
      actionLabel: "Find People"
    },
    {
      title: "Trust Score",
      value: `${networkStats.trustScore}%`,
      description: networkStats.trustScore >= 75 ? "Excellent reputation!" : networkStats.trustScore >= 50 ? "Building trust" : "Get started",
      trend: "up" as "up" | "down" | "neutral",
      color: networkStats.trustScore >= 75 ? "text-green-600" : networkStats.trustScore >= 50 ? "text-blue-600" : "text-yellow-600",
      actionable: networkStats.trustScore < 75,
      action: () => navigation.navigateToProfile(),
      actionLabel: "Improve Score"
    },
    {
      title: "Community Impact",
      value: `${networkStats.helpfulActions}`,
      description: `Level ${userStats.level} • ${analytics.socialProof.helpedPeople} people helped`,
      trend: "up" as "up" | "down" | "neutral",
      color: networkStats.helpfulActions > 5 ? "text-purple-600" : "text-blue-500",
      actionable: networkStats.helpfulActions === 0,
      action: () => navigation.navigateToCampaigns(),
      actionLabel: "Start Helping"
    },
    {
      title: "Geographic Reach",
      value: `${analytics.geographicSpread.locations.length}`,
      description: `${Math.round(analytics.geographicSpread.diversity)}% diversity`,
      trend: (analytics.geographicSpread.locations.length > 1 ? "up" : "neutral") as "up" | "down" | "neutral",
      color: analytics.geographicSpread.locations.length > 3 ? "text-green-600" : "text-blue-500",
      actionable: analytics.geographicSpread.locations.length <= 1,
      action: () => navigation.navigateToDiscover(),
      actionLabel: "Expand Network"
    }
  ];

  // Generate recent activity with real-time feel
  const recentActivity = useMemo(() => {
    const activities = [];
    
    acceptedConnections.slice(-3).forEach(conn => {
      const partner = conn.requester_id === user?.id ? conn.addressee : conn.requester;
      const partnerName = partner ? 
        `${partner.first_name || ''} ${partner.last_name || ''}`.trim() || 'Someone' : 'Someone';
      
      activities.push({
        action: `Connected with ${partnerName}`,
        time: new Date(conn.created_at).toLocaleDateString(),
        type: "connection",
        icon: Users,
        fresh: Date.now() - new Date(conn.created_at).getTime() < 24 * 60 * 60 * 1000
      });
    });
    
    userGroups.slice(-2).forEach(group => {
      activities.push({
        action: `Joined '${group.name}' community`,
        time: new Date(group.created_at).toLocaleDateString(),
        type: "group",
        icon: Globe,
        fresh: Date.now() - new Date(group.created_at).getTime() < 24 * 60 * 60 * 1000
      });
    });
    
    return activities
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 5);
  }, [acceptedConnections, userGroups, user?.id]);

  // Enhanced achievements
  const achievements = [
    { 
      icon: Users, 
      title: "First Connection", 
      description: "Made your first meaningful connection", 
      earned: networkStats.totalConnections >= 1,
      progress: Math.min(networkStats.totalConnections, 1),
      maxProgress: 1
    },
    { 
      icon: Globe, 
      title: "Community Explorer", 
      description: "Joined your first community group", 
      earned: networkStats.communitiesJoined >= 1,
      progress: Math.min(networkStats.communitiesJoined, 1),
      maxProgress: 1
    },
    { 
      icon: Star, 
      title: "Trusted Member", 
      description: "Reached 75% trust score", 
      earned: networkStats.trustScore >= 75,
      progress: Math.min(networkStats.trustScore / 75, 1),
      maxProgress: 1
    },
    { 
      icon: Award, 
      title: "Active Participant", 
      description: "Participated in 2+ community campaigns", 
      earned: userCampaigns.length >= 2,
      progress: Math.min(userCampaigns.length / 2, 1),
      maxProgress: 2
    },
    {
      icon: Trophy,
      title: "Community Champion",
      description: "Reached Level 5 in community rankings",
      earned: userStats.level >= 5,
      progress: Math.min(userStats.level / 5, 1),
      maxProgress: 5
    },
    {
      icon: Trophy,
      title: "Network Builder",
      description: "Connected with 10+ community members",
      earned: networkStats.totalConnections >= 10,
      progress: Math.min(networkStats.totalConnections / 10, 1),
      maxProgress: 10
    }
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your network insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <NetworkOverviewCard 
        networkStats={networkStats}
        userStats={userStats}
        analyticsData={analytics}
      />

      {/* AI-Powered Smart Recommendations */}
      <SmartRecommendationsCard recommendations={recommendations} />

      {/* Enhanced Key Insights with Actions */}
      <NetworkAnalyticsCard insights={insights} />

      {/* Gamification: Daily Challenges */}
      <DailyChallengesCard challenges={challenges} />

      {/* Enhanced Trust Score Progress */}
      <TrustScoreCard 
        trustScore={networkStats.trustScore}
        totalConnections={networkStats.totalConnections}
        communitiesJoined={networkStats.communitiesJoined}
        userCampaigns={userCampaigns.length}
      />

      {/* Community Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            <span>Community Leaderboard</span>
            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">This Week</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry) => (
              <div 
                key={entry.rank} 
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  entry.isCurrentUser 
                    ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-300' 
                    : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    entry.rank === 1 ? 'bg-yellow-500 text-white' :
                    entry.rank === 2 ? 'bg-gray-400 text-white' :
                    entry.rank === 3 ? 'bg-amber-600 text-white' :
                    'bg-gray-200 text-gray-700'
                  }`}>
                    {entry.rank}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{entry.name}</div>
                    <div className="text-xs text-gray-500">{entry.badge}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{entry.score.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-purple-500" />
            <span>Achievements & Badges</span>
            <Badge variant="secondary">{achievements.filter(a => a.earned).length}/{achievements.length}</Badge>
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
                      ? 'bg-green-50 border-green-200 shadow-sm scale-105' 
                      : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="relative">
                    <IconComponent 
                      className={`h-8 w-8 ${
                        achievement.earned ? 'text-green-600' : 'text-gray-400'
                      }`} 
                    />
                    {achievement.earned && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Star className="h-2 w-2 text-white" />
                      </div>
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
                        <div className="flex justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{Math.min(achievement.progress, achievement.maxProgress)}/{achievement.maxProgress}</span>
                        </div>
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

      {/* Real-time Network Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <span>Recent Network Activity</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live updates</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const IconComponent = activity.icon;
                return (
                  <div key={index} className={`flex items-center space-x-3 p-3 border-l-4 rounded-r-lg transition-all ${
                    activity.fresh 
                      ? 'border-green-500 bg-green-50 animate-pulse' 
                      : 'border-blue-200 bg-blue-50'
                  }`}>
                    <IconComponent className={`h-4 w-4 ${activity.fresh ? 'text-green-600' : 'text-blue-600'}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                      {activity.fresh && (
                        <Badge className="bg-green-600 text-white text-xs">
                          New
                        </Badge>
                      )}
                    </div>
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
                <Button variant="gradient" size="sm" onClick={navigation.navigateToDiscover}>
                  <UserPlus className="h-4 w-4 mr-1" />
                  Find Your First Connection
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Social Proof & Network Impact */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-purple-500" />
            <span>Network Impact</span>
            <Badge className="bg-purple-600 text-white">Social Proof</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-purple-600">{analytics.socialProof.helpedPeople}</div>
              <div className="text-sm text-gray-600">People Helped</div>
              <div className="text-xs text-gray-500 mt-1">Through your campaigns</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-blue-600">{analytics.socialProof.introductions}</div>
              <div className="text-sm text-gray-600">Introductions Made</div>
              <div className="text-xs text-gray-500 mt-1">Connecting others</div>
            </div>
            <div className="text-center p-4">
              <div className="text-3xl font-bold text-green-600">{Math.round(analytics.influence.networkReach)}</div>
              <div className="text-sm text-gray-600">Network Reach</div>
              <div className="text-xs text-gray-500 mt-1">Potential connections</div>
            </div>
          </div>
          
          {analytics.geographicSpread.locations.length > 0 && (
            <div className="mt-6 pt-6 border-t border-purple-200">
              <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Geographic Presence
              </h5>
              <div className="flex flex-wrap gap-2">
                {analytics.geographicSpread.locations.slice(0, 6).map((location, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {location}
                  </Badge>
                ))}
                {analytics.geographicSpread.locations.length > 6 && (
                  <Badge variant="outline" className="text-xs">
                    +{analytics.geographicSpread.locations.length - 6} more
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NetworkInsights;
