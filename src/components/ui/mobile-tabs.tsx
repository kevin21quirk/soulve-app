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

  if (isMobile) {
    return (
      <div
        ref={ref as any}
        className={cn(
          "inline-flex h-10 items-center p-1 text-muted-foreground overflow-x-auto scrollbar-hide snap-x snap-mandatory bg-muted rounded-md",
          "flex-nowrap gap-1",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  return (
    <TabsList ref={ref} className={className} {...props}>
      {children}
    </TabsList>
  );
});

MobileAwareTabsList.displayName = "MobileAwareTabsList";
