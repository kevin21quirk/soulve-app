
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface MobileScrollContainerProps {
  children: React.ReactNode;
  className?: string;
  onScrollEnd?: () => void;
  pullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
}

const MobileScrollContainer = ({
  children,
  className,
  onScrollEnd,
  pullToRefresh = false,
  onRefresh,
}: MobileScrollContainerProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollRef.current || !onScrollEnd) return;
      
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 100) {
        onScrollEnd();
      }
    };

    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollElement.removeEventListener('scroll', handleScroll);
    }
  }, [onScrollEnd]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!pullToRefresh || !scrollRef.current) return;
    
    const scrollTop = scrollRef.current.scrollTop;
    if (scrollTop === 0) {
      const touch = e.touches[0];
      (scrollRef.current as any).startY = touch.clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!pullToRefresh || !scrollRef.current) return;
    
    const scrollTop = scrollRef.current.scrollTop;
    const startY = (scrollRef.current as any).startY;
    
    if (scrollTop === 0 && startY) {
      const touch = e.touches[0];
      const currentY = touch.clientY;
      const distance = Math.max(0, (currentY - startY) / 2);
      
      if (distance > 0) {
        e.preventDefault();
        setPullDistance(Math.min(distance, 80));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!pullToRefresh || pullDistance < 60) {
      setPullDistance(0);
      return;
    }

    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn(
        "overflow-y-auto overscroll-y-contain",
        "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: pullDistance > 0 ? `translateY(${pullDistance}px)` : undefined,
        transition: pullDistance === 0 ? 'transform 0.3s ease-out' : undefined,
      }}
    >
      {pullToRefresh && pullDistance > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          {isRefreshing ? (
            <div className="animate-spin w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full mx-auto" />
          ) : pullDistance > 60 ? (
            'Release to refresh'
          ) : (
            'Pull to refresh'
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default MobileScrollContainer;
