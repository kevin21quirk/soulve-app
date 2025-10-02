
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TrendingUp, Target, Clock, Zap, AlertTriangle, CheckCircle } from "lucide-react";

interface Prediction {
  type: string;
  value: number;
  confidence: number;
  date: string;
}

interface PredictiveInsightsProps {
  predictions: Prediction[];
  performanceScore: number;
  goalAmount?: number;
  currentAmount?: number;
  daysRemaining?: number;
}

const PredictiveInsights = ({ 
  predictions, 
  performanceScore, 
  goalAmount = 100000, 
  currentAmount = 45000,
  daysRemaining = 30 
}: PredictiveInsightsProps) => {
  
  const goalCompletionPrediction = predictions.find(p => p.type === 'goal_completion');
  const viralPotential = predictions.find(p => p.type === 'viral_potential');
  const dailyDonations = predictions.find(p => p.type === 'daily_donations');

  // Generate forecasting data
  const forecastData = Array.from({ length: daysRemaining }, (_, i) => {
    const day = i + 1;
    const dailyRate = dailyDonations?.value || 1500;
    const projectedAmount = currentAmount + (dailyRate * day);
    const optimisticAmount = projectedAmount * 1.2;
    const pessimisticAmount = projectedAmount * 0.8;

    return {
      day: `Day ${day}`,
      projected: Math.min(projectedAmount, goalAmount),
      optimistic: Math.min(optimisticAmount, goalAmount * 1.1),
      pessimistic: Math.min(pessimisticAmount, goalAmount),
      goal: goalAmount
    };
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 80) return { variant: "default" as const, text: "Excellent", icon: CheckCircle };
    if (score >= 60) return { variant: "secondary" as const, text: "Good", icon: TrendingUp };
    return { variant: "destructive" as const, text: "Needs Attention", icon: AlertTriangle };
  };

  const scoreBadge = getScoreBadge(performanceScore);
  const ScoreIcon = scoreBadge.icon;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Predictive Insights & Forecasting</h3>
        <Badge variant={scoreBadge.variant} className="flex items-center space-x-1">
          <ScoreIcon className="h-3 w-3" />
          <span>{scoreBadge.text}</span>
        </Badge>
      </div>

      {/* Performance Score Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Campaign Performance Score</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">{performanceScore}/100</span>
              <span className={`text-sm font-medium ${getScoreColor(performanceScore)}`}>
                {scoreBadge.text}
              </span>
            </div>
            <Progress value={performanceScore} className="h-2" />
            <div className="grid grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">Goal Progress</div>
                <div className="text-xs text-gray-500">40% weight</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Engagement</div>
                <div className="text-xs text-gray-500">25% weight</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Social Reach</div>
                <div className="text-xs text-gray-500">20% weight</div>
              </div>
              <div className="text-center">
                <div className="font-medium">Geographic</div>
                <div className="text-xs text-gray-500">15% weight</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Target className="h-4 w-4 text-blue-500" />
              <span>Goal Completion</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {goalCompletionPrediction ? `${(goalCompletionPrediction.value * 100).toFixed(0)}%` : '85%'}
              </div>
              <div className="text-sm text-gray-600">Probability of reaching goal</div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Confidence:</div>
                <Badge variant="outline" className="text-xs">
                  {goalCompletionPrediction ? `${(goalCompletionPrediction.confidence * 100).toFixed(0)}%` : '92%'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Zap className="h-4 w-4 text-purple-500" />
              <span>Viral Potential</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                {viralPotential ? `${(viralPotential.value * 100).toFixed(0)}%` : '73%'}
              </div>
              <div className="text-sm text-gray-600">Chance of viral growth</div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Confidence:</div>
                <Badge variant="outline" className="text-xs">
                  {viralPotential ? `${(viralPotential.confidence * 100).toFixed(0)}%` : '78%'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <Clock className="h-4 w-4 text-green-500" />
              <span>Daily Rate</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                £{dailyDonations ? dailyDonations.value.toLocaleString() : '1,500'}
              </div>
              <div className="text-sm text-gray-600">Predicted daily donations</div>
              <div className="flex items-center space-x-2">
                <div className="text-xs text-gray-500">Confidence:</div>
                <Badge variant="outline" className="text-xs">
                  {dailyDonations ? `${(dailyDonations.confidence * 100).toFixed(0)}%` : '85%'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecasting Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">30-Day Fundraising Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis 
                  tickFormatter={(value) => `£${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => [`£${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => label}
                />
                <Area
                  type="monotone"
                  dataKey="optimistic"
                  stackId="1"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.2}
                  name="Optimistic Scenario"
                />
                <Area
                  type="monotone"
                  dataKey="projected"
                  stackId="2"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.6}
                  name="Most Likely"
                />
                <Area
                  type="monotone"
                  dataKey="pessimistic"
                  stackId="3"
                  stroke="#ffc658"
                  fill="#ffc658"
                  fillOpacity={0.3}
                  name="Conservative"
                />
                <Line
                  type="monotone"
                  dataKey="goal"
                  stroke="#ff7c7c"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Goal Target"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">AI-Powered Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400 rounded">
              <div className="flex items-start space-x-2">
                <TrendingUp className="h-4 w-4 text-blue-600 mt-0.5" />
                <div>
                  <div className="font-medium text-blue-800">Optimize Posting Time</div>
                  <div className="text-sm text-blue-700">
                    Your audience is most active between 7-9 PM EST. Consider scheduling updates during this window.
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
              <div className="flex items-start space-x-2">
                <Zap className="h-4 w-4 text-green-600 mt-0.5" />
                <div>
                  <div className="font-medium text-green-800">Leverage Social Momentum</div>
                  <div className="text-sm text-green-700">
                    Your campaign has high viral potential. Focus on shareable content and user-generated stories.
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div>
                  <div className="font-medium text-yellow-800">Goal Achievement Strategy</div>
                  <div className="text-sm text-yellow-700">
                    You're 55% to goal. Consider reaching out to corporate sponsors for the final push.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictiveInsights;
