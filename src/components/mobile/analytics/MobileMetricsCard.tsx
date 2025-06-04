
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MobileMetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

const MobileMetricsCard = ({
  title,
  value,
  change,
  trend,
  icon: Icon,
  description,
  badge,
  badgeVariant = "default"
}: MobileMetricsCardProps) => {
  const getTrendIcon = () => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-[#0ce4af]" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-600" />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-[#0ce4af]";
    if (trend === "down") return "text-red-600";
    return "text-gray-600";
  };

  const getBadgeVariant = () => {
    if (badgeVariant === "default") return "soulve";
    return badgeVariant;
  };

  return (
    <Card className="h-full border-gray-200 hover:border-[#0ce4af]/30 transition-colors">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center space-x-2">
            {Icon && <Icon className="h-4 w-4 text-[#18a5fe]" />}
            <span>{title}</span>
          </span>
          {badge && (
            <Badge variant={getBadgeVariant()} className="text-xs">
              {badge}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">{value}</div>
          
          {change && (
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{change}</span>
              <span className="text-gray-500">vs last week</span>
            </div>
          )}
          
          {description && (
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileMetricsCard;
