
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Trophy, Award, Target, Gift, Crown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface UserStats {
  totalPoints: number;
  level: number;
  nextLevelPoints: number;
  helpedCount: number;
  connectionsCount: number;
  postsCount: number;
  likesReceived: number;
}

const GamificationPanel = () => {
  const { toast } = useToast();
  const [userStats] = useState<UserStats>({
    totalPoints: 1250,
    level: 5,
    nextLevelPoints: 1500,
    helpedCount: 23,
    connectionsCount: 42,
    postsCount: 15,
    likesReceived: 156
  });

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Helper",
      description: "Help your first community member",
      icon: "🤝",
      points: 50,
      unlocked: true,
      progress: 1,
      maxProgress: 1,
      rarity: "common"
    },
    {
      id: "2",
      title: "Social Butterfly",
      description: "Make 10 connections",
      icon: "🦋",
      points: 100,
      unlocked: true,
      progress: 10,
      maxProgress: 10,
      rarity: "common"
    },
    {
      id: "3",
      title: "Community Champion",
      description: "Help 25 people",
      icon: "🏆",
      points: 250,
      unlocked: false,
      progress: 23,
      maxProgress: 25,
      rarity: "rare"
    },
    {
      id: "4",
      title: "Trusted Helper",
      description: "Reach 95% trust score",
      icon: "⭐",
      points: 300,
      unlocked: true,
      progress: 95,
      maxProgress: 95,
      rarity: "epic"
    },
    {
      id: "5",
      title: "Master Networker",
      description: "Connect with 100 people",
      icon: "👑",
      points: 500,
      unlocked: false,
      progress: 42,
      maxProgress: 100,
      rarity: "legendary"
    }
  ]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-100 text-gray-700 border-gray-300";
      case "rare": return "bg-blue-100 text-blue-700 border-blue-300";
      case "epic": return "bg-purple-100 text-purple-700 border-purple-300";
      case "legendary": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  const claimReward = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && achievement.progress >= achievement.maxProgress && !achievement.unlocked) {
      setAchievements(prev => 
        prev.map(a => 
          a.id === achievementId ? { ...a, unlocked: true } : a
        )
      );
      
      toast({
        title: "Achievement Unlocked! 🎉",
        description: `You earned "${achievement.title}" and gained ${achievement.points} points!`,
      });
    }
  };

  const levelProgress = ((userStats.totalPoints % 300) / 300) * 100;

  return (
    <div className="space-y-6">
      {/* User Stats Overview */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Crown className="h-6 w-6" />
            <span>Level {userStats.level}</span>
          </CardTitle>
          <CardDescription className="text-blue-100">
            {userStats.nextLevelPoints - userStats.totalPoints} points to next level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Progress to Level {userStats.level + 1}</span>
                <span>{Math.round(levelProgress)}%</span>
              </div>
              <Progress value={levelProgress} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold">{userStats.totalPoints}</div>
                <div className="text-sm text-blue-100">Total Points</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{userStats.helpedCount}</div>
                <div className="text-sm text-blue-100">People Helped</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{userStats.connectionsCount}</div>
            <div className="text-sm text-gray-600">Connections</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{userStats.postsCount}</div>
            <div className="text-sm text-gray-600">Posts</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{userStats.likesReceived}</div>
            <div className="text-sm text-gray-600">Likes</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-purple-600">
              {achievements.filter(a => a.unlocked).length}
            </div>
            <div className="text-sm text-gray-600">Achievements</div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-5 w-5" />
            <span>Achievements</span>
          </CardTitle>
          <CardDescription>Track your progress and unlock rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-green-50 border-green-200' 
                    : achievement.progress >= achievement.maxProgress
                    ? 'bg-yellow-50 border-yellow-200 animate-pulse'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{achievement.title}</h4>
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {achievement.description}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">{achievement.points} points</span>
                      </div>
                      {!achievement.unlocked && (
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{achievement.progress}/{achievement.maxProgress}</span>
                          </div>
                          <Progress 
                            value={(achievement.progress / achievement.maxProgress) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    {achievement.unlocked ? (
                      <Badge className="bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    ) : achievement.progress >= achievement.maxProgress ? (
                      <Button 
                        size="sm" 
                        onClick={() => claimReward(achievement.id)}
                        className="bg-yellow-500 hover:bg-yellow-600"
                      >
                        <Gift className="h-4 w-4 mr-1" />
                        Claim
                      </Button>
                    ) : (
                      <Badge variant="outline">
                        <Target className="h-3 w-3 mr-1" />
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GamificationPanel;
