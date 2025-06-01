
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";

interface NetworkInsight {
  title: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  color: string;
  actionable: boolean;
  action?: () => void;
  actionLabel?: string;
}

interface NetworkAnalyticsCardProps {
  insights: NetworkInsight[];
}

const NetworkAnalyticsCard = ({ insights }: NetworkAnalyticsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-green-500" />
          <span>Network Analytics</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-sm transition-shadow group">
            <div className="flex-1">
              <h4 className="font-medium text-gray-900">{insight.title}</h4>
              <p className="text-sm text-gray-500">{insight.description}</p>
              {insight.actionable && insight.action && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="mt-1 p-0 h-auto text-blue-600 hover:text-blue-800 group-hover:translate-x-1 transition-transform"
                  onClick={insight.action}
                >
                  {insight.actionLabel} <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              )}
            </div>
            <div className={`text-right ${insight.color}`}>
              <div className="text-2xl font-bold flex items-center space-x-1">
                <span>{insight.value}</span>
                {insight.trend === "up" && <TrendingUp className="h-4 w-4" />}
                {insight.trend === "down" && <TrendingDown className="h-4 w-4" />}
              </div>
              {insight.trend === "up" && (
                <div className="flex items-center justify-end space-x-1">
                  <span className="text-xs">Growing</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NetworkAnalyticsCard;
