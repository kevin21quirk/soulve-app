
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart, TrendingUp, Users, Award } from "lucide-react";

interface ComparisonMetric {
  label: string;
  userValue: number;
  avgValue: number;
  topValue: number;
  userPercentile: number;
  unit?: string;
}

interface ComparativeMetricsCardProps {
  metrics: ComparisonMetric[];
  overallRanking: number;
  totalUsers: number;
}

const ComparativeMetricsCard = ({ metrics, overallRanking, totalUsers }: ComparativeMetricsCardProps) => {
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return "text-green-600 bg-green-50";
    if (percentile >= 75) return "text-blue-600 bg-blue-50";
    if (percentile >= 50) return "text-yellow-600 bg-yellow-50";
    return "text-gray-600 bg-gray-50";
  };

  const getPercentileLabel = (percentile: number) => {
    if (percentile >= 95) return "Elite";
    if (percentile >= 90) return "Excellent";
    if (percentile >= 75) return "Above Average";
    if (percentile >= 50) return "Average";
    return "Below Average";
  };

  return (
    <Card className="bg-gradient-to-br from-slate-50 to-blue-50 border-slate-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BarChart className="h-5 w-5 text-slate-600" />
          <span>Performance Comparison</span>
          <Badge className="bg-slate-100 text-slate-800">
            #{overallRanking} of {totalUsers.toLocaleString()}
          </Badge>
        </CardTitle>
        <CardDescription>
          How you compare to other community members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {metrics.map((metric, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-700">{metric.label}</span>
                <Badge className={getPercentileColor(metric.userPercentile)}>
                  {getPercentileLabel(metric.userPercentile)}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Your Score</span>
                  <span className="font-bold text-gray-900">
                    {metric.userValue}{metric.unit}
                  </span>
                </div>
                <Progress value={metric.userPercentile} className="h-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Avg: {metric.avgValue}{metric.unit}</span>
                  <span>Top: {metric.topValue}{metric.unit}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 bg-red-50 rounded">
                  <div className="font-semibold text-red-600">Bottom 25%</div>
                  <div className="text-red-500">0-{Math.round(metric.avgValue * 0.7)}{metric.unit}</div>
                </div>
                <div className="p-2 bg-yellow-50 rounded">
                  <div className="font-semibold text-yellow-600">Average</div>
                  <div className="text-yellow-500">{Math.round(metric.avgValue * 0.7)}-{Math.round(metric.avgValue * 1.3)}{metric.unit}</div>
                </div>
                <div className="p-2 bg-green-50 rounded">
                  <div className="font-semibold text-green-600">Top 25%</div>
                  <div className="text-green-500">{Math.round(metric.avgValue * 1.3)}+{metric.unit}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparativeMetricsCard;
