
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface ImpactMetric {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
}

interface ImpactMetricsGridProps {
  metrics: ImpactMetric[];
}

const ImpactMetricsGrid = ({ metrics }: ImpactMetricsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index}>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
              </div>
              <div className={`flex items-center space-x-1 ${
                metric.trend === "up" ? "text-green-600" : "text-red-600"
              }`}>
                <TrendingUp className={`h-4 w-4 ${
                  metric.trend === "down" ? "rotate-180" : ""
                }`} />
                <span className="text-sm font-medium">{metric.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ImpactMetricsGrid;
