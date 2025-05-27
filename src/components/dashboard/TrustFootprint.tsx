
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Star, Heart, Clock, Users, DollarSign, Award } from "lucide-react";
import { TrustFootprint as TrustFootprintType } from "@/types/trustFootprint";
import TrustActivityList from "./TrustActivityList";
import TrustStatsGrid from "./TrustStatsGrid";

interface TrustFootprintProps {
  trustFootprint: TrustFootprintType;
}

const TrustFootprint = ({ trustFootprint }: TrustFootprintProps) => {
  const getTrustScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-6 w-6 text-teal-600" />
                <span>Trust Footprint</span>
              </CardTitle>
              <CardDescription>
                Your verified history of community contributions and interactions
              </CardDescription>
            </div>
            <div className="text-center">
              <div className={`text-3xl font-bold ${getTrustScoreColor(trustFootprint.trustScore)}`}>
                {trustFootprint.trustScore}%
              </div>
              <div className="text-sm text-gray-600">Trust Score</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Trust Level Progress</span>
                <span>{trustFootprint.trustScore}%</span>
              </div>
              <Progress value={trustFootprint.trustScore} className="h-2" />
            </div>
            
            <div className="flex flex-wrap gap-2">
              {trustFootprint.verificationBadges.map((badge, index) => (
                <Badge key={index} variant="secondary" className="bg-teal-100 text-teal-800">
                  <Star className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <TrustStatsGrid trustFootprint={trustFootprint} />

      {/* Activity History */}
      <TrustActivityList activities={trustFootprint.activities} />
    </div>
  );
};

export default TrustFootprint;
