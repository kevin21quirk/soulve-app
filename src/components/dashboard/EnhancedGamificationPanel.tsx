
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trophy, TrendingUp, Users, Settings, BarChart3 } from "lucide-react";
import GamificationPanel from "./GamificationPanel";
import SocialFeaturesPanel from "./SocialFeaturesPanel";
import AdminCustomizationPanel from "./AdminCustomizationPanel";
import { AdvancedAnalyticsService } from "@/services/advancedAnalyticsService";
import { EnhancedAchievementsService } from "@/services/enhancedAchievementsService";
import { BackendDataService } from "@/services/backendDataService";
import { useToast } from "@/hooks/use-toast";

const EnhancedGamificationPanel = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalytics, setActiveAnalytics] = useState<any>(null);

  // Get enhanced achievement stats
  const achievementStats = EnhancedAchievementsService.getAchievementStats();

  const handleGenerateAnalytics = async () => {
    setIsLoading(true);
    try {
      // Simulate loading real analytics
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockTransactions = await BackendDataService.getUserTransactions("current-user");
      const mockUserStats = await BackendDataService.getUserStats("current-user");
      
      const trends = AdvancedAnalyticsService.analyzeTrends(mockTransactions);
      const predictions = AdvancedAnalyticsService.generatePredictions(mockTransactions, mockUserStats);
      const behavior = AdvancedAnalyticsService.analyzeBehavior(mockTransactions, mockUserStats);
      
      setActiveAnalytics({ trends, predictions, behavior });
      
      toast({
        title: "Analytics Generated! 📊",
        description: "Advanced insights and predictions are now available.",
      });
    } catch (error) {
      toast({
        title: "Analytics Error",
        description: "Failed to generate analytics. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Achievements</p>
                <p className="text-2xl font-bold">{achievementStats.total}</p>
              </div>
              <Trophy className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs">
                {achievementStats.unlocked} unlocked
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Helping Category</p>
                <p className="text-2xl font-bold">{achievementStats.byCategory.helping}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                Most Active
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Social Features</p>
                <p className="text-2xl font-bold">{achievementStats.byCategory.social}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                Connected
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Analytics Ready</p>
                <p className="text-2xl font-bold">{activeAnalytics ? '✓' : '○'}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleGenerateAnalytics}
                disabled={isLoading}
                className="text-xs"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Advanced Analytics Display */}
      {activeAnalytics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Advanced Analytics & Predictions</span>
            </CardTitle>
            <CardDescription>
              AI-powered insights into your performance and future projections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">Trend Analysis</h4>
                {activeAnalytics.trends.map((trend: any, index: number) => (
                  <div key={index} className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="capitalize">{trend.period}</span>
                      <Badge variant={
                        trend.trend === 'increasing' ? 'default' : 
                        trend.trend === 'decreasing' ? 'destructive' : 'secondary'
                      }>
                        {trend.trend} {trend.percentage.toFixed(1)}%
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      Predicted: {trend.prediction} points ({trend.confidence}% confidence)
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-blue-600">Future Predictions</h4>
                <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Next Week:</span>
                    <span className="font-medium">{activeAnalytics.predictions.nextWeekPoints} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Next Month:</span>
                    <span className="font-medium">{activeAnalytics.predictions.nextMonthPoints} points</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Trust Level:</span>
                    <Badge variant="outline" className="capitalize">
                      {activeAnalytics.predictions.trustLevelProjection.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Days to Next Level:</span>
                    <span className="font-medium">{activeAnalytics.predictions.daysToNextLevel}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-purple-600">Behavior Insights</h4>
                <div className="p-4 bg-purple-50 rounded-lg space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Most Active Time:</span>
                    <p className="font-medium">{activeAnalytics.behavior.mostActiveTime}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Preferred Help Type:</span>
                    <p className="font-medium">{activeAnalytics.behavior.preferredHelpType}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Avg Response Time:</span>
                    <p className="font-medium">{activeAnalytics.behavior.averageResponseTime.toFixed(1)} hours</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Success Rate:</span>
                    <p className="font-medium">{activeAnalytics.behavior.helpSuccessRate}%</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">Social Score:</span>
                    <p className="font-medium">{activeAnalytics.behavior.socialEngagementScore}/100</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Tabbed Interface */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="social">Social Hub</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="admin">Admin Panel</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <GamificationPanel />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialFeaturesPanel />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Enhanced Achievement System</CardTitle>
              <CardDescription>
                {achievementStats.total} total achievements across {Object.keys(achievementStats.byCategory).length} categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                {Object.entries(achievementStats.byCategory).map(([category, count]) => (
                  <div key={category} className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{category}</div>
                  </div>
                ))}
              </div>
              <GamificationPanel />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="mt-6">
          <AdminCustomizationPanel />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedGamificationPanel;
