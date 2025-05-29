
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, Globe, Zap, TrendingUp } from "lucide-react";

interface NetworkData {
  connectionGrowthData: Array<{
    month: string;
    connections: number;
    reach: number;
  }>;
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
}: NetworkData) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-blue-600" />
          <span>Network Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Connections</span>
            </div>
            <div className="text-xl font-bold text-blue-600">
              {totalConnections}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Globe className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Network Reach</span>
            </div>
            <div className="text-xl font-bold text-green-600">
              {networkReach.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={connectionGrowthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="connections" 
                stroke="#3b82f6" 
                strokeWidth={2}
                name="Connections"
              />
              <Line 
                type="monotone" 
                dataKey="reach" 
                stroke="#10b981" 
                strokeWidth={2}
                name="Reach"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Advanced Metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 border rounded">
            <div className="flex items-center justify-center space-x-1">
              <Zap className="h-3 w-3 text-orange-600" />
              <span className="text-xs text-gray-600">Velocity</span>
            </div>
            <div className="text-sm font-bold text-orange-600">
              {connectionVelocity}/week
            </div>
          </div>

          <div className="text-center p-2 border rounded">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-3 w-3 text-purple-600" />
              <span className="text-xs text-gray-600">Influence</span>
            </div>
            <div className="text-sm font-bold text-purple-600">
              {influenceScore}%
            </div>
          </div>

          <div className="text-center p-2 border rounded">
            <div className="flex items-center justify-center space-x-1">
              <Globe className="h-3 w-3 text-teal-600" />
              <span className="text-xs text-gray-600">Geographic</span>
            </div>
            <div className="text-sm font-bold text-teal-600">
              {geographicSpread} areas
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NetworkAnalyticsCard;
