
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  touchOptimized?: boolean;
}

const MobileOptimizedCard = ({ 
  children, 
  className, 
  compact = false,
  touchOptimized = true 
}: MobileOptimizedCardProps) => {
  const isMobile = useIsMobile();

  return (
    <Card
      className={cn(
        "transition-all duration-200",
        isMobile && compact && "rounded-lg shadow-sm",
        isMobile && touchOptimized && "active:scale-[0.98] touch-manipulation",
        isMobile ? "mx-2 mb-3" : "mb-4",
        className
      )}
    >
      {children}
    </Card>
  );
};

export default MobileOptimizedCard;
