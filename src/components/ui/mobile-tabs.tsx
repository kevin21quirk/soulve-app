import * as React from "react";
import { TabsList } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileAwareTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  children: React.ReactNode;
}

// Helper to strip grid-related classes on mobile
const stripGridClasses = (className: string | undefined): string => {
  if (!className) return "";
  return className
    .split(" ")
    .filter(cls => !cls.match(/^(grid|grid-cols-|grid-rows-|grid-flow-)/))
    .join(" ");
};

export const MobileAwareTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  MobileAwareTabsListProps
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftGradient, setShowLeftGradient] = React.useState(false);
  const [showRightGradient, setShowRightGradient] = React.useState(false);

  // Check scroll position to show/hide gradients
  const handleScroll = React.useCallback(() => {
    const element = scrollRef.current;
    if (!element) return;

    const { scrollLeft, scrollWidth, clientWidth } = element;
    
    // Show left gradient if scrolled right
    setShowLeftGradient(scrollLeft > 10);
    
    // Show right gradient if not scrolled to end
    setShowRightGradient(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  // Initial check and setup scroll listener
  React.useEffect(() => {
    if (!isMobile) return;
    
    const element = scrollRef.current;
    if (!element) return;

    // Initial check
    handleScroll();

    // Add scroll listener
    element.addEventListener('scroll', handleScroll);
    
    // Recheck on resize
    window.addEventListener('resize', handleScroll);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile, handleScroll]);

  // On mobile: remove grid classes and apply horizontal scroll
  // On desktop: keep original classes (including grid)
  const finalClassName = isMobile
    ? cn(
        "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-nowrap w-full gap-1",
        stripGridClasses(className)
      )
    : className;

  if (!isMobile) {
    return (
      <TabsList 
        ref={ref} 
        className={finalClassName} 
        {...props}
      >
        {children}
      </TabsList>
    );
  }

  return (
    <div className="relative w-full">
      {/* Left gradient indicator */}
      {showLeftGradient && (
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      )}
      
      {/* Scrollable tabs */}
      <div ref={scrollRef} className="w-full overflow-x-auto scrollbar-hide">
        <TabsList 
          ref={ref} 
          className={finalClassName} 
          {...props}
        >
          {children}
        </TabsList>
      </div>

      {/* Right gradient indicator */}
      {showRightGradient && (
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      )}
    </div>
  );
});

MobileAwareTabsList.displayName = "MobileAwareTabsList";
