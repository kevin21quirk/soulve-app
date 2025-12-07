import { Badge } from '@/components/ui/badge';
import { TrustScoreCalculator } from '@/utils/trustScoreCalculator';

interface UserTrustLevelBadgeProps {
  trustScore: number;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

const UserTrustLevelBadge = ({ 
  trustScore, 
  size = 'sm',
  showDot = true 
}: UserTrustLevelBadgeProps) => {
  const level = TrustScoreCalculator.getTrustLevel(trustScore ?? 0);
  
  // Map trust levels to background colors for the dot
  const dotColors: Record<string, string> = {
    'new_user': 'bg-gray-400',
    'verified_helper': 'bg-blue-500',
    'trusted_helper': 'bg-green-500',
    'community_leader': 'bg-purple-500',
    'impact_champion': 'bg-yellow-500'
  };

  // Map trust levels to badge background styles
  const badgeStyles: Record<string, string> = {
    'new_user': 'bg-gray-100 text-gray-700 border-gray-300',
    'verified_helper': 'bg-blue-50 text-blue-700 border-blue-300',
    'trusted_helper': 'bg-green-50 text-green-700 border-green-300',
    'community_leader': 'bg-purple-50 text-purple-700 border-purple-300',
    'impact_champion': 'bg-yellow-50 text-yellow-700 border-yellow-400'
  };

  const sizeStyles = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const dotSizes = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-2.5 h-2.5'
  };

  return (
    <Badge 
      variant="outline" 
      className={`${badgeStyles[level.level]} ${sizeStyles[size]} gap-1 font-medium`}
    >
      {showDot && (
        <span className={`${dotSizes[size]} rounded-full ${dotColors[level.level]}`} />
      )}
      <span>{level.name}</span>
    </Badge>
  );
};

export default UserTrustLevelBadge;
