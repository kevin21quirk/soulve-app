
import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
  hasBottomNav?: boolean;
}

export const MobileLayout = ({ 
  children, 
  className, 
  padding = "md",
  hasBottomNav = true 
}: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    none: "",
    sm: "px-2 py-2",
    md: "px-4 py-4", 
    lg: "px-6 py-6"
  };

  return (
    <div className={cn(
      "w-full max-w-full overflow-x-hidden",
      isMobile && paddingClasses[padding],
      isMobile && hasBottomNav && "pb-20", // Space for bottom nav
      !isMobile && "px-4 sm:px-6 lg:px-8",
      className
    )}>
      {children}
    </div>
  );
};

export const MobileContainer = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "w-full",
      isMobile ? "max-w-full px-4" : "max-w-7xl mx-auto",
      className
    )}>
      {children}
    </div>
  );
};

export const MobileCard = ({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string; 
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={cn(
      "bg-white border border-gray-200",
      isMobile ? "rounded-lg mx-2 my-2 shadow-sm" : "rounded-lg shadow-md",
      className
    )}>
      {children}
    </div>
  );
};
