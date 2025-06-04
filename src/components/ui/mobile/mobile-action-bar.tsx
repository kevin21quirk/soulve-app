
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileActionBarProps {
  children: React.ReactNode;
  className?: string;
  fixed?: boolean;
}

export const MobileActionBar = ({ 
  children, 
  className, 
  fixed = true 
}: MobileActionBarProps) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div
      className={cn(
        "bg-white border-t border-gray-200 p-4 space-y-2",
        fixed ? "fixed bottom-0 left-0 right-0 z-30" : "",
        className
      )}
    >
      {children}
    </div>
  );
};
