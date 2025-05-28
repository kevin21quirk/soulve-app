
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, Clock, XCircle, Star, Award, Building, Phone, Mail } from "lucide-react";
import { UserVerification, VerificationType } from "@/types/verification";

interface VerificationBadgesProps {
  verifications: UserVerification[];
  size?: "sm" | "md" | "lg";
}

const getVerificationIcon = (type: VerificationType) => {
  switch (type) {
    case 'email': return Mail;
    case 'phone': return Phone;
    case 'government_id': return Shield;
    case 'organization': return Building;
    case 'community_leader': return Award;
    case 'expert': return Star;
    case 'background_check': return CheckCircle;
    default: return Shield;
  }
};

const getVerificationLabel = (type: VerificationType) => {
  switch (type) {
    case 'email': return 'Email Verified';
    case 'phone': return 'Phone Verified';
    case 'government_id': return 'ID Verified';
    case 'organization': return 'Organization Verified';
    case 'community_leader': return 'Community Leader';
    case 'expert': return 'Expert Verified';
    case 'background_check': return 'Background Checked';
    default: return 'Verified';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return CheckCircle;
    case 'pending': return Clock;
    case 'rejected': return XCircle;
    case 'expired': return XCircle;
    default: return Clock;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved': return 'bg-green-100 text-green-800 border-green-200';
    case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
    case 'expired': return 'bg-gray-100 text-gray-800 border-gray-200';
    default: return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const VerificationBadges = ({ verifications, size = "md" }: VerificationBadgesProps) => {
  const approvedVerifications = verifications.filter(v => v.status === 'approved');
  
  if (approvedVerifications.length === 0) {
    return null;
  }

  const iconSize = size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4";
  const textSize = size === "sm" ? "text-xs" : size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex flex-wrap gap-2">
      {approvedVerifications.map((verification) => {
        const Icon = getVerificationIcon(verification.verification_type);
        const StatusIcon = getStatusIcon(verification.status);
        
        return (
          <Badge
            key={verification.id}
            className={`${getStatusColor(verification.status)} ${textSize} flex items-center space-x-1`}
          >
            <Icon className={iconSize} />
            <span>{getVerificationLabel(verification.verification_type)}</span>
            <StatusIcon className={`${iconSize} ml-1`} />
          </Badge>
        );
      })}
    </div>
  );
};

export default VerificationBadges;
