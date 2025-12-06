import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  Clock, 
  PoundSterling, 
  Users, 
  Award, 
  Target,
  TrendingUp,
  RefreshCw,
  Trophy,
  Flame,
  Crown,
  Calendar,
  Star,
  Zap,
  Shield
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEnhancedPoints } from '@/hooks/useEnhancedPoints';
import { useRealTimePoints } from '@/hooks/useRealTimePoints';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useImpactTracking } from '@/hooks/useImpactTracking';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import ImpactTrendsChart from './ImpactTrendsChart';
import GoalsManager from './GoalsManager';
import { supabase } from '@/integrations/supabase/client';
import { ImpactAnalyticsService, ImpactGoal } from '@/services/impactAnalyticsService';

const SimplifiedImpactDashboard = () => {
  const { user } = useAuth();
  const { metrics, loading: pointsLoading, getTrustTier } = useEnhancedPoints();
  const { recentTransactions, totalPoints } = useRealTimePoints();
  const { achievements, loading: achievementsLoading } = useUserAchievements();
  const { refreshImpactMetrics } = useImpactTracking();
  const { leaderboard, userRank, loading: leaderboardLoading } = useLeaderboard('all-time', 10);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState<ImpactGoal[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);

  // Load goals
  useState(() => {
    const loadGoals = async () => {
      if (!user?.id) return;
      try {
        const userGoals = await ImpactAnalyticsService.getUserGoals(user.id);
        if (userGoals.length === 0) {
          await supabase.rpc('create_default_goals_for_user', { target_user_id: user.id });
          const newGoals = await ImpactAnalyticsService.getUserGoals(user.id);
          setGoals(newGoals);
        } else {
          setGoals(userGoals);
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setGoalsLoading(false);
      }
    };
    loadGoals();
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshImpactMetrics();
    } finally {
      setRefreshing(false);
    }
  };

  const trustTier = getTrustTier();
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const loading = pointsLoading || achievementsLoading;

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-muted rounded-lg"></div>
            ))}
          </div>
          <div className="h-64 bg-muted rounded-lg"></div>
        </div>
      </div>
    );
  }

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      help_completed: 'Help Given',
      donation: 'Donation',
      volunteer_work: 'Volunteering',
      help_received: 'Help Received',
      connection: 'Connection',
      post_engagement: 'Engagement'
    };
    return labels[category] || category.replace('_', ' ');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'help_completed': return <Users className="h-4 w-4" />;
      case 'donation': return <PoundSterling className="h-4 w-4" />;
      case 'volunteer_work': return <Clock className="h-4 w-4" />;
      default: return <Zap className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Your Impact
          </h1>
          <p className="text-muted-foreground text-sm">Track your contributions and community impact</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-secondary/20">
          <TabsTrigger 
            value="overview"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="rewards"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
          >
            Points & Rewards
          </TabsTrigger>
          <TabsTrigger 
            value="goals"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground"
          >
            Goals
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Key Metrics - Prominent at top */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-red-100">
                    <Heart className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics?.help_provided_count || 0}</p>
                    <p className="text-xs text-muted-foreground">People Helped</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-blue-100">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics?.volunteer_hours || 0}h</p>
                    <p className="text-xs text-muted-foreground">Volunteer Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-green-100">
                    <PoundSterling className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">£{metrics?.donation_amount || 0}</p>
                    <p className="text-xs text-muted-foreground">Donated</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-purple-100">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{metrics?.connections_count || 0}</p>
                    <p className="text-xs text-muted-foreground">Connections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trust Score & Points Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span>Trust Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-blue-600">{metrics?.trust_score || 0}%</span>
                  <Badge className={`${trustTier.bgColor} ${trustTier.color}`}>
                    {trustTier.name}
                  </Badge>
                </div>
                <Progress value={metrics?.trust_score || 0} className="h-2" />
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Impact Points</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-bold text-yellow-600">{totalPoints.toLocaleString()}</span>
                  <div className="text-right">
                    <Badge variant="secondary">
                      {unlockedAchievements}/{achievements.length} badges
                    </Badge>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  Keep helping to earn more points
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Impact Trends Chart */}
          {user?.id && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <span>Your Impact Over Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ImpactTrendsChart userId={user.id} timeRange="30d" />
              </CardContent>
            </Card>
          )}

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Recent Activities</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Heart className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Start helping to see your activities here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          {getCategoryIcon(transaction.category)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-muted-foreground">
                            {getCategoryLabel(transaction.category)} • {new Date(transaction.timestamp).toLocaleDateString('en-GB')}
                          </p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="font-semibold">
                        +{transaction.points} pts
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Points & Rewards Tab */}
        <TabsContent value="rewards" className="space-y-6 mt-6">
          {/* Points Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  <span>Points Summary</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Impact Points</span>
                  <span className="text-xl font-bold text-yellow-600">{metrics?.impact_score?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="font-medium">XP Points</span>
                  <span className="text-xl font-bold text-purple-600">{metrics?.xp_points?.toLocaleString() || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Trust Score</span>
                  <span className="text-xl font-bold text-blue-600">{metrics?.trust_score || 0}%</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Flame className="h-5 w-5 text-orange-600" />
                  <span>Activity Streak</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
                  <div className="text-4xl font-bold text-orange-600">
                    {recentTransactions.length > 0 ? 
                      Math.min(7, recentTransactions.length) : 0} days
                  </div>
                  <p className="text-sm text-muted-foreground">Current streak</p>
                  <div className="flex justify-center space-x-1">
                    {[...Array(7)].map((_, i) => (
                      <div 
                        key={i} 
                        className={`w-8 h-8 rounded ${i < Math.min(7, recentTransactions.length) ? 'bg-orange-500' : 'bg-muted'}`}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-primary" />
                  <span>Achievements</span>
                </div>
                <Badge variant="secondary">{unlockedAchievements}/{achievements.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {achievements.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Achievements will appear as you make an impact</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {achievements.slice(0, 6).map((achievement) => (
                    <div 
                      key={achievement.id} 
                      className={`p-3 rounded-lg border ${
                        achievement.unlocked 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-green-200' : 'bg-muted'}`}>
                          <Trophy className={`h-4 w-4 ${achievement.unlocked ? 'text-green-700' : 'text-muted-foreground'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">{achievement.title}</p>
                            {achievement.unlocked && (
                              <Badge className="bg-green-500 text-white text-xs">Unlocked</Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <Progress 
                                value={(achievement.progress / achievement.maxProgress) * 100} 
                                className="h-1"
                              />
                              <p className="text-xs text-muted-foreground mt-1">
                                {achievement.progress}/{achievement.maxProgress}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <span>Community Leaderboard</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {leaderboardLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-12 bg-muted rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No leaderboard data yet</p>
                  <p className="text-sm">Be the first to make an impact!</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((entry, index) => {
                    const isCurrentUser = entry.userId === user?.id;
                    return (
                      <div 
                        key={entry.userId}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          isCurrentUser ? 'bg-primary/10 border border-primary/20' : 'bg-secondary/30'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                            index === 0 ? 'bg-yellow-500 text-white' :
                            index === 1 ? 'bg-gray-400 text-white' :
                            index === 2 ? 'bg-orange-500 text-white' :
                            'bg-muted text-muted-foreground'
                          }`}>
                            {entry.rank}
                          </div>
                          <span className={`font-medium ${isCurrentUser ? 'text-primary' : ''}`}>
                            {isCurrentUser ? 'You' : entry.userName}
                          </span>
                        </div>
                        <span className="font-semibold">{entry.totalPoints.toLocaleString()} pts</span>
                      </div>
                    );
                  })}
                  {userRank && userRank > 5 && (
                    <div className="pt-2 border-t mt-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-muted text-muted-foreground">
                            {userRank}
                          </div>
                          <span className="font-medium text-primary">You</span>
                        </div>
                        <span className="font-semibold">{totalPoints.toLocaleString()} pts</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Goals Tab */}
        <TabsContent value="goals" className="mt-6">
          <GoalsManager goals={goals} onGoalsChange={setGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SimplifiedImpactDashboard;
