
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout = ({ children, className }: MobileLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "min-h-screen bg-gray-50",
        isMobile ? "pb-20" : "",
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export const MobileContainer = ({ 
  children, 
  className, 
  padding = true 
}: MobileContainerProps) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "w-full max-w-screen-xl mx-auto",
        isMobile && padding ? "px-4 py-2" : "",
        !isMobile ? "px-6 py-4" : "",
        className
      )}
    >
      {children}
    </div>
  );
};
