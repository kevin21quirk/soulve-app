
import { useState, useCallback, useRef, useEffect } from 'react';

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

  const handleSwipe = useCallback((gesture: SwipeGesture) => {
    // Default swipe handler - can be overridden
    console.log('Swipe detected:', gesture);
  }, []);

  const handleTap = useCallback((gesture: TapGesture) => {
    // Default tap handler - can be overridden
    console.log('Tap detected:', gesture);
  }, []);

  const handleDoubleTap = useCallback((gesture: TapGesture) => {
    // Default double tap handler - can be overridden
    console.log('Double tap detected:', gesture);
  }, []);

  const onTouchStart = useCallback((event: TouchEvent) => {
    if (!isSwipeEnabled) return;

    const touch = event.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [isSwipeEnabled]);

  const onTouchEnd = useCallback((event: TouchEvent) => {
    if (!isSwipeEnabled || !touchStartRef.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;
    const deltaTime = Date.now() - touchStartRef.current.time;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / deltaTime;

    // Check if it's a swipe
    if (distance > swipeThreshold && velocity > velocityThreshold) {
      let direction: SwipeGesture['direction'];
      
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 'right' : 'left';
      } else {
        direction = deltaY > 0 ? 'down' : 'up';
      }

      const swipeGesture: SwipeGesture = {
        direction,
        distance,
        velocity,
        element: event.target as HTMLElement
      };

      handleSwipe(swipeGesture);
    } else {
      // Handle tap gestures
      tapCountRef.current++;
      
      if (tapTimerRef.current) {
        clearTimeout(tapTimerRef.current);
      }

      tapTimerRef.current = setTimeout(() => {
        const tapGesture: TapGesture = {
          x: touch.clientX,
          y: touch.clientY,
          element: event.target as HTMLElement,
          tapCount: tapCountRef.current
        };

        if (tapCountRef.current === 1) {
          handleTap(tapGesture);
        } else if (tapCountRef.current === 2) {
          handleDoubleTap(tapGesture);
        }

        tapCountRef.current = 0;
      }, 300);
    }

    touchStartRef.current = null;
  }, [isSwipeEnabled, swipeThreshold, velocityThreshold, handleSwipe, handleTap, handleDoubleTap]);

  const enableSwipeGestures = useCallback((element: HTMLElement) => {
    element.addEventListener('touchstart', onTouchStart, { passive: true });
    element.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', onTouchStart);
      element.removeEventListener('touchend', onTouchEnd);
    };
  }, [onTouchStart, onTouchEnd]);

  const disableSwipeGestures = useCallback(() => {
    setIsSwipeEnabled(false);
  }, []);

  const enableSwipeGesturesGlobal = useCallback(() => {
    setIsSwipeEnabled(true);
  }, []);

  // Pull-to-refresh functionality
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const pullThreshold = 100;

  const handlePullToRefresh = useCallback((onRefresh: () => void) => {
    let startY = 0;
    let currentY = 0;

    const onTouchStartPull = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
    };

    const onTouchMovePull = (event: TouchEvent) => {
      currentY = event.touches[0].clientY;
      const distance = currentY - startY;

      if (distance > 0 && window.scrollY === 0) {
        setIsPulling(true);
        setPullDistance(Math.min(distance, pullThreshold * 1.5));
        event.preventDefault();
      }
    };

    const onTouchEndPull = () => {
      if (isPulling && pullDistance >= pullThreshold) {
        onRefresh();
      }
      setIsPulling(false);
      setPullDistance(0);
    };

    document.addEventListener('touchstart', onTouchStartPull, { passive: true });
    document.addEventListener('touchmove', onTouchMovePull, { passive: false });
    document.addEventListener('touchend', onTouchEndPull, { passive: true });

    return () => {
      document.removeEventListener('touchstart', onTouchStartPull);
      document.removeEventListener('touchmove', onTouchMovePull);
      document.removeEventListener('touchend', onTouchEndPull);
    };
  }, [isPulling, pullDistance, pullThreshold]);

  return {
    enableSwipeGestures,
    disableSwipeGestures,
    enableSwipeGesturesGlobal,
    handleSwipe,
    handleTap,
    handleDoubleTap,
    isPulling,
    pullDistance,
    handlePullToRefresh,
    isSwipeEnabled
  };
};
