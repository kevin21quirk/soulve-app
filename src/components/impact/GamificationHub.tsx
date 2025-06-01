
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Target, Flame, Star, Crown, Zap, Gift, Calendar } from 'lucide-react';
import { useRealTimePoints } from '@/hooks/useRealTimePoints';
import { useUserAchievements } from '@/hooks/useUserAchievements';
import { useSeasonalChallenges } from '@/hooks/useSeasonalChallenges';
import { useToast } from '@/hooks/use-toast';

const GamificationHub = () => {
  const { toast } = useToast();
  const { totalPoints, recentTransactions, awardPoints } = useRealTimePoints();
  const { achievements } = useUserAchievements();
  const { challenges } = useSeasonalChallenges();
  const [activeTab, setActiveTab] = useState('achievements');

  // Calculate streaks
  const calculateStreak = () => {
    const sortedTransactions = [...recentTransactions].sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    let streak = 0;
    let currentDate = new Date();
    
    for (const transaction of sortedTransactions) {
      const transactionDate = new Date(transaction.timestamp);
      const daysDiff = Math.floor((currentDate.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff <= streak + 1) {
        streak++;
        currentDate = transactionDate;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();
  const level = Math.floor(totalPoints / 100) + 1;
  const nextLevelProgress = (totalPoints % 100);

  // Mock challenges for demonstration
  const weeklyChallenge = {
    id: 'weekly-helper',
    title: 'Weekly Helper',
    description: 'Help 5 people this week',
    progress: Math.min(recentTransactions.filter(t => 
      new Date(t.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    ).length, 5),
    target: 5,
    reward: 50,
    timeLeft: '3 days'
  };

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const inProgressAchievements = achievements.filter(a => !a.unlocked && a.progress > 0);

  const handleClaimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `You earned "${achievement.title}" and gained ${achievement.pointsReward} points!`,
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          <span>Gamification Hub</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
            <TabsTrigger value="streaks">Streaks</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="achievements" className="space-y-4">
            {/* Level Progress */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-lg border border-yellow-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Level {level}</span>
                </div>
                <Badge variant="secondary">
                  {totalPoints} / {level * 100} XP
                </Badge>
              </div>
              <Progress value={nextLevelProgress} className="h-2 mb-2" />
              <p className="text-sm text-yellow-700">
                {100 - nextLevelProgress} points to level {level + 1}
              </p>
            </div>

            {/* Recent Achievements */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-500" />
                <span>Recent Achievements</span>
              </h3>
              
              {unlockedAchievements.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Trophy className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>Start helping to unlock your first achievement!</p>
                </div>
              ) : (
                unlockedAchievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium text-green-800">{achievement.title}</h4>
                      <p className="text-sm text-green-600">{achievement.description}</p>
                    </div>
                    <Badge className="bg-green-600 text-white">
                      +{achievement.pointsReward}
                    </Badge>
                  </div>
                ))
              )}
            </div>

            {/* In Progress Achievements */}
            {inProgressAchievements.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  <span>In Progress</span>
                </h3>
                
                {inProgressAchievements.map((achievement) => {
                  const progressPercent = (achievement.progress / achievement.maxProgress) * 100;
                  
                  return (
                    <div key={achievement.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl opacity-50">{achievement.icon}</span>
                          <div>
                            <h4 className="font-medium">{achievement.title}</h4>
                            <p className="text-sm text-gray-600">{achievement.description}</p>
                          </div>
                        </div>
                        <Badge variant="outline">
                          {achievement.progress}/{achievement.maxProgress}
                        </Badge>
                      </div>
                      <Progress value={progressPercent} className="h-2" />
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4">
            {/* Active Weekly Challenge */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800">Weekly Challenge</span>
                </div>
                <Badge variant="secondary" className="flex items-center space-x-1">
                  <Calendar className="h-3 w-3" />
                  <span>{weeklyChallenge.timeLeft}</span>
                </Badge>
              </div>
              
              <h3 className="font-semibold text-blue-900 mb-2">{weeklyChallenge.title}</h3>
              <p className="text-sm text-blue-700 mb-3">{weeklyChallenge.description}</p>
              
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700">Progress</span>
                <span className="text-sm font-medium text-blue-800">
                  {weeklyChallenge.progress}/{weeklyChallenge.target}
                </span>
              </div>
              <Progress 
                value={(weeklyChallenge.progress / weeklyChallenge.target) * 100} 
                className="h-2 mb-3" 
              />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-sm text-blue-700">
                  <Gift className="h-4 w-4" />
                  <span>Reward: {weeklyChallenge.reward} points</span>
                </div>
                {weeklyChallenge.progress >= weeklyChallenge.target && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Claim Reward
                  </Button>
                )}
              </div>
            </div>

            {/* Seasonal Challenges */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Zap className="h-5 w-5 text-orange-500" />
                <span>Seasonal Challenges</span>
              </h3>
              
              {challenges.slice(0, 3).map((challenge) => {
                const progressPercent = (challenge.progress / challenge.maxProgress) * 100;
                
                return (
                  <div key={challenge.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-gray-600">{challenge.description}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className="bg-orange-50 text-orange-700"
                      >
                        {challenge.pointMultiplier}x points
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-700">Progress</span>
                      <span className="text-sm font-medium">
                        {challenge.progress}/{challenge.maxProgress}
                      </span>
                    </div>
                    <Progress value={progressPercent} className="h-2" />
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="streaks" className="space-y-4">
            {/* Current Streak */}
            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-lg border border-red-200">
              <Flame className="h-16 w-16 mx-auto mb-4 text-red-500" />
              <div className="text-4xl font-bold text-red-600 mb-2">
                {currentStreak}
              </div>
              <div className="text-lg font-medium text-red-800 mb-2">
                Day Streak
              </div>
              <p className="text-sm text-red-700">
                {currentStreak === 0 
                  ? "Start helping today to begin your streak!" 
                  : `Amazing! You've been making a difference for ${currentStreak} consecutive days!`
                }
              </p>
            </div>

            {/* Streak Milestones */}
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center space-x-2">
                <Target className="h-5 w-5 text-orange-500" />
                <span>Streak Milestones</span>
              </h3>
              
              {[3, 7, 14, 30, 100].map((milestone) => {
                const achieved = currentStreak >= milestone;
                
                return (
                  <div 
                    key={milestone}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      achieved 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achieved ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                      }`}>
                        {achieved ? '✓' : milestone}
                      </div>
                      <div>
                        <div className={`font-medium ${achieved ? 'text-green-800' : 'text-gray-700'}`}>
                          {milestone} Day Streak
                        </div>
                        <div className={`text-sm ${achieved ? 'text-green-600' : 'text-gray-500'}`}>
                          {getStreakReward(milestone)} points reward
                        </div>
                      </div>
                    </div>
                    {achieved && (
                      <Badge className="bg-green-600 text-white">
                        Achieved!
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="leaderboard" className="space-y-4">
            <div className="text-center py-8">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-yellow-500" />
              <h3 className="text-lg font-semibold mb-2">Community Leaderboard</h3>
              <p className="text-gray-600 mb-4">
                See how you rank among community helpers
              </p>
              <Button className="bg-yellow-600 hover:bg-yellow-700">
                View Full Leaderboard
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

const getStreakReward = (days: number): number => {
  switch (days) {
    case 3: return 25;
    case 7: return 50;
    case 14: return 100;
    case 30: return 250;
    case 100: return 1000;
    default: return days * 5;
  }
};

export default GamificationHub;
