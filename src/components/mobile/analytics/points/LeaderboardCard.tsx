
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award } from "lucide-react";

interface LeaderboardCardProps {
  userRank: number;
  userStats: any;
  leaderboard: any[];
}

const LeaderboardCard = ({ userRank, userStats, leaderboard }: LeaderboardCardProps) => {
  return (
    <>
      {/* User Rank */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-lg">Your Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">#{userRank}</div>
            <div className="text-sm text-gray-600">Community Rank</div>
            <Badge variant="outline" className="mt-2">
              {userStats.totalPoints} points
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Top 5 Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Community Members</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {leaderboard.slice(0, 5).map((entry) => (
              <div 
                key={entry.userId} 
                className={`flex items-center justify-between p-2 rounded-lg ${
                  entry.userId === 'current-user' ? 'bg-blue-50' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-6 text-center">
                    {entry.rank === 1 && <Trophy className="h-4 w-4 text-yellow-500 mx-auto" />}
                    {entry.rank === 2 && <Award className="h-4 w-4 text-gray-400 mx-auto" />}
                    {entry.rank === 3 && <Award className="h-4 w-4 text-amber-600 mx-auto" />}
                    {entry.rank > 3 && <span className="text-xs font-bold">#{entry.rank}</span>}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{entry.userName}</p>
                    {entry.userId === 'current-user' && (
                      <Badge variant="secondary" className="text-xs">You</Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-sm">{entry.totalPoints}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default LeaderboardCard;
