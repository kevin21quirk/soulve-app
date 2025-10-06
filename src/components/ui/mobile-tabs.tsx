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

  // On mobile: remove grid classes and apply horizontal scroll
  // On desktop: keep original classes (including grid)
  const finalClassName = isMobile
    ? cn(
        "flex overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-nowrap w-full gap-1",
        stripGridClasses(className)
      )
    : className;

  return (
    <TabsList 
      ref={ref} 
      className={finalClassName} 
      {...props}
    >
      {children}
    </TabsList>
  );
});

MobileAwareTabsList.displayName = "MobileAwareTabsList";
