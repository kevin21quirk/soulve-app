
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useVerifications } from "@/hooks/useVerifications";
import { Shield, Plus, TrendingUp, Target, Award } from "lucide-react";
import VerificationBadges from "./VerificationBadges";
import EnhancedVerificationRequestDialog from "./EnhancedVerificationRequestDialog";
import { useState } from "react";
import { TrustScoreCalculator } from "@/utils/trustScoreCalculator";

const EnhancedVerificationPanel = () => {
  const { verifications, trustScore, loading } = useVerifications();
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const approvedCount = verifications.filter(v => v.status === 'approved').length;
  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const trustLevel = TrustScoreCalculator.getTrustLevel(trustScore);
  const nextMilestone = TrustScoreCalculator.getNextMilestone(trustScore);

  // Calculate completion percentage (out of 7 total verifications)
  const totalVerifications = 7;
  const completionPercentage = (approvedCount / totalVerifications) * 100;

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Trust & Verification</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trust Score Section */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Trust Score</h3>
                <p className={`text-sm font-medium ${trustLevel.color}`}>
                  {trustLevel.level} Level
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-3xl font-bold text-gray-900">{trustScore}</span>
                  <span className="text-lg text-gray-600">/100</span>
                </div>
              </div>
            </div>
            
            <Progress value={trustScore} className="h-3 mb-3" />
            
            <p className="text-sm text-gray-600 mb-4">
              {trustLevel.description}
            </p>

            {nextMilestone && (
              <div className="bg-white/60 p-3 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-sm">
                    Next: {nextMilestone.nextLevel} ({nextMilestone.pointsNeeded} points needed)
                  </span>
                </div>
                <div className="text-xs text-gray-600">
                  <span className="font-medium">Quick wins:</span> {nextMilestone.suggestions[0]}
                </div>
              </div>
            )}
          </div>

          {/* Verification Progress */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Verification Progress</h4>
              <span className="text-sm text-gray-600">
                {approvedCount} of {totalVerifications} complete
              </span>
            </div>
            
            <Progress value={completionPercentage} className="h-2 mb-3" />
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-xl font-bold text-green-600">{approvedCount}</div>
                <div className="text-xs text-gray-600">Verified</div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-xl font-bold text-yellow-600">{pendingCount}</div>
                <div className="text-xs text-gray-600">Pending</div>
              </div>
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">
                  {totalVerifications - approvedCount - pendingCount}
                </div>
                <div className="text-xs text-gray-600">Available</div>
              </div>
            </div>
          </div>

          {/* Current Badges */}
          {approvedCount > 0 && (
            <div>
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Award className="h-4 w-4 text-blue-600" />
                <span>Your Verification Badges</span>
              </h4>
              <VerificationBadges verifications={verifications} size="md" />
            </div>
          )}

          {/* Trust Level Benefits */}
          {trustLevel.benefits.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your Level Benefits</h4>
              <ul className="text-sm space-y-1">
                {trustLevel.benefits.slice(0, 3).map((benefit, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
                {trustLevel.benefits.length > 3 && (
                  <li className="text-gray-500 text-xs">
                    +{trustLevel.benefits.length - 3} more benefits...
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={() => setShowRequestDialog(true)}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Verification
          </Button>
        </CardContent>
      </Card>

      <EnhancedVerificationRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        existingVerifications={verifications}
      />
    </>
  );
};

export default EnhancedVerificationPanel;
