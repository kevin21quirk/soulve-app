
interface HapticFeedbackProps {
  children: React.ReactNode;
  type?: 'light' | 'medium' | 'heavy';
  onTap?: () => void;
}

const MobileHapticFeedback = ({ 
  children, 
  type = 'light', 
  onTap 
}: HapticFeedbackProps) => {
  const triggerHaptic = () => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30]
      };
      navigator.vibrate(patterns[type]);
    }
    
    onTap?.();
  };

  return (
    <div 
      onClick={triggerHaptic}
      className="touch-manipulation select-none"
    >
      {children}
    </div>
  );
};

export default MobileHapticFeedback;
