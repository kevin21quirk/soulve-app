
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useVerifications } from "@/hooks/useVerifications";
import { Shield, Plus, TrendingUp } from "lucide-react";
import VerificationBadges from "./VerificationBadges";
import EnhancedVerificationRequestDialog from "./EnhancedVerificationRequestDialog";
import { useState } from "react";

const VerificationPanel = () => {
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
  const hasGovernmentId = verifications.some(v => v.verification_type === 'government_id' && v.status === 'approved');
  const needsVerification = !hasGovernmentId;

  return (
    <>
      <Card className={needsVerification ? "border-2 border-primary shadow-lg" : ""}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className={`h-6 w-6 ${needsVerification ? 'text-primary animate-pulse' : 'text-blue-600'}`} />
              <span>Profile Verification</span>
            </div>
            {needsVerification && (
              <Badge variant="soulve" className="animate-pulse">
                Action Required
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trust Score */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Trust Score</span>
              <div className="flex items-center space-x-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-green-600">{trustScore}%</span>
              </div>
            </div>
            <Progress value={trustScore} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Complete more verifications to increase your trust score
            </p>
          </div>

          {/* Verification Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
          </div>

          {/* Current Badges */}
          {approvedCount > 0 && (
            <div>
              <h4 className="font-medium mb-3">Your Verification Badges</h4>
              <VerificationBadges verifications={verifications} size="md" />
            </div>
          )}

          {/* Action Button */}
          <Button 
            onClick={() => setShowRequestDialog(true)}
            className={`w-full ${needsVerification ? 'animate-pulse' : ''}`}
            variant="gradient"
            size="lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            {needsVerification ? 'Verify Your ID Now' : 'Request New Verification'}
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

export default VerificationPanel;
