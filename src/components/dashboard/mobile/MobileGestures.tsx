
import { useState } from "react";

export interface TouchGesture {
  x: number;
  y: number;
}

export interface SwipeResult {
  isLeftSwipe: boolean;
  isRightSwipe: boolean;
  isUpSwipe: boolean;
  isDownSwipe: boolean;
}

/**
 * Hook for handling touch gestures on mobile devices
 * Provides swipe detection with configurable thresholds
 */
export const useTouchGestures = (threshold = 50) => {
  const [touchStart, setTouchStart] = useState<TouchGesture | null>(null);
  const [touchEnd, setTouchEnd] = useState<TouchGesture | null>(null);

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

  const onTouchEnd = (): SwipeResult | null => {
    if (!touchStart || !touchEnd) return null;

    const distanceX = touchStart.x - touchEnd.x;
    const distanceY = touchStart.y - touchEnd.y;
    
    return {
      isLeftSwipe: distanceX > threshold,
      isRightSwipe: distanceX < -threshold,
      isUpSwipe: distanceY > threshold,
      isDownSwipe: distanceY < -threshold,
    };
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
