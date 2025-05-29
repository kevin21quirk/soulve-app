
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
import { Mail, Phone, Shield, Building, Award, Star, CheckCircle, Camera, AlertTriangle } from "lucide-react";
import IDVerificationFlow from "./IDVerificationFlow";

interface EnhancedVerificationRequestDialogProps {
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
    requirements: 'Valid phone number required',
    difficulty: 'Easy',
    timeEstimate: '2 minutes'
  },
  {
    type: 'government_id' as VerificationType,
    title: 'Government ID Verification',
    description: 'Verify your identity with official documentation',
    icon: Shield,
    points: '+25 trust points',
    requirements: 'Valid government-issued ID',
    difficulty: 'Medium',
    timeEstimate: '5-10 minutes',
    isIDVerification: true
  },
  {
    type: 'organization' as VerificationType,
    title: 'Organization Verification',
    description: 'Verify your affiliation with an organization',
    icon: Building,
    points: '+15 trust points',
    requirements: 'Official organization documentation',
    difficulty: 'Medium',
    timeEstimate: '10-15 minutes'
  },
  {
    type: 'expert' as VerificationType,
    title: 'Expert Verification',
    description: 'Verify your professional expertise',
    icon: Star,
    points: '+15 trust points',
    requirements: 'Professional credentials or certifications',
    difficulty: 'Medium',
    timeEstimate: '15-20 minutes'
  },
  {
    type: 'community_leader' as VerificationType,
    title: 'Community Leader',
    description: 'Recognition as a community leader',
    icon: Award,
    points: '+20 trust points',
    requirements: 'Community endorsements required',
    difficulty: 'Hard',
    timeEstimate: '30+ minutes'
  },
  {
    type: 'background_check' as VerificationType,
    title: 'Background Check',
    description: 'Complete professional background verification',
    icon: CheckCircle,
    points: '+30 trust points',
    requirements: 'Third-party background check',
    difficulty: 'Hard',
    timeEstimate: '3-5 business days'
  }
];

const EnhancedVerificationRequestDialog = ({ 
  open, 
  onOpenChange, 
  existingVerifications 
}: EnhancedVerificationRequestDialogProps) => {
  const { requestVerification } = useVerifications();
  const [requesting, setRequesting] = useState<string | null>(null);
  const [showIDFlow, setShowIDFlow] = useState(false);

  const handleRequest = async (verificationType: VerificationType) => {
    if (verificationType === 'government_id') {
      setShowIDFlow(true);
      return;
    }

    setRequesting(verificationType);
    try {
      await requestVerification(verificationType);
      onOpenChange(false);
    } finally {
      setRequesting(null);
    }
  };

  const handleIDVerificationComplete = async (data: any) => {
    setRequesting('government_id');
    try {
      await requestVerification('government_id', data);
      setShowIDFlow(false);
      onOpenChange(false);
    } finally {
      setRequesting(null);
    }
  };

  const getVerificationStatus = (type: VerificationType) => {
    return existingVerifications.find(v => v.verification_type === type);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (showIDFlow) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <IDVerificationFlow
            onComplete={handleIDVerificationComplete}
            onCancel={() => setShowIDFlow(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span>Enhance Your Trust Score</span>
          </DialogTitle>
          <p className="text-gray-600">
            Complete verifications to unlock platform features and increase your trustworthiness
          </p>
        </DialogHeader>
        
        <div className="grid gap-4 mt-4">
          {verificationTypes.map((verification) => {
            const existing = getVerificationStatus(verification.type);
            const isRequested = existing?.status === 'pending';
            const isVerified = existing?.status === 'approved';
            const isRejected = existing?.status === 'rejected';
            
            return (
              <Card key={verification.type} className="relative hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <verification.icon className="h-8 w-8 text-blue-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold">{verification.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(verification.difficulty)}`}>
                            {verification.difficulty}
                          </span>
                          <span className="text-sm font-medium text-green-600">
                            {verification.points}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-3">
                        {verification.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Requirements: </span>
                          <span className="text-gray-600">{verification.requirements}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Time needed: </span>
                          <span className="text-gray-600">{verification.timeEstimate}</span>
                        </div>
                      </div>

                      {verification.type === 'government_id' && (
                        <div className="bg-blue-50 p-3 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <Camera className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-blue-900">ID Verification Process:</p>
                              <p className="text-blue-800 mt-1">
                                Upload photos of your government ID and take a selfie for identity verification
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {verification.type === 'background_check' && (
                        <div className="bg-amber-50 p-3 rounded-lg mb-4">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                            <div className="text-sm">
                              <p className="font-medium text-amber-900">Third-party verification:</p>
                              <p className="text-amber-800 mt-1">
                                This requires external background check services and may take several business days
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        {isVerified ? (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-medium">Verified</span>
                          </div>
                        ) : isRequested ? (
                          <div className="flex items-center space-x-2 text-yellow-600">
                            <div className="animate-spin h-5 w-5 border-2 border-yellow-600 border-t-transparent rounded-full" />
                            <span className="font-medium">Review in Progress</span>
                          </div>
                        ) : isRejected ? (
                          <div className="flex items-center space-x-2 text-red-600">
                            <AlertTriangle className="h-5 w-5" />
                            <span className="font-medium">Needs Attention</span>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRequest(verification.type)}
                            disabled={requesting === verification.type}
                            className="min-w-[120px]"
                          >
                            {requesting === verification.type ? 'Starting...' : 'Start Verification'}
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

export default EnhancedVerificationRequestDialog;
