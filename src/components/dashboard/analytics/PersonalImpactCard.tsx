
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Award, Users, Target } from "lucide-react";

interface PersonalImpactCardProps {
  userRank: number;
  totalUsers: number;
  impactScore: number;
  weeklyGrowth: number;
  monthlyGrowth: number;
  topPercentile: number;
}

const PersonalImpactCard = ({
  userRank,
  totalUsers,
  impactScore,
  weeklyGrowth,
  monthlyGrowth,
  topPercentile
}: PersonalImpactCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-6 w-6 text-purple-600" />
          <span>Personal Impact Overview</span>
          <Badge variant="secondary" className="ml-auto">
            Top {topPercentile}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Impact Score */}
        <div className="text-center">
          <div className="text-4xl font-bold text-purple-600 mb-2">
            {impactScore}
          </div>
          <div className="text-sm text-gray-600">Impact Score</div>
          <Progress value={impactScore} className="mt-2 h-2" />
        </div>

        {/* Ranking */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-gray-600">Community Rank</span>
            </div>
            <div className="text-2xl font-bold text-blue-600">
              #{userRank}
            </div>
            <div className="text-xs text-gray-500">
              of {totalUsers.toLocaleString()}
            </div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Target className="h-4 w-4 text-green-600" />
              <span className="text-sm text-gray-600">Percentile</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {topPercentile}%
            </div>
            <div className="text-xs text-gray-500">
              Top performer
            </div>
          </div>
        </div>

        {/* Growth Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">+{weeklyGrowth}%</span>
            </div>
            <div className="text-xs text-gray-600">This week</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-blue-600">
              <TrendingUp className="h-4 w-4" />
              <span className="font-semibold">+{monthlyGrowth}%</span>
            </div>
            <div className="text-xs text-gray-600">This month</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalImpactCard;
