
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Mobile-optimized card component
 */
export const MobileCard = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof Card>) => {
  const isMobile = useIsMobile();

  return (
    <Card
      className={cn(
        isMobile ? "rounded-none border-x-0 shadow-sm" : "rounded-lg shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};
