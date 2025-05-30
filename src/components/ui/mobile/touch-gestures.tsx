
import { useState, useCallback } from "react";

interface TouchPosition {
  x: number;
  y: number;
}

export interface SwipeResult {
  isLeftSwipe: boolean;
  isRightSwipe: boolean;
  isUpSwipe: boolean;
  isDownSwipe: boolean;
}

export const useTouchGestures = () => {
  const [startTouch, setStartTouch] = useState<TouchPosition | null>(null);
  const [currentTouch, setCurrentTouch] = useState<TouchPosition | null>(null);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setStartTouch({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch) {
      setCurrentTouch({ x: touch.clientX, y: touch.clientY });
    }
  }, []);

  const onTouchEnd = useCallback((): SwipeResult | null => {
    if (!startTouch || !currentTouch) {
      setStartTouch(null);
      setCurrentTouch(null);
      return null;
    }

    const deltaX = currentTouch.x - startTouch.x;
    const deltaY = currentTouch.y - startTouch.y;
    const minSwipeDistance = 50;

    const result: SwipeResult = {
      isLeftSwipe: deltaX < -minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY),
      isRightSwipe: deltaX > minSwipeDistance && Math.abs(deltaX) > Math.abs(deltaY),
      isUpSwipe: deltaY < -minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX),
      isDownSwipe: deltaY > minSwipeDistance && Math.abs(deltaY) > Math.abs(deltaX)
    };

    setStartTouch(null);
    setCurrentTouch(null);
    
    return result;
  }, [startTouch, currentTouch]);

  const getSwipeDirection = useCallback(() => {
    if (!startTouch || !currentTouch) return null;

    const deltaX = currentTouch.x - startTouch.x;
    const deltaY = currentTouch.y - startTouch.y;
    const minSwipeDistance = 50;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > minSwipeDistance) {
        return deltaX > 0 ? 'right' : 'left';
      }
    } else {
      if (Math.abs(deltaY) > minSwipeDistance) {
        return deltaY > 0 ? 'down' : 'up';
      }
    }

    return null;
  }, [startTouch, currentTouch]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    getSwipeDirection,
    swipeDistance: startTouch && currentTouch ? {
      x: currentTouch.x - startTouch.x,
      y: currentTouch.y - startTouch.y
    } : null
  };
};
