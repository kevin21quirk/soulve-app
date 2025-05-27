
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock } from "lucide-react";

const CommunityImpactCard = React.memo(() => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Community Impact</span>
        </CardTitle>
        <CardDescription>Your contribution to the community</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">47</div>
            <div className="text-sm text-gray-600">People Helped</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">312</div>
            <div className="text-sm text-gray-600">Hours Contributed</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">85</div>
            <div className="text-sm text-gray-600">Connections</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">94%</div>
            <div className="text-sm text-gray-600">Trust Score</div>
          </div>
        </div>
        
        <div className="space-y-3 pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Most Active Day</span>
            <Badge>Friday</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Favorite Category</span>
            <Badge variant="outline">Moving Help</Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Avg Response Time</span>
            <Badge className="bg-green-100 text-green-700">
              <Clock className="h-3 w-3 mr-1" />
              2.3 hours
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CommunityImpactCard.displayName = "CommunityImpactCard";

export default CommunityImpactCard;
