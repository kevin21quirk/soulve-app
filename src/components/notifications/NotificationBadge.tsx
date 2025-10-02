import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  variant?: "default" | "destructive" | "outline" | "secondary";
  className?: string;
  showZero?: boolean;
}

const NotificationBadge = ({
  count,
  max = 99,
  variant = "destructive",
  className,
  showZero = false,
}: NotificationBadgeProps) => {
  if (count === 0 && !showZero) {
    return null;
  }

  const displayCount = count > max ? `${max}+` : count.toString();

  return (
    <Badge
      variant={variant}
      className={cn(
        "absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 text-xs font-bold rounded-full",
        count > 0 && "animate-pulse",
        className
      )}
    >
      {displayCount}
    </Badge>
  );
};

export default NotificationBadge;
