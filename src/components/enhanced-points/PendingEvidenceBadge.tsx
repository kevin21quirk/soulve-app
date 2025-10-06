import { Badge } from "@/components/ui/badge";
import { EnhancedImpactActivity } from "@/types/enhancedGamification";

interface PendingEvidenceBadgeProps {
  activity: EnhancedImpactActivity;
}

export const PendingEvidenceBadge = ({ activity }: PendingEvidenceBadgeProps) => {
  if (!activity.requires_evidence || activity.verified) {
    return null;
  }

  const getStatusInfo = () => {
    if (activity.points_state === 'active') {
      return {
        icon: '🔍',
        text: 'Under Review',
        className: 'border-blue-500 text-blue-700 bg-blue-50'
      };
    } else if (activity.points_state === 'pending') {
      return {
        icon: '⏳',
        text: 'Points Pending',
        className: 'border-orange-500 text-orange-700 bg-orange-50'
      };
    } else if (activity.points_state === 'escrow') {
      return {
        icon: '🔒',
        text: 'Points in Escrow',
        className: 'border-yellow-500 text-yellow-700 bg-yellow-50'
      };
    } else if (activity.points_state === 'reversed') {
      return {
        icon: '❌',
        text: 'Evidence Rejected',
        className: 'border-red-500 text-red-700 bg-red-50'
      };
    }
    return null;
  };

  const statusInfo = getStatusInfo();
  if (!statusInfo) return null;

  return (
    <Badge 
      variant="outline" 
      className={`text-xs flex items-center gap-1 ${statusInfo.className}`}
    >
      <span>{statusInfo.icon}</span>
      <span>{statusInfo.text}</span>
    </Badge>
  );
};
