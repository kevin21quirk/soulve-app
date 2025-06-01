
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star } from "lucide-react";

interface TrustScoreCardProps {
  trustScore: number;
  totalConnections: number;
  communitiesJoined: number;
  userCampaigns: number;
}

const TrustScoreCard = ({ trustScore, totalConnections, communitiesJoined, userCampaigns }: TrustScoreCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>Trust Score Progress</span>
          <Badge variant="outline">{trustScore >= 75 ? 'Excellent' : trustScore >= 50 ? 'Good' : 'Building'}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Current Trust Score</span>
            <span className="text-lg font-bold text-blue-600">{trustScore}%</span>
          </div>
          <Progress value={trustScore} className="h-3" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Quick actions to improve:</h5>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center justify-between">
                  <span>• Meaningful connections</span>
                  <Badge variant="outline" className="text-xs">{totalConnections}/10</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Community groups</span>
                  <Badge variant="outline" className="text-xs">{communitiesJoined}/3</Badge>
                </li>
                <li className="flex items-center justify-between">
                  <span>• Active campaigns</span>
                  <Badge variant="outline" className="text-xs">{userCampaigns}/2</Badge>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Trust benefits unlocked:</h5>
              <ul className="space-y-1 text-gray-600">
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${trustScore >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Priority in help requests</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${trustScore >= 75 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Access to exclusive groups</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${trustScore >= 90 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Featured in recommendations</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustScoreCard;
