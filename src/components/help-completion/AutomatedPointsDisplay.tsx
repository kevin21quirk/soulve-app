
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Star, Award, TrendingUp, Clock } from 'lucide-react';

interface AutomatedPointsDisplayProps {
  completionRequest: {
    id: string;
    status: string;
    feedback_rating?: number;
    completion_evidence?: any;
  };
  helperName?: string;
}

const AutomatedPointsDisplay = ({ completionRequest, helperName }: AutomatedPointsDisplayProps) => {
  const [calculatedPoints, setCalculatedPoints] = useState<{
    basePoints: number;
    bonusPoints: number;
    totalPoints: number;
    breakdown: any;
  } | null>(null);

  useEffect(() => {
    calculatePoints();
  }, [completionRequest]);

  const calculatePoints = () => {
    const rating = completionRequest.feedback_rating || 3;
    const evidence = completionRequest.completion_evidence || {};
    
    // Base points calculation
    let basePoints = 25; // Standard help completion
    
    // Rating multiplier
    const ratingMultiplier = {
      1: 0.4,  // 10 points
      2: 0.6,  // 15 points
      3: 1.0,  // 25 points (base)
      4: 1.4,  // 35 points
      5: 2.0   // 50 points
    }[rating] || 1.0;
    
    const ratingAdjustedPoints = Math.round(basePoints * ratingMultiplier);
    
    // Bonus calculations
    let bonusPoints = 0;
    const breakdown: any = {
      basePoints: ratingAdjustedPoints,
      bonuses: []
    };
    
    // Evidence bonus
    if (evidence.files && evidence.files.length > 0) {
      bonusPoints += 5;
      breakdown.bonuses.push({ type: 'Evidence Submitted', points: 5 });
    }
    
    // Time tracking bonus
    if (evidence.timeSpent) {
      bonusPoints += 3;
      breakdown.bonuses.push({ type: 'Time Tracked', points: 3 });
    }
    
    // Location verification bonus
    if (evidence.location) {
      bonusPoints += 2;
      breakdown.bonuses.push({ type: 'Location Verified', points: 2 });
    }
    
    // High rating bonus
    if (rating >= 5) {
      bonusPoints += 10;
      breakdown.bonuses.push({ type: 'Excellent Rating', points: 10 });
    }
    
    const totalPoints = ratingAdjustedPoints + bonusPoints;
    
    setCalculatedPoints({
      basePoints: ratingAdjustedPoints,
      bonusPoints,
      totalPoints,
      breakdown
    });
  };

  if (!calculatedPoints) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Clock className="h-5 w-5 animate-spin mr-2" />
            <span>Calculating points...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPointsColor = (points: number) => {
    if (points >= 50) return 'text-yellow-600';
    if (points >= 35) return 'text-green-600';
    if (points >= 25) return 'text-blue-600';
    return 'text-gray-600';
  };

  const getProgressValue = (points: number) => {
    return Math.min((points / 60) * 100, 100);
  };

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-green-600" />
          Points Calculation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <div className={`text-3xl font-bold ${getPointsColor(calculatedPoints.totalPoints)}`}>
            {calculatedPoints.totalPoints}
          </div>
          <p className="text-sm text-gray-600">
            Total Points for {helperName || 'Helper'}
          </p>
          <Progress 
            value={getProgressValue(calculatedPoints.totalPoints)} 
            className="mt-2"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm">Base Points:</span>
            <Badge variant="outline" className="bg-blue-100 text-blue-800">
              {calculatedPoints.basePoints} pts
            </Badge>
          </div>

          {calculatedPoints.breakdown.bonuses.map((bonus: any, index: number) => (
            <div key={index} className="flex items-center justify-between">
              <span className="text-sm">+ {bonus.type}:</span>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                +{bonus.points} pts
              </Badge>
            </div>
          ))}

          {completionRequest.feedback_rating && (
            <div className="flex items-center justify-between pt-2 border-t">
              <span className="text-sm flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                Rating Impact:
              </span>
              <Badge variant="outline">
                {completionRequest.feedback_rating}/5 stars
              </Badge>
            </div>
          )}
        </div>

        {completionRequest.status === 'approved' && (
          <div className="bg-green-100 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Points Awarded Successfully!
              </span>
            </div>
            <p className="text-xs text-green-700 mt-1">
              These points have been added to the helper's total score and impact metrics.
            </p>
          </div>
        )}

        {completionRequest.status === 'pending' && (
          <div className="bg-yellow-100 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Pending Approval
              </span>
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              Points will be automatically awarded once the help completion is approved.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AutomatedPointsDisplay;
