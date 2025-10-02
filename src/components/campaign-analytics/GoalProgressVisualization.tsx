
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  DollarSign,
  Users,
  Clock
} from "lucide-react";

interface GoalProgressVisualizationProps {
  campaignId: string;
  goalAmount: number;
  currentAmount: number;
  goalType: 'monetary' | 'volunteers' | 'signatures' | 'participants';
  currency?: string;
  daysRemaining?: number;
  totalDays?: number;
  recentDonations?: Array<{
    amount: number;
    created_at: string;
    is_anonymous: boolean;
  }>;
}

const GoalProgressVisualization = ({
  campaignId,
  goalAmount,
  currentAmount,
  goalType,
  currency = 'GBP',
  daysRemaining = 15,
  totalDays = 30,
  recentDonations = []
}: GoalProgressVisualizationProps) => {
  const progressPercentage = Math.min((currentAmount / goalAmount) * 100, 100);
  const timeProgressPercentage = ((totalDays - daysRemaining) / totalDays) * 100;
  const dailyAverage = currentAmount / (totalDays - daysRemaining || 1);
  const projectedTotal = dailyAverage * totalDays;
  const remainingAmount = Math.max(goalAmount - currentAmount, 0);
  const dailyNeeded = remainingAmount / (daysRemaining || 1);

  const getGoalIcon = () => {
    switch (goalType) {
      case 'monetary': return <DollarSign className="h-5 w-5 text-green-600" />;
      case 'volunteers': return <Users className="h-5 w-5 text-blue-600" />;
      case 'signatures': return <Target className="h-5 w-5 text-purple-600" />;
      case 'participants': return <Users className="h-5 w-5 text-orange-600" />;
      default: return <Target className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatValue = (value: number) => {
    if (goalType === 'monetary') {
      return `£${value.toLocaleString()}`;
    }
    return value.toLocaleString();
  };

  const getProgressColor = () => {
    if (progressPercentage >= 100) return 'bg-green-500';
    if (progressPercentage >= 75) return 'bg-blue-500';
    if (progressPercentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStatusBadge = () => {
    if (progressPercentage >= 100) {
      return <Badge className="bg-green-100 text-green-800 border-green-200">Goal Reached! 🎉</Badge>;
    }
    if (progressPercentage >= 90) {
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Almost There!</Badge>;
    }
    if (progressPercentage >= 50) {
      return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Good Progress</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Getting Started</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Main Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getGoalIcon()}
              Goal Progress
            </div>
            {getStatusBadge()}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Progress Bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold text-gray-900">
                {formatValue(currentAmount)}
              </span>
              <span className="text-lg text-gray-600">
                of {formatValue(goalAmount)}
              </span>
            </div>
            
            <div className="relative">
              <Progress value={progressPercentage} className="h-4" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-medium text-white drop-shadow">
                  {progressPercentage.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-600">Remaining</div>
              <div className="font-semibold">{formatValue(remainingAmount)}</div>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600">Daily Average</div>
              <div className="font-semibold">{formatValue(Math.round(dailyAverage))}</div>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600">Projected Total</div>
              <div className="font-semibold">{formatValue(Math.round(projectedTotal))}</div>
            </div>
            
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm text-gray-600">Daily Needed</div>
              <div className="font-semibold">{formatValue(Math.round(dailyNeeded))}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Time Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">
              {totalDays - daysRemaining} days completed
            </span>
            <span className="text-gray-600">
              {daysRemaining} days remaining
            </span>
          </div>
          
          <Progress value={timeProgressPercentage} className="h-3" />
          
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {timeProgressPercentage.toFixed(1)}% of time elapsed
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              {(progressPercentage / timeProgressPercentage * 100 || 0).toFixed(1)}% efficiency
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      {recentDonations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentDonations.slice(0, 5).map((donation, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {donation.is_anonymous ? 'Anonymous Supporter' : 'Supporter'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="font-semibold text-green-600">
                    {formatValue(donation.amount)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoalProgressVisualization;
