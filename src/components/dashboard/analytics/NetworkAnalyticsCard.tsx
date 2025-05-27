
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, Network, MapPin, Zap } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

interface NetworkData {
  month: string;
  connections: number;
  reach: number;
}

interface NetworkAnalyticsCardProps {
  connectionGrowthData: NetworkData[];
  totalConnections: number;
  networkReach: number;
  connectionVelocity: number;
  influenceScore: number;
  geographicSpread: number;
}

const NetworkAnalyticsCard = ({ 
  connectionGrowthData, 
  totalConnections, 
  networkReach, 
  connectionVelocity, 
  influenceScore,
  geographicSpread 
}: NetworkAnalyticsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Network className="h-5 w-5 text-emerald-600" />
          <span>Network Analytics</span>
          <Badge className="bg-emerald-100 text-emerald-800">
            Growing +{connectionVelocity}%
          </Badge>
        </CardTitle>
        <CardDescription>
          Your network growth and influence metrics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Network Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <Users className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-700">{totalConnections}</div>
              <div className="text-xs text-gray-600">Total Connections</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <Zap className="h-6 w-6 text-amber-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-amber-700">{influenceScore}</div>
              <div className="text-xs text-gray-600">Influence Score</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <UserPlus className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-700">{networkReach.toLocaleString()}</div>
              <div className="text-xs text-gray-600">Network Reach</div>
            </div>
            <div className="text-center p-3 bg-white/60 rounded-lg">
              <MapPin className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-700">{geographicSpread}</div>
              <div className="text-xs text-gray-600">Cities Reached</div>
            </div>
          </div>

          {/* Network Growth Chart */}
          <div className="bg-white/60 rounded-lg p-4">
            <h4 className="text-sm font-semibold mb-3 text-gray-700">Connection Growth Trend</h4>
            <ResponsiveContainer width="100%" height={120}>
              <AreaChart data={connectionGrowthData}>
                <defs>
                  <linearGradient id="connectionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="connections" 
                  stroke="#10b981" 
                  fillOpacity={1} 
                  fill="url(#connectionGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkAnalyticsCard;
