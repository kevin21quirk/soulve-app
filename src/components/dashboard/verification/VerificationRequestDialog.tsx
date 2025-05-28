
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useVerifications } from "@/hooks/useVerifications";
import { UserVerification, VerificationType } from "@/types/verification";
import { Mail, Phone, Shield, Building, Award, Star, CheckCircle } from "lucide-react";

interface VerificationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingVerifications: UserVerification[];
}

const verificationTypes = [
  {
    type: 'phone' as VerificationType,
    title: 'Phone Verification',
    description: 'Verify your phone number to increase trust',
    icon: Phone,
    points: '+10 trust points',
    requirements: 'Valid phone number required'
  },
  {
    type: 'government_id' as VerificationType,
    title: 'Government ID',
    description: 'Verify your identity with official documentation',
    icon: Shield,
    points: '+20 trust points',
    requirements: 'Valid government-issued ID'
  },
  {
    type: 'organization' as VerificationType,
    title: 'Organization Verification',
    description: 'Verify your affiliation with an organization',
    icon: Building,
    points: '+15 trust points',
    requirements: 'Official organization documentation'
  },
  {
    type: 'expert' as VerificationType,
    title: 'Expert Verification',
    description: 'Verify your professional expertise',
    icon: Star,
    points: '+20 trust points',
    requirements: 'Professional credentials or certifications'
  },
  {
    type: 'community_leader' as VerificationType,
    title: 'Community Leader',
    description: 'Recognition as a community leader',
    icon: Award,
    points: '+25 trust points',
    requirements: 'Community endorsements required'
  },
  {
    type: 'background_check' as VerificationType,
    title: 'Background Check',
    description: 'Complete background verification',
    icon: CheckCircle,
    points: '+30 trust points',
    requirements: 'Third-party background check'
  }
];

const VerificationRequestDialog = ({ 
  open, 
  onOpenChange, 
  existingVerifications 
}: VerificationRequestDialogProps) => {
  const { requestVerification } = useVerifications();
  const [requesting, setRequesting] = useState<string | null>(null);

  const handleRequest = async (verificationType: VerificationType) => {
    setRequesting(verificationType);
    try {
      await requestVerification(verificationType);
      onOpenChange(false);
    } finally {
      setRequesting(null);
    }
  };

  const getVerificationStatus = (type: VerificationType) => {
    return existingVerifications.find(v => v.verification_type === type);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request Profile Verification</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {verificationTypes.map((verification) => {
            const existing = getVerificationStatus(verification.type);
            const isRequested = existing?.status === 'pending';
            const isVerified = existing?.status === 'approved';
            const isRejected = existing?.status === 'rejected';
            
            return (
              <Card key={verification.type} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <verification.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{verification.title}</h3>
                        <span className="text-sm font-medium text-green-600">
                          {verification.points}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-2">
                        {verification.description}
                      </p>
                      
                      <p className="text-xs text-gray-500 mb-3">
                        Requirements: {verification.requirements}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {isVerified ? (
                          <span className="text-green-600 text-sm font-medium">
                            ✓ Verified
                          </span>
                        ) : isRequested ? (
                          <span className="text-yellow-600 text-sm font-medium">
                            ⏳ Pending Review
                          </span>
                        ) : isRejected ? (
                          <span className="text-red-600 text-sm font-medium">
                            ✗ Rejected
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleRequest(verification.type)}
                            disabled={requesting === verification.type}
                          >
                            {requesting === verification.type ? 'Requesting...' : 'Request'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationRequestDialog;
