import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Shield, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { useEnhancedPoints } from "@/hooks/useEnhancedPoints";

const TrustScoreBreakdown = () => {
  const { metrics, getTrustScoreBreakdown } = useEnhancedPoints();
  const breakdown = getTrustScoreBreakdown();

  if (!breakdown || !metrics) {
    return null;
  }

  const { total, components } = breakdown;
  const maxScore = 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Trust Score Breakdown</span>
        </CardTitle>
        <CardDescription>
          How your trust score of {total}% is calculated
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Overall Trust Score</span>
            <span className="text-2xl font-bold text-primary">{total}%</span>
          </div>
          <Progress value={total} className="h-3" />
        </div>

        {/* Components Breakdown */}
        <div className="space-y-4 pt-4 border-t">
          <h4 className="font-semibold text-sm text-muted-foreground">Score Components</h4>

          {/* Lifetime Points Component (60%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>Lifetime Impact Points (60% weight)</span>
              </div>
              <span className="font-semibold">{components.lifetime_points} pts</span>
            </div>
            <Progress 
              value={(components.lifetime_points / maxScore) * 100} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              Based on your total impact score: {metrics.impact_score} points
            </p>
          </div>

          {/* Average Rating Component (30%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span>Community Ratings (30% weight)</span>
              </div>
              <span className="font-semibold">{components.average_rating} pts</span>
            </div>
            <Progress 
              value={(components.average_rating / maxScore) * 100} 
              className="h-2" 
            />
            <p className="text-xs text-muted-foreground">
              Based on average rating: {metrics.average_rating?.toFixed(1) || '0'}/10
            </p>
          </div>

          {/* Red Flags Penalty (10%) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                <span>Red Flags Penalty (10% weight)</span>
              </div>
              <span className="font-semibold text-red-600">-{components.red_flags_penalty} pts</span>
            </div>
            <Progress 
              value={(components.red_flags_penalty / maxScore) * 100} 
              className="h-2 bg-red-100" 
            />
            <p className="text-xs text-muted-foreground">
              Active red flags: {metrics.red_flag_count}
            </p>
          </div>
        </div>

        {/* Formula Explanation */}
        <div className="pt-4 border-t">
          <p className="text-xs text-muted-foreground italic">
            Formula: (Impact Points × 0.6) + (Avg Rating × 10 × 0.3) - (Red Flags × 10 × 0.1)
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustScoreBreakdown;
