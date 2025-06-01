
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Users, 
  Award, 
  Calendar,
  BarChart3,
  Heart,
  Clock,
  DollarSign,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ImpactAnalyticsService, UserImpactData, CommunityComparison, ImpactGoal } from '@/services/impactAnalyticsService';
import { useImpactTracking } from '@/hooks/useImpactTracking';
import ImpactMetricsCard from './ImpactMetricsCard';
import CommunityComparisonChart from './CommunityComparisonChart';
import ImpactTrendsChart from './ImpactTrendsChart';
import GoalsManager from './GoalsManager';
import ActivityTracker from './ActivityTracker';
import RecentActivitiesFeed from './RecentActivitiesFeed';

const InteractiveImpactDashboard = () => {
  const { user } = useAuth();
  const { refreshImpactMetrics } = useImpactTracking();
  const [activeTab, setActiveTab] = useState('overview');
  const [impactData, setImpactData] = useState<UserImpactData | null>(null);
  const [communityComparisons, setCommunityComparisons] = useState<CommunityComparison[]>([]);
  const [goals, setGoals] = useState<ImpactGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  useEffect(() => {
    if (user?.id) {
      loadImpactData();
    }
  }, [user?.id]);

  const loadImpactData = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const [userData, comparisons, userGoals] = await Promise.all([
        ImpactAnalyticsService.getUserImpactData(user.id),
        ImpactAnalyticsService.getCommunityComparisons(user.id),
        ImpactAnalyticsService.getUserGoals(user.id)
      ]);

      setImpactData(userData);
      setCommunityComparisons(comparisons);
      setGoals(userGoals);
    } catch (error) {
      console.error('Error loading impact data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!user?.id) return;
    
    setRefreshing(true);
    try {
      await refreshImpactMetrics();
      await loadImpactData();
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const getImpactLevelBadge = (score: number) => {
    if (score >= 800) return { label: 'Impact Champion', color: 'bg-purple-600' };
    if (score >= 500) return { label: 'Community Leader', color: 'bg-blue-600' };
    if (score >= 200) return { label: 'Active Helper', color: 'bg-green-600' };
    if (score >= 50) return { label: 'Getting Started', color: 'bg-yellow-600' };
    return { label: 'New Member', color: 'bg-gray-600' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!impactData) return null;

  const impactLevel = getImpactLevelBadge(impactData.impactScore);

  return (
    <div className="space-y-6">
      {/* Header with Impact Level */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <Award className="h-8 w-8 text-yellow-600" />
          <h1 className="text-3xl font-bold">Your Impact Journey</h1>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="ml-4"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <Badge className={`${impactLevel.color} text-white px-4 py-2 text-lg`}>
            {impactLevel.label}
          </Badge>
          <div className="text-2xl font-bold text-gray-900">
            {impactData.impactScore} Impact Points
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            Rank #{impactData.rank}
          </Badge>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          You're in the top {100 - impactData.percentile}% of our community! 
          Keep making a difference and climbing the impact leaderboard.
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center space-x-2">
        {['7d', '30d', '90d'].map((range) => (
          <Button
            key={range}
            variant={timeRange === range ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTimeRange(range as '7d' | '30d' | '90d')}
          >
            {range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
          </Button>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ImpactMetricsCard
              title="People Helped"
              value={impactData.totalHelpProvided}
              icon={Heart}
              color="text-red-500"
              bgColor="bg-red-50"
              description="Direct help provided"
            />
            <ImpactMetricsCard
              title="Volunteer Hours"
              value={impactData.volunteerHours}
              icon={Clock}
              color="text-blue-500"
              bgColor="bg-blue-50"
              description="Time contributed"
            />
            <ImpactMetricsCard
              title="Donations Made"
              value={`$${impactData.donationAmount}`}
              icon={DollarSign}
              color="text-green-500"
              bgColor="bg-green-50"
              description="Financial support"
            />
            <ImpactMetricsCard
              title="Connections"
              value={impactData.connectionsCount}
              icon={Users}
              color="text-purple-500"
              bgColor="bg-purple-50"
              description="Network size"
            />
          </div>

          {/* Trust & Response Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-600" />
                  <span>Trust Score</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{impactData.trustScore}%</span>
                    <Badge variant="secondary">
                      {impactData.trustScore >= 90 ? 'Excellent' : 
                       impactData.trustScore >= 70 ? 'Very High' : 
                       impactData.trustScore >= 50 ? 'Good' : 'Building'}
                    </Badge>
                  </div>
                  <Progress value={impactData.trustScore} className="h-3" />
                  <p className="text-sm text-gray-600">
                    Based on community feedback and verification history
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-orange-600" />
                  <span>Response Time</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{impactData.responsesTime}h</span>
                    <Badge variant="secondary" className={
                      impactData.responsesTime <= 2 ? 'bg-green-100 text-green-800' :
                      impactData.responsesTime <= 6 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }>
                      {impactData.responsesTime <= 2 ? 'Very Fast' :
                       impactData.responsesTime <= 6 ? 'Fast' : 'Improving'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    Average time to respond to help requests
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityTracker />
          <RecentActivitiesFeed />
        </TabsContent>

        <TabsContent value="community" className="space-y-6">
          <CommunityComparisonChart comparisons={communityComparisons} />
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <ImpactTrendsChart userId={user?.id || ''} timeRange={timeRange} />
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <GoalsManager goals={goals} onGoalsChange={setGoals} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InteractiveImpactDashboard;
