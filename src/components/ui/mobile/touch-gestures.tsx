
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
 */
export const useTouchGestures = () => {
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
    const isLeftSwipe = distanceX > 50;
    const isRightSwipe = distanceX < -50;
    const isUpSwipe = distanceY > 50;
    const isDownSwipe = distanceY < -50;

    return { isLeftSwipe, isRightSwipe, isUpSwipe, isDownSwipe };
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
};
