import { cn } from "@/lib/utils";

interface NotificationBadgeProps {
  count: number;
  max?: number;
  className?: string;
}

/**
 * Notification badge component - displays a red circle with count
 * Similar to Facebook and Apple's notification badges
 */
export const NotificationBadge = ({ 
  count, 
  max = 99, 
  className 
}: NotificationBadgeProps) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <div
      className={cn(
        "absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-red-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md border-2 border-white px-1",
        className
      )}
    >
      {displayCount}
    </div>
  );
};
