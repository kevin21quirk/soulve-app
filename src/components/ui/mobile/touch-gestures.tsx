
import { useState, useCallback } from "react";

interface TouchPosition {
  x: number;
  y: number;
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

  const onTouchEnd = useCallback(() => {
    setStartTouch(null);
    setCurrentTouch(null);
  }, []);

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
