
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trophy, Medal, Award, Crown, Star, Shield } from "lucide-react";
import { LeaderboardEntry, TrustLevel } from "@/types/gamification";

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  timeframe?: "weekly" | "monthly" | "all-time";
}

const LeaderboardCard = ({ leaderboard, timeframe = "all-time" }: LeaderboardCardProps) => {
  const getTrustLevelIcon = (level: TrustLevel) => {
    switch (level) {
      case "new_user": return Shield;
      case "verified_helper": return Star;
      case "trusted_helper": return Award;
      case "community_leader": return Crown;
      case "impact_champion": return Trophy;
      default: return Shield;
    }
  };

  const getTrustLevelColor = (level: TrustLevel) => {
    switch (level) {
      case "new_user": return "text-gray-500";
      case "verified_helper": return "text-blue-500";
      case "trusted_helper": return "text-green-500";
      case "community_leader": return "text-purple-500";
      case "impact_champion": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-amber-600" />;
      default: return <span className="text-sm font-semibold text-gray-600">#{rank}</span>;
    }
  };

  const getPointsForTimeframe = (entry: LeaderboardEntry) => {
    switch (timeframe) {
      case "weekly": return entry.weeklyPoints || 0;
      case "monthly": return entry.monthlyPoints || 0;
      default: return entry.totalPoints;
    }
  };

  const getTimeframeLabel = () => {
    switch (timeframe) {
      case "weekly": return "This Week";
      case "monthly": return "This Month";
      default: return "All Time";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5" />
          <span>Community Leaderboard</span>
        </CardTitle>
        <CardDescription>
          Top contributors - {getTimeframeLabel()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Helper</TableHead>
              <TableHead>Trust Level</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => {
              const TrustIcon = getTrustLevelIcon(entry.trustLevel);
              const points = getPointsForTimeframe(entry);
              
              return (
                <TableRow key={entry.userId} className={entry.userId === "current-user" ? "bg-blue-50" : ""}>
                  <TableCell className="flex items-center justify-center">
                    {getRankIcon(entry.rank)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={entry.avatar} alt={entry.userName} />
                        <AvatarFallback>{entry.userName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{entry.userName}</div>
                        {entry.userId === "current-user" && (
                          <Badge variant="outline" className="text-xs bg-blue-100 text-blue-700">
                            You
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <TrustIcon className={`h-4 w-4 ${getTrustLevelColor(entry.trustLevel)}`} />
                      <span className="text-sm capitalize">{entry.trustLevel.replace('_', ' ')}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-bold">{points}</div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        
        {leaderboard.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No rankings available yet.</p>
            <p className="text-sm">Start helping others to appear on the leaderboard!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;
