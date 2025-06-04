
import React, { createContext, useContext, useCallback } from 'react';
import { useMobileGestures } from '@/hooks/useMobileGestures';

interface MobileGestureContextType {
  enableSwipeGestures: (element: HTMLElement) => () => void;
  handleSwipe: (gesture: any) => void;
  handleTap: (gesture: any) => void;
  handleDoubleTap: (gesture: any) => void;
}

const MobileGestureContext = createContext<MobileGestureContextType | undefined>(undefined);

export const useMobileGestureContext = () => {
  const context = useContext(MobileGestureContext);
  if (!context) {
    throw new Error('useMobileGestureContext must be used within MobileGestureProvider');
  }
  return context;
};

interface MobileGestureProviderProps {
  children: React.ReactNode;
  onSwipe?: (direction: string, element: HTMLElement) => void;
  onTap?: (element: HTMLElement) => void;
  onDoubleTap?: (element: HTMLElement) => void;
}

export const MobileGestureProvider = ({ 
  children, 
  onSwipe, 
  onTap, 
  onDoubleTap 
}: MobileGestureProviderProps) => {
  const gestures = useMobileGestures();

  const enableSwipeGestures = useCallback((element: HTMLElement) => {
    const handleTouchStart = (e: TouchEvent) => gestures.onTouchStart?.(e);
    const handleTouchMove = (e: TouchEvent) => gestures.onTouchMove?.(e);
    const handleTouchEnd = (e: TouchEvent) => {
      const result = gestures.onTouchEnd?.(e);
      if (result && onSwipe) {
        if (result.direction === 'left') onSwipe('left', element);
        if (result.direction === 'right') onSwipe('right', element);
        if (result.direction === 'up') onSwipe('up', element);
        if (result.direction === 'down') onSwipe('down', element);
      }
    };

    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchmove', handleTouchMove, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gestures, onSwipe]);

  const handleSwipe = useCallback((gesture: any) => {
    console.log('Swipe gesture:', gesture);
  }, []);

  const handleTap = useCallback((gesture: any) => {
    if (onTap) onTap(gesture.element);
  }, [onTap]);

  const handleDoubleTap = useCallback((gesture: any) => {
    if (onDoubleTap) onDoubleTap(gesture.element);
  }, [onDoubleTap]);

  return (
    <MobileGestureContext.Provider
      value={{
        enableSwipeGestures,
        handleSwipe,
        handleTap,
        handleDoubleTap,
      }}
    >
      {children}
    </MobileGestureContext.Provider>
  );
};
