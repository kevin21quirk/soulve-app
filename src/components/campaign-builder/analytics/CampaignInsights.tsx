
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Lightbulb, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  Clock, 
  Users,
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface InsightCardProps {
  type: 'success' | 'warning' | 'info' | 'suggestion';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  metrics?: {
    current: number;
    target: number;
    unit: string;
  };
}

const InsightCard = ({ type, title, description, action, metrics }: InsightCardProps) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <TrendingUp className="h-5 w-5 text-blue-600" />;
      case 'suggestion': return <Lightbulb className="h-5 w-5 text-purple-600" />;
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success': return 'border-green-200';
      case 'warning': return 'border-yellow-200';
      case 'info': return 'border-blue-200';
      case 'suggestion': return 'border-purple-200';
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-yellow-50';
      case 'info': return 'bg-blue-50';
      case 'suggestion': return 'bg-purple-50';
    }
  };

  return (
    <Card className={`${getBorderColor()} ${getBgColor()}`}>
      <CardHeader>
        <div className="flex items-start space-x-3">
          {getIcon()}
          <div className="flex-1">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            <CardDescription className="text-sm mt-1">{description}</CardDescription>
          </div>
        </div>
      </CardHeader>
      {(metrics || action) && (
        <CardContent className="pt-0">
          {metrics && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress:</span>
                <span>{metrics.current} / {metrics.target} {metrics.unit}</span>
              </div>
              <Progress value={(metrics.current / metrics.target) * 100} className="h-2" />
            </div>
          )}
          {action && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={action.onClick}
              className="mt-3 w-full"
            >
              {action.label}
              <ArrowRight className="h-3 w-3 ml-2" />
            </Button>
          )}
        </CardContent>
      )}
    </Card>
  );
};

const CampaignInsights = () => {
  const insights = [
    {
      type: 'success' as const,
      title: 'Great Momentum!',
      description: 'Your campaign is performing 23% better than similar campaigns. Keep up the excellent work!',
      metrics: {
        current: 127,
        target: 200,
        unit: 'supporters'
      }
    },
    {
      type: 'suggestion' as const,
      title: 'Optimize Posting Time',
      description: 'Your supporters are most active between 7-9 PM. Consider posting updates during this time.',
      action: {
        label: 'Schedule Update',
        onClick: () => console.log('Schedule update clicked')
      }
    },
    {
      type: 'warning' as const,
      title: 'Engagement Declining',
      description: 'Social media engagement has dropped 15% this week. Consider sharing more visual content.',
      action: {
        label: 'Add Media',
        onClick: () => console.log('Add media clicked')
      }
    },
    {
      type: 'info' as const,
      title: 'Peak Season Ahead',
      description: 'Donations typically increase by 40% in the next month. Plan your final push strategy.',
      action: {
        label: 'Plan Strategy',
        onClick: () => console.log('Plan strategy clicked')
      }
    },
    {
      type: 'suggestion' as const,
      title: 'Expand Your Reach',
      description: 'Only 12% of your supporters have shared your campaign. Encourage more social sharing.',
      metrics: {
        current: 15,
        target: 50,
        unit: 'shares this week'
      }
    },
    {
      type: 'success' as const,
      title: 'Strong Donor Retention',
      description: 'Your repeat donation rate is 34% higher than average. Donors love your cause!',
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Campaign Insights</h3>
        <p className="text-sm text-gray-600">
          AI-powered recommendations to optimize your campaign performance
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightCard key={index} {...insight} />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-teal-600" />
            <span>Campaign Health Score</span>
          </CardTitle>
          <CardDescription>
            Overall performance indicator based on multiple factors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-green-600">85/100</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Excellent
              </Badge>
            </div>
            <Progress value={85} className="h-3" />
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="text-center">
                <div className="font-semibold text-green-600">92</div>
                <div className="text-gray-600">Engagement</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600">78</div>
                <div className="text-gray-600">Reach</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600">85</div>
                <div className="text-gray-600">Conversion</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignInsights;
