
import { useState } from "react";
import { useTouchGestures } from "./touch-gestures";

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
}

/**
 * Pull to refresh component for mobile
 */
export const PullToRefresh = ({
  onRefresh,
  children,
}: PullToRefreshProps) => {
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
