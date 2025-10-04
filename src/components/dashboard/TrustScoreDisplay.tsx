
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, AlertCircle } from "lucide-react";

interface TrustScoreDisplayProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showBadge?: boolean;
}

const TrustScoreDisplay = ({ score, size = "md", showBadge = true }: TrustScoreDisplayProps) => {
  const getTrustColor = (score: number) => {
    if (score >= 80) return "bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] text-white";
    if (score >= 60) return "bg-gradient-to-r from-[hsl(var(--soulve-blue))] to-[hsl(var(--soulve-purple))] text-white";
    return "bg-muted text-muted-foreground";
  };

  const getTrustIcon = (score: number) => {
    if (score >= 80) return CheckCircle;
    if (score >= 60) return Shield;
    return AlertCircle;
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  const TrustIcon = getTrustIcon(score);

  return (
    <div className="flex items-center space-x-2">
      <Badge 
        variant="outline" 
        className={`${getTrustColor(score)} border-none flex items-center space-x-1`}
      >
        <TrustIcon className={sizeClasses[size]} />
        <span className="font-semibold">{score}</span>
      </Badge>
      {showBadge && (
        <span className="text-xs text-gray-500">Trust Score</span>
      )}
    </div>
  );
};

export default TrustScoreDisplay;
