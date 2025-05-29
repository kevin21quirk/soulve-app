
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, UserPlus, Clock } from "lucide-react";
import { ConnectionRequest } from "@/types/connections";

interface ConnectionInsightsProps {
  connectedPeople: ConnectionRequest[];
  suggestedConnections: ConnectionRequest[];
}

const ConnectionInsights = ({ connectedPeople, suggestedConnections }: ConnectionInsightsProps) => {
  const totalConnections = connectedPeople.length;
  const pendingSuggestions = suggestedConnections.length;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Grow your network</span>
        </CardTitle>
        <p className="text-sm text-gray-600">
          Expand your connections and increase your community impact
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{totalConnections}</div>
            <div className="text-sm text-gray-600">Connected</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{pendingSuggestions}</div>
            <div className="text-sm text-gray-600">Suggested</div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 flex-1"
          >
            <Clock className="h-4 w-4" />
            <span>View Activity</span>
          </Button>
          <Button
            variant="gradient"
            size="sm"
            className="flex items-center space-x-2 flex-1"
          >
            <UserPlus className="h-4 w-4" />
            <span>Find People</span>
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 text-center">
          Building stronger connections leads to greater community impact
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectionInsights;
