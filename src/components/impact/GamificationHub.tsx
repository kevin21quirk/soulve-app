
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Target, 
  Flame, 
  Users, 
  Award, 
  Star, 
  Gift,
  Crown,
  Zap,
  Calendar
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const GamificationHub = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('achievements');

  // Mock data for demonstration
  const achievements = [
    {
      id: '1',
      title: 'First Helper',
      description: 'Help your first person in need',
      icon: '🤝',
      progress: 1,
      maxProgress: 1,
      points: 50,
      rarity: 'common',
      unlocked: true,
      unlockedAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Community Champion',
      description: 'Help 100 people in your community',
      icon: '👑',
      progress: 67,
      maxProgress: 100,
      points: 500,
      rarity: 'legendary',
      unlocked: false
    },
    {
      id: '3',
      title: 'Trust Builder',
      description: 'Achieve 90% trust score',
      icon: '🛡️',
      progress: 85,
      maxProgress: 90,
      points: 200,
      rarity: 'rare',
      unlocked: false
    }
  ];

  const challenges = [
    {
      id: '1',
      title: 'Weekly Helper',
      description: 'Help 5 people this week',
      progress: 3,
      target: 5,
      timeLeft: '4 days',
      reward: 100,
      difficulty: 'Easy'
    },
    {
      id: '2',
      title: 'Social Butterfly',
      description: 'Make 10 new connections',
      progress: 7,
      target: 10,
      timeLeft: '2 weeks',
      reward: 200,
      difficulty: 'Medium'
    }
  ];

  const streaks = [
    {
      id: '1',
      title: 'Daily Login',
      current: 12,
      best: 25,
      icon: '📅'
    },
    {
      id: '2',
      title: 'Weekly Help',
      current: 3,
      best: 8,
      icon: '🤝'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Johnson', points: 2450, avatar: '👩‍💼' },
    { rank: 2, name: 'Mike Chen', points: 2100, avatar: '👨‍💻' },
    { rank: 3, name: 'You', points: 1850, avatar: '👤' },
    { rank: 4, name: 'Emma Wilson', points: 1600, avatar: '👩‍🎓' },
    { rank: 5, name: 'Alex Garcia', points: 1400, avatar: '👨‍🏫' }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            <span>Gamification Hub</span>
          </CardTitle>
          <CardDescription>
            Track your achievements, complete challenges, and climb the leaderboard
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger 
            value="achievements"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Award className="h-4 w-4 mr-2" />
            Achievements
          </TabsTrigger>
          <TabsTrigger 
            value="challenges"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Target className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger 
            value="streaks"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Flame className="h-4 w-4 mr-2" />
            Streaks
          </TabsTrigger>
          <TabsTrigger 
            value="leaderboard"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Crown className="h-4 w-4 mr-2" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`transition-all duration-200 ${
                achievement.unlocked 
                  ? 'bg-green-50 border-green-200 hover:shadow-lg' 
                  : achievement.progress >= achievement.maxProgress
                  ? 'bg-yellow-50 border-yellow-200 animate-pulse'
                  : 'hover:shadow-md'
              }`}>
                <CardContent className="p-4">
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
                    {achievement.unlocked && (
                      <Badge className="bg-green-500 text-white">
                        <Award className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{challenge.title}</h4>
                      <Badge className={getDifficultyColor(challenge.difficulty)}>
                        {challenge.difficulty}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{challenge.progress}/{challenge.target}</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.target) * 100} 
                        className="h-2"
                      />
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">{challenge.timeLeft} left</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Gift className="h-4 w-4 text-purple-500" />
                        <span className="font-medium">{challenge.reward} points</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="streaks" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {streaks.map((streak) => (
              <Card key={streak.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center space-y-3">
                    <div className="text-3xl">{streak.icon}</div>
                    <h4 className="font-medium">{streak.title}</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-orange-600">
                        {streak.current} days
                      </div>
                      <div className="text-sm text-gray-600">
                        Current streak
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Best: </span>
                        <span className="font-medium">{streak.best} days</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Crown className="h-5 w-5 text-yellow-600" />
                <span>Community Leaderboard</span>
              </CardTitle>
              <CardDescription>
                See how you rank among community helpers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div 
                    key={entry.rank} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      entry.name === 'You' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-500 text-white' :
                        'bg-gray-200 text-gray-700'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="text-2xl">{entry.avatar}</div>
                      <div>
                        <div className={`font-medium ${entry.name === 'You' ? 'text-blue-700' : ''}`}>
                          {entry.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entry.points.toLocaleString()} points
                        </div>
                      </div>
                    </div>
                    {entry.rank <= 3 && (
                      <div className="text-2xl">
                        {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamificationHub;
