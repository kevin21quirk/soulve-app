import * as React from "react";
import { TabsList } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileAwareTabsListProps extends React.ComponentPropsWithoutRef<typeof TabsList> {
  children: React.ReactNode;
}

export const MobileAwareTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  MobileAwareTabsListProps
>(({ className, children, ...props }, ref) => {
  const isMobile = useIsMobile();

  // Always use TabsList to maintain Radix context, just change styling
  return (
    <TabsList 
      ref={ref} 
      className={cn(
        isMobile && "overflow-x-auto scrollbar-hide snap-x snap-mandatory flex-nowrap w-full",
        className
      )} 
      {...props}
    >
      {children}
    </TabsList>
  );
});

MobileAwareTabsList.displayName = "MobileAwareTabsList";
