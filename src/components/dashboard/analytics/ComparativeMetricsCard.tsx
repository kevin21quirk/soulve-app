
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Users, Clock } from "lucide-react";

interface ComparativeMetric {
  label: string;
  userValue: number;
  avgValue: number;
  topValue: number;
  userPercentile: number;
  unit?: string;
}

interface ComparativeMetricsCardProps {
  metrics: ComparativeMetric[];
  overallRanking: number;
  totalUsers: number;
}

const ComparativeMetricsCard = ({
  metrics,
  overallRanking,
  totalUsers
}: ComparativeMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span>Comparative Performance</span>
          </span>
          <Badge variant="secondary">
            #{overallRanking} of {totalUsers.toLocaleString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">{metric.label}</span>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {metric.userPercentile}th percentile
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Progress value={metric.userPercentile} className="h-2" />
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-blue-600">
                    {metric.userValue}{metric.unit || ''}
                  </div>
                  <div className="text-xs text-gray-500">You</div>
                </div>
                
                <div className="text-center">
                  <div className="font-medium text-gray-600">
                    {metric.avgValue}{metric.unit || ''}
                  </div>
                  <div className="text-xs text-gray-500">Average</div>
                </div>
                
                <div className="text-center">
                  <div className="font-medium text-green-600">
                    {metric.topValue}{metric.unit || ''}
                  </div>
                  <div className="text-xs text-gray-500">Top 1%</div>
                </div>
              </div>
            </div>
            
            {/* Performance indicator */}
            <div className="flex items-center space-x-2">
              {metric.userPercentile >= 90 && (
                <Badge className="bg-green-100 text-green-800">
                  <Trophy className="h-3 w-3 mr-1" />
                  Top Performer
                </Badge>
              )}
              {metric.userPercentile >= 75 && metric.userPercentile < 90 && (
                <Badge className="bg-blue-100 text-blue-800">
                  <Users className="h-3 w-3 mr-1" />
                  Above Average
                </Badge>
              )}
              {metric.userPercentile < 50 && (
                <Badge className="bg-orange-100 text-orange-800">
                  <Clock className="h-3 w-3 mr-1" />
                  Room for Growth
                </Badge>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ComparativeMetricsCard;
