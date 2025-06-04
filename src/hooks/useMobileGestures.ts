import { useState, useCallback, useRef } from 'react';

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  element: HTMLElement;
}

export interface TapGesture {
  x: number;
  y: number;
  element: HTMLElement;
  tapCount: number;
}

export const useMobileGestures = () => {
  const [isSwipeEnabled, setIsSwipeEnabled] = useState(true);
  const [swipeThreshold] = useState(50);
  const [velocityThreshold] = useState(0.3);
  
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<NodeJS.Timeout | null>(null);

  const onTouchStart = useCallback((event: TouchEvent) => {
    if (!isSwipeEnabled) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [isSwipeEnabled]);

  const onTouchMove = useCallback((event: TouchEvent) => {
    // Track movement for gesture recognition
  }, []);

  const onTouchEnd = useCallback((event: TouchEvent): SwipeGesture | null => {
    if (!isSwipeEnabled || !touchStartRef.current) return null;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    touchStartRef.current = null;

    // Check if it's a swipe
    if (distance > swipeThreshold && velocity > velocityThreshold) {
      let direction: SwipeGesture['direction'];
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      return {
        direction,
        distance,
        velocity,
        element: event.target as HTMLElement
      };
    }

    return null;
  }, [isSwipeEnabled, swipeThreshold, velocityThreshold]);

  const enableSwipeGestures = useCallback((element: HTMLElement) => {
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchend', onTouchEnd as any, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchmove', onTouchMove);
      element.removeEventListener('touchend', onTouchEnd as any);
    };
  }, [onTouchStart, onTouchMove, onTouchEnd]);

  return {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    enableSwipeGestures,
    isSwipeEnabled,
    setIsSwipeEnabled,
  };
};
