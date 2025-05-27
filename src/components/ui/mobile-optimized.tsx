
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Menu, Search, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

// Mobile-first responsive hook
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);
    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  return isMobile;
};

// Touch gestures hook
export const useTouchGestures = () => {
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null);
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number } | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd({
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    });
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    return { isLeftSwipe, isRightSwipe, isUpSwipe, isDownSwipe };
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};

// Mobile Navigation Component
export const MobileNavigation = ({
  isOpen,
  onToggle,
  children,
}: {
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggle}
        className="md:hidden"
        aria-label="Toggle navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={onToggle}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300">
            <div className="p-4 border-b">
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="mb-4"
              >
                <ChevronLeft className="h-5 w-5" />
                Back
              </Button>
            </div>
            <div className="p-4">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Mobile-optimized Card
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

// Pull to refresh component
export const PullToRefresh = ({
  onRefresh,
  children,
}: {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      onTouchStart(e);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (window.scrollY === 0 && !isPulling) {
      onTouchMove(e);
      const touch = e.touches[0];
      if (touch) {
        const distance = Math.max(0, touch.clientY - 100);
        setPullDistance(Math.min(distance, 100));
        if (distance > 50) {
          setIsPulling(true);
        }
      }
    }
  };

  const handleTouchEnd = async () => {
    if (isPulling) {
      await onRefresh();
    }
    setIsPulling(false);
    setPullDistance(0);
    onTouchEnd();
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {pullDistance > 0 && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center text-gray-600 transition-all duration-200"
          style={{ height: `${pullDistance}px` }}
        >
          <div className="text-sm">
            {isPulling ? "Release to refresh" : "Pull to refresh"}
          </div>
        </div>
      )}
      <div style={{ marginTop: `${pullDistance}px` }}>
        {children}
      </div>
    </div>
  );
};

// Mobile-optimized search and filter bar
export const MobileSearchFilter = ({
  searchValue,
  onSearchChange,
  onFilterToggle,
  showFilters,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onFilterToggle: () => void;
  showFilters: boolean;
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return null;

  return (
    <div className="sticky top-0 z-40 bg-white border-b p-4 md:hidden">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          size="sm"
          onClick={onFilterToggle}
          className="px-3"
        >
          <Filter className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

// Bottom action bar for mobile
export const MobileActionBar = ({
  actions,
}: {
  actions: Array<{
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void;
    variant?: "default" | "destructive";
  }>;
}) => {
  const isMobile = useIsMobile();

  if (!isMobile || actions.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 md:hidden">
      <div className="flex space-x-2">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "default"}
            onClick={action.onClick}
            className="flex-1 flex items-center justify-center space-x-2"
          >
            <action.icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};
