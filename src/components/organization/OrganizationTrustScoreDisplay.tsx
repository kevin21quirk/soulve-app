import { Badge } from '@/components/ui/badge';
import { Shield, CheckCircle, Award } from 'lucide-react';
import { getTrustScoreColor, getTrustScoreLabel } from '@/services/organizationTrustScoreService';

interface OrganizationTrustScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const OrganizationTrustScoreDisplay = ({
  score,
  size = 'md',
  showLabel = true,
}: OrganizationTrustScoreDisplayProps) => {
  const getTrustIcon = (score: number) => {
    if (score >= 90) return Award;
    if (score >= 70) return CheckCircle;
    return Shield;
  };

  const sizeClasses = {
    sm: 'h-4 w-4 text-xs',
    md: 'h-5 w-5 text-sm',
    lg: 'h-7 w-7 text-lg',
  };

  const TrustIcon = getTrustIcon(score);
  const colorGradient = getTrustScoreColor(score);
  const label = getTrustScoreLabel(score);

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`bg-gradient-to-r ${colorGradient} text-white border-none flex items-center gap-1.5 px-3 py-1.5`}
      >
        <TrustIcon className={sizeClasses[size]} />
        <span className="font-bold">{score}</span>
        {showLabel && size !== 'sm' && (
          <span className="font-medium opacity-90">Trust Score</span>
        )}
      </Badge>
      {showLabel && size === 'lg' && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};

export default OrganizationTrustScoreDisplay;
