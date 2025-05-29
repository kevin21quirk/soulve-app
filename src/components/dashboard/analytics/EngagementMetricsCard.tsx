
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";

interface EngagementMetric {
  label: string;
  value: number;
  growth: number;
  comparison: number;
  icon: LucideIcon;
  color: string;
}

interface EngagementMetricsCardProps {
  metrics: EngagementMetric[];
  totalEngagementScore: number;
  rankPosition: number;
}

const EngagementMetricsCard = ({
  metrics,
  totalEngagementScore,
  rankPosition
}: EngagementMetricsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Engagement Metrics</span>
          <Badge variant="outline">
            Rank #{rankPosition}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Score */}
        <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {totalEngagementScore.toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Engagement Score</div>
        </div>

        {/* Individual Metrics */}
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            const isPositive = metric.growth >= 0;
            
            return (
              <div key={index} className="p-3 border rounded-lg hover:shadow-sm transition-shadow">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon className={`h-4 w-4 ${metric.color}`} />
                  <span className="text-sm font-medium text-gray-700">
                    {metric.label}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-lg font-bold">
                    {metric.value.toLocaleString()}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`font-medium ${
                      isPositive ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {isPositive ? '+' : ''}{metric.growth}%
                    </span>
                    <span className="text-gray-500">
                      vs {metric.comparison}% avg
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetricsCard;
