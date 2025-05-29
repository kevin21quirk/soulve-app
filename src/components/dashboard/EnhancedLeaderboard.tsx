
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, TrendingUp, Users, Crown } from "lucide-react";
import { LeaderboardService } from "@/services/leaderboardService";
import { LeaderboardEntry } from "@/types/gamification";

const EnhancedLeaderboard = () => {
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'all-time'>('all-time');
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(
    LeaderboardService.getLeaderboard(activeTab)
  );

  const handleTabChange = (tab: 'weekly' | 'monthly' | 'all-time') => {
    setActiveTab(tab);
    setLeaderboard(LeaderboardService.getLeaderboard(tab));
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
    }
  };

  const getTrustLevelColor = (trustLevel: string) => {
    const colors = {
      'new_user': 'bg-gray-100 text-gray-800',
      'verified_helper': 'bg-blue-100 text-blue-800',
      'trusted_helper': 'bg-green-100 text-green-800',
      'community_leader': 'bg-purple-100 text-purple-800',
      'impact_champion': 'bg-yellow-100 text-yellow-800'
    };
    return colors[trustLevel as keyof typeof colors] || colors.new_user;
  };

  const getPointsForTab = (entry: LeaderboardEntry) => {
    switch (activeTab) {
      case 'weekly': return entry.weeklyPoints;
      case 'monthly': return entry.monthlyPoints;
      default: return entry.totalPoints;
    }
  };

  const currentUser = leaderboard.find(entry => entry.userId === 'current-user');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Community Leaderboard</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => handleTabChange(value as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="all-time">All Time</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-4">
            {/* Current User Highlight */}
            {currentUser && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(currentUser.rank)}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={currentUser.avatar} />
                      <AvatarFallback>{currentUser.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">Your Rank</p>
                      <p className="text-xs text-gray-600">{currentUser.userName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-blue-600">{getPointsForTab(currentUser)}</div>
                    <div className="text-xs text-gray-500">points</div>
                  </div>
                </div>
              </div>
            )}

            {/* Top Performers */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Top Performers</h4>
                <Badge variant="outline" className="text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  {leaderboard.length} participants
                </Badge>
              </div>

              {leaderboard.slice(0, 10).map((entry) => (
                <div 
                  key={entry.userId} 
                  className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                    entry.userId === 'current-user' 
                      ? 'bg-blue-50 border border-blue-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getRankIcon(entry.rank)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.avatar} />
                      <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-sm">{entry.userName}</p>
                        {entry.userId === 'current-user' && (
                          <Badge variant="secondary" className="text-xs">You</Badge>
                        )}
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getTrustLevelColor(entry.trustLevel)}`}
                      >
                        {entry.trustLevel.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-bold text-gray-900">
                      {getPointsForTab(entry).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">points</div>
                    
                    {activeTab !== 'all-time' && (
                      <div className="flex items-center text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        +{entry.weeklyPoints}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* View Full Leaderboard */}
            {leaderboard.length > 10 && (
              <div className="mt-4 text-center">
                <Button variant="outline" size="sm">
                  View Full Leaderboard
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedLeaderboard;
