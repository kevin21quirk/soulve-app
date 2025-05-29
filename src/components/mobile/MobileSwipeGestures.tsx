
import { useTouchGestures } from "@/components/ui/mobile/touch-gestures";

interface SwipeGesturesProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  className?: string;
}

const MobileSwipeGestures = ({
  children,
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  className = ""
}: SwipeGesturesProps) => {
  const { onTouchStart, onTouchMove, onTouchEnd } = useTouchGestures();

  const handleTouchEnd = () => {
    const swipeResult = onTouchEnd();
    if (!swipeResult) return;

    if (swipeResult.isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (swipeResult.isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
    if (swipeResult.isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
    if (swipeResult.isDownSwipe && onSwipeDown) {
      onSwipeDown();
    }
  };

  return (
    <div
      className={className}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {children}
    </div>
  );
};

export default MobileSwipeGestures;
