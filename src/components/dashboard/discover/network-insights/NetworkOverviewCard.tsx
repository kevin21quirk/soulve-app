
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Sparkles, TrendingUp, MessageSquare } from "lucide-react";
import { useNetworkNavigation } from "@/hooks/useNetworkNavigation";

interface NetworkOverviewCardProps {
  networkStats: {
    totalConnections: number;
    pendingRequests: number;
    communitiesJoined: number;
    weeklyGrowth: number;
  };
  userStats: {
    level: number;
    totalScore: number;
  };
  analyticsData: {
    geographicSpread: {
      locations: string[];
    };
  };
}

const NetworkOverviewCard = ({ networkStats, userStats, analyticsData }: NetworkOverviewCardProps) => {
  const navigation = useNetworkNavigation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <span>Network Overview</span>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          {networkStats.totalConnections > 0 && (
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <Sparkles className="h-3 w-3 mr-1" />
              {networkStats.weeklyGrowth > 0 ? 'Growing' : 'Active'}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 rounded-lg bg-blue-50 cursor-pointer hover:bg-blue-100 transition-colors" onClick={navigation.navigateToConnections}>
            <div className="text-3xl font-bold text-blue-600">{networkStats.totalConnections}</div>
            <div className="text-sm text-gray-600">Total Connections</div>
            {networkStats.weeklyGrowth > 0 && (
              <div className="text-xs text-green-600 flex items-center justify-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                +{networkStats.weeklyGrowth} this week
              </div>
            )}
          </div>
          <div className="text-center p-4 rounded-lg bg-orange-50 cursor-pointer hover:bg-orange-100 transition-colors" onClick={navigation.navigateToConnections}>
            <div className="text-3xl font-bold text-orange-600">{networkStats.pendingRequests}</div>
            <div className="text-sm text-gray-600">Pending Requests</div>
            {networkStats.pendingRequests > 0 && (
              <Button variant="outline" size="sm" className="mt-2" onClick={(e) => { e.stopPropagation(); navigation.navigateToConnections(); }}>
                <MessageSquare className="h-4 w-4 mr-1" />
                Review Now
              </Button>
            )}
          </div>
          <div className="text-center p-4 rounded-lg bg-green-50 cursor-pointer hover:bg-green-100 transition-colors" onClick={navigation.navigateToGroups}>
            <div className="text-3xl font-bold text-green-600">{networkStats.communitiesJoined}</div>
            <div className="text-sm text-gray-600">Communities Joined</div>
            <div className="text-xs text-gray-500 mt-1">
              {analyticsData.geographicSpread.locations.length} locations
            </div>
          </div>
          <div className="text-center p-4 rounded-lg bg-purple-50 cursor-pointer hover:bg-purple-100 transition-colors">
            <div className="text-3xl font-bold text-purple-600">{userStats.level}</div>
            <div className="text-sm text-gray-600">Community Level</div>
            <div className="w-full bg-purple-200 rounded-full h-1 mt-2">
              <div 
                className="bg-purple-600 h-1 rounded-full transition-all duration-300" 
                style={{ width: `${((userStats.totalScore % 500) / 500) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkOverviewCard;
