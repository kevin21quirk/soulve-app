
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Users, DollarSign, Target, Share2, Eye, Heart } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  description?: string;
  progress?: number;
}

const MetricCard = ({ title, value, change, changeType, icon, description, progress }: MetricCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive': return <TrendingUp className="h-3 w-3" />;
      case 'negative': return <TrendingDown className="h-3 w-3" />;
      default: return null;
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="h-4 w-4 text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={`flex items-center space-x-1 text-xs ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{change > 0 ? '+' : ''}{change}% from last month</span>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        {progress !== undefined && (
          <div className="mt-2">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{progress}% of goal</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface CampaignMetricsCardProps {
  campaignId?: string;
}

const CampaignMetricsCard = ({ campaignId }: CampaignMetricsCardProps) => {
  // Mock data - in real app, this would come from API
  const metrics = [
    {
      title: "Total Raised",
      value: "£12,450",
      change: 15.2,
      changeType: 'positive' as const,
      icon: <DollarSign className="h-4 w-4" />,
      progress: 62.25,
      description: "Goal: £20,000"
    },
    {
      title: "Supporters",
      value: "127",
      change: 8.1,
      changeType: 'positive' as const,
      icon: <Users className="h-4 w-4" />,
      description: "Unique contributors"
    },
    {
      title: "Views",
      value: "2,341",
      change: -2.4,
      changeType: 'negative' as const,
      icon: <Eye className="h-4 w-4" />,
      description: "Page visits"
    },
    {
      title: "Shares",
      value: "89",
      change: 12.3,
      changeType: 'positive' as const,
      icon: <Share2 className="h-4 w-4" />,
      description: "Social media shares"
    },
    {
      title: "Engagement Rate",
      value: "3.8%",
      change: 0.5,
      changeType: 'positive' as const,
      icon: <Heart className="h-4 w-4" />,
      description: "Likes, comments, shares"
    },
    {
      title: "Conversion Rate",
      value: "5.4%",
      change: 1.2,
      changeType: 'positive' as const,
      icon: <Target className="h-4 w-4" />,
      description: "Visitors to supporters"
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  );
};

export default CampaignMetricsCard;
