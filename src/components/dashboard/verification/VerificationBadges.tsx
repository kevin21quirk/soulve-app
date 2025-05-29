
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

const getVerificationVariant = (type: VerificationType) => {
  switch (type) {
    case 'email': return 'soulve-blue';
    case 'phone': return 'soulve-teal';
    case 'government_id': return 'soulve';
    case 'organization': return 'soulve-purple';
    case 'community_leader': return 'soulve';
    case 'expert': return 'soulve-blue';
    case 'background_check': return 'soulve-teal';
    default: return 'soulve';
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
        const variant = getVerificationVariant(verification.verification_type);
        
        return (
          <Badge
            key={verification.id}
            variant={variant}
            className={`${textSize} flex items-center space-x-1`}
          >
            <Icon className={iconSize} />
            <span>{getVerificationLabel(verification.verification_type)}</span>
            <CheckCircle className={`${iconSize} ml-1`} />
          </Badge>
        );
      })}
    </div>
  );
};

export default VerificationBadges;
