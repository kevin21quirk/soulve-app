
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  Award, 
  Building, 
  Phone, 
  Mail, 
  UserCheck, 
  CheckCircle,
  Star,
  Users
} from "lucide-react";
import { useVerifications } from "@/hooks/useVerifications";
import { VerificationType } from "@/types/verification";
import { TrustScoreCalculator } from "@/utils/trustScoreCalculator";
import IDVerificationFlow from "./IDVerificationFlow";
import SkillVerificationFlow from "./SkillVerificationFlow";
import OrganizationVerificationFlow from "./OrganizationVerificationFlow";

interface EnhancedVerificationRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingVerifications: any[];
}

const EnhancedVerificationRequestDialog = ({
  open,
  onOpenChange,
  existingVerifications
}: EnhancedVerificationRequestDialogProps) => {
  const { requestVerification } = useVerifications();
  const [currentFlow, setCurrentFlow] = useState<string | null>(null);

  const verificationsConfig = [
    {
      type: 'email' as VerificationType,
      title: 'Email Verification',
      description: 'Verify your email address for basic account security',
      icon: Mail,
      impact: TrustScoreCalculator.getVerificationImpact('email'),
      difficulty: 'Easy',
      timeRequired: '2 minutes',
      available: true
    },
    {
      type: 'phone' as VerificationType,
      title: 'Phone Verification',
      description: 'Verify your phone number for enhanced communication',
      icon: Phone,
      impact: TrustScoreCalculator.getVerificationImpact('phone'),
      difficulty: 'Easy',
      timeRequired: '5 minutes',
      available: true
    },
    {
      type: 'government_id' as VerificationType,
      title: 'ID Verification',
      description: 'Verify your identity with government-issued photo ID',
      icon: Shield,
      impact: TrustScoreCalculator.getVerificationImpact('government_id'),
      difficulty: 'Medium',
      timeRequired: '10 minutes',
      available: true
    },
    {
      type: 'expert' as VerificationType,
      title: 'Skill Verification',
      description: 'Verify your professional skills and expertise',
      icon: Award,
      impact: TrustScoreCalculator.getVerificationImpact('expert'),
      difficulty: 'Medium',
      timeRequired: '15 minutes',
      available: true
    },
    {
      type: 'organization' as VerificationType,
      title: 'Organization Verification',
      description: 'Verify your nonprofit or community organization',
      icon: Building,
      impact: TrustScoreCalculator.getVerificationImpact('organization'),
      difficulty: 'Hard',
      timeRequired: '30 minutes',
      available: true
    },
    {
      type: 'community_leader' as VerificationType,
      title: 'Community Leader',
      description: 'Recognition for outstanding community contribution',
      icon: Users,
      impact: TrustScoreCalculator.getVerificationImpact('community_leader'),
      difficulty: 'Expert',
      timeRequired: 'By nomination',
      available: false
    },
    {
      type: 'background_check' as VerificationType,
      title: 'Background Check',
      description: 'Enhanced verification for high-trust roles',
      icon: UserCheck,
      impact: TrustScoreCalculator.getVerificationImpact('background_check'),
      difficulty: 'Hard',
      timeRequired: '3-5 days',
      available: true
    }
  ];

  const getVerificationStatus = (type: VerificationType) => {
    const existing = existingVerifications.find(v => v.verification_type === type);
    return existing?.status || 'not_started';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'Easy': 'bg-green-100 text-green-700',
      'Medium': 'bg-yellow-100 text-yellow-700',
      'Hard': 'bg-orange-100 text-orange-700',
      'Expert': 'bg-red-100 text-red-700'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const handleVerificationStart = (type: VerificationType) => {
    if (type === 'government_id') {
      setCurrentFlow('id');
    } else if (type === 'expert') {
      setCurrentFlow('skill');
    } else if (type === 'organization') {
      setCurrentFlow('organization');
    } else {
      // Simple verification request
      requestVerification(type);
      onOpenChange(false);
    }
  };

  const handleFlowComplete = async (type: VerificationType, data: any) => {
    await requestVerification(type, data);
    setCurrentFlow(null);
    onOpenChange(false);
  };

  const handleFlowCancel = () => {
    setCurrentFlow(null);
  };

  if (currentFlow === 'id') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <IDVerificationFlow
            onComplete={(data) => handleFlowComplete('government_id', data)}
            onCancel={handleFlowCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (currentFlow === 'skill') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <SkillVerificationFlow
            onComplete={(data) => handleFlowComplete('expert', data)}
            onCancel={handleFlowCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  if (currentFlow === 'organization') {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <OrganizationVerificationFlow
            onComplete={(data) => handleFlowComplete('organization', data)}
            onCancel={handleFlowCancel}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Choose Verification Type
          </DialogTitle>
          <DialogDescription>
            Each verification type increases your trust score and unlocks different platform features
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {verificationsConfig.map((verification) => {
            const status = getVerificationStatus(verification.type);
            const IconComponent = verification.icon;
            
            return (
              <Card key={verification.type} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg">
                        <IconComponent className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{verification.title}</CardTitle>
                        <CardDescription>{verification.description}</CardDescription>
                      </div>
                    </div>
                    
                    {status === 'approved' && (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Badge className={getDifficultyColor(verification.difficulty)}>
                        {verification.difficulty}
                      </Badge>
                      
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">
                          +{verification.impact.points} Trust Points
                        </span>
                      </div>
                      
                      <span className="text-sm text-gray-600">
                        {verification.timeRequired}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {status === 'pending' && (
                        <Badge variant="outline" className="text-yellow-600">
                          Under Review
                        </Badge>
                      )}
                      
                      {status === 'approved' && (
                        <Badge variant="outline" className="text-green-600">
                          Verified
                        </Badge>
                      )}
                      
                      {status === 'rejected' && (
                        <Badge variant="outline" className="text-red-600">
                          Rejected
                        </Badge>
                      )}
                      
                      {status === 'not_started' && verification.available && (
                        <Button
                          onClick={() => handleVerificationStart(verification.type)}
                          size="sm"
                        >
                          Start Verification
                        </Button>
                      )}
                      
                      {!verification.available && (
                        <Button size="sm" disabled>
                          Not Available
                        </Button>
                      )}
                      
                      {status === 'rejected' && (
                        <Button
                          onClick={() => handleVerificationStart(verification.type)}
                          size="sm"
                          variant="outline"
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-2">
                    {verification.impact.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Verification Benefits</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Higher trust scores unlock premium features</li>
            <li>• Verified profiles get priority in help matching</li>
            <li>• Enhanced credibility within the community</li>
            <li>• Access to exclusive groups and events</li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedVerificationRequestDialog;
