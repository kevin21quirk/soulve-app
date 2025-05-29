
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Eye, DollarSign, Share2, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down" | "neutral";
  icon: React.ReactNode;
  subtitle?: string;
}

const MetricCard = ({ title, value, change, trend, icon, subtitle }: MetricCardProps) => {
  const getTrendColor = () => {
    switch (trend) {
      case "up": return "text-green-600";
      case "down": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3" />;
      case "down": return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <div className="text-gray-400">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <div className="text-2xl font-bold">{value}</div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change > 0 ? '+' : ''}{change}%</span>
              <span className="text-gray-500">vs last week</span>
            </div>
          )}
          {subtitle && (
            <p className="text-xs text-gray-500">{subtitle}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface RealTimeMetricsCardProps {
  analytics: {
    totalViews: number;
    uniqueViews: number;
    totalDonations: number;
    donationAmount: number;
    socialShares: number;
    commentCount: number;
    conversionRate: number;
    bounceRate: number;
    avgTimeOnPage: number;
  };
}

const RealTimeMetricsCard = ({ analytics }: RealTimeMetricsCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Real-Time Metrics</h3>
        <Badge variant="outline" className="animate-pulse">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          Live
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Views"
          value={analytics.totalViews.toLocaleString()}
          trend="up"
          change={12}
          icon={<Eye className="h-4 w-4" />}
          subtitle={`${analytics.uniqueViews} unique visitors`}
        />

        <MetricCard
          title="Donations Raised"
          value={formatCurrency(analytics.donationAmount)}
          trend="up"
          change={24}
          icon={<DollarSign className="h-4 w-4" />}
          subtitle={`${analytics.totalDonations} donations`}
        />

        <MetricCard
          title="Social Shares"
          value={analytics.socialShares.toLocaleString()}
          trend="up"
          change={8}
          icon={<Share2 className="h-4 w-4" />}
          subtitle="Across all platforms"
        />

        <MetricCard
          title="Engagement"
          value={`${(analytics.conversionRate * 100).toFixed(1)}%`}
          trend="neutral"
          icon={<MessageCircle className="h-4 w-4" />}
          subtitle={`${formatTime(analytics.avgTimeOnPage)} avg. time`}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-600">Conversion Rate</h4>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold">{(analytics.conversionRate * 100).toFixed(2)}%</div>
              <Badge variant={analytics.conversionRate > 0.02 ? "default" : "secondary"}>
                {analytics.conversionRate > 0.02 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm text-gray-600">Bounce Rate</h4>
            <div className="flex items-center space-x-2">
              <div className="text-xl font-bold">{(analytics.bounceRate * 100).toFixed(1)}%</div>
              <Badge variant={analytics.bounceRate < 0.4 ? "default" : "destructive"}>
                {analytics.bounceRate < 0.4 ? "Excellent" : "High"}
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RealTimeMetricsCard;
