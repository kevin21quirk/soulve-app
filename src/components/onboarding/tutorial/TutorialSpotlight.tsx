import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface TutorialSpotlightProps {
  targetSelector: string;
}

export function TutorialSpotlight({ targetSelector }: TutorialSpotlightProps) {
  const [position, setPosition] = useState<DOMRect | null>(null);

  useEffect(() => {
    const updatePosition = () => {
      const element = document.querySelector(targetSelector);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition(rect);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetSelector]);

  if (!position) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-[100] pointer-events-none"
      style={{
        top: position.top - 8,
        left: position.left - 8,
        width: position.width + 16,
        height: position.height + 16,
      }}
    >
      {/* Glowing border */}
      <div className="absolute inset-0 rounded-lg border-2 border-primary shadow-[0_0_20px_rgba(var(--primary),0.5)] animate-pulse" />
      
      {/* Clear window */}
      <div 
        className="absolute inset-0 rounded-lg bg-background/5 backdrop-blur-[1px]"
        style={{ 
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.7)'
        }}
      />
    </motion.div>
  );
}
