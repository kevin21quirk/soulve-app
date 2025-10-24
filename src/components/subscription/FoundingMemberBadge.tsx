import { Crown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FoundingMemberBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

const FoundingMemberBadge = ({ size = 'md', showIcon = true }: FoundingMemberBadgeProps) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      className={`bg-gradient-to-r from-amber-500 to-orange-600 text-white border-0 ${sizeClasses[size]} flex items-center gap-1.5 font-semibold`}
    >
      {showIcon && <Crown className={iconSizes[size]} />}
      Founding Member
    </Badge>
  );
};

export default FoundingMemberBadge;
