import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useVerifications } from "@/hooks/useVerifications";
import EnhancedVerificationRequestDialog from "./EnhancedVerificationRequestDialog";

export const CompactVerificationButton = () => {
  const { verifications, loading } = useVerifications();
  const [showRequestDialog, setShowRequestDialog] = useState(false);

  const hasGovernmentId = verifications.some(
    v => v.verification_type === 'government_id' && v.status === 'approved'
  );
  const pendingCount = verifications.filter(v => v.status === 'pending').length;

  if (loading) {
    return null;
  }

  return (
    <>
      <div className="relative">
        <Button
          onClick={() => setShowRequestDialog(true)}
          variant={hasGovernmentId ? "outline" : "gradient"}
          size="lg"
          className={`
            w-full justify-start gap-3 h-auto py-4
            ${!hasGovernmentId ? 'animate-pulse shadow-lg' : ''}
          `}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Shield className={`h-5 w-5 ${!hasGovernmentId ? 'animate-pulse' : ''}`} />
              <div className="text-left">
                <div className="font-semibold">
                  {hasGovernmentId ? 'Profile Verified' : 'Verify Your Identity'}
                </div>
                {!hasGovernmentId && (
                  <div className="text-xs opacity-90 font-normal">
                    Complete ID verification to unlock features
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {hasGovernmentId ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : pendingCount > 0 ? (
                <Badge variant="secondary" className="animate-pulse">
                  {pendingCount} Pending
                </Badge>
              ) : (
                <Badge variant="destructive" className="animate-pulse">
                  Required
                </Badge>
              )}
            </div>
          </div>
        </Button>
      </div>

      <EnhancedVerificationRequestDialog
        open={showRequestDialog}
        onOpenChange={setShowRequestDialog}
        existingVerifications={verifications}
      />
    </>
  );
};
