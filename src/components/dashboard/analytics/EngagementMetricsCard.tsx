
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, MessageCircle, Share, Eye, TrendingUp } from "lucide-react";

interface EngagementMetric {
  label: string;
  value: number;
  growth: number;
  comparison: number; // compared to average user
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface EngagementMetricsCardProps {
  metrics: EngagementMetric[];
  totalEngagementScore: number;
  rankPosition: number;
}

const EngagementMetricsCard = ({ metrics, totalEngagementScore, rankPosition }: EngagementMetricsCardProps) => {
  return (
    <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-indigo-600" />
          <span>Engagement Analytics</span>
          <Badge className="bg-indigo-100 text-indigo-800">
            #{rankPosition} Engagement
          </Badge>
        </CardTitle>
        <CardDescription>
          Your community interaction metrics vs. platform average
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="text-center p-4 bg-white/60 rounded-lg">
            <div className="text-3xl font-bold text-indigo-600 mb-1">{totalEngagementScore}</div>
            <div className="text-sm text-gray-600">Total Engagement Score</div>
            <div className="flex items-center justify-center space-x-1 mt-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+23% vs average</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <metric.icon className={`h-4 w-4 ${metric.color}`} />
                    <span className="text-sm font-medium">{metric.label}</span>
                  </div>
                  <Badge variant="outline" className={metric.growth >= 0 ? "text-green-600" : "text-red-600"}>
                    {metric.growth >= 0 ? "+" : ""}{metric.growth}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Your Score</span>
                    <span className="font-bold">{metric.value}</span>
                  </div>
                  <Progress value={metric.comparison} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {metric.comparison}% above platform average
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementMetricsCard;
