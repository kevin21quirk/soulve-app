import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    setAnimationKey(prev => prev + 1);
  }, []);

  return (
    <div className="relative -mt-56">
      {/* Subtle white haze behind heart - reduced blur for better performance */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] lg:w-[550px] lg:h-[550px] bg-white/25 rounded-full blur-2xl" />
      </div>
      
      <motion.img
        key={animationKey}
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        loading="eager"
        decoding="async"
        className="relative z-10 w-[400px] h-[400px] lg:w-[750px] lg:h-[750px] object-contain animate-heart-glow will-change-[filter]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 1, 1, 1],
          scale: [0.8, 1, 1, 1.2, 1, 1],
          rotateY: [0, 360, 720, 720, 720, 720],
          filter: [
            "brightness(1)",
            "brightness(1)",
            "brightness(1)",
            "brightness(2)",
            "brightness(1)",
            "brightness(1)"
          ]
        }}
        transition={{
          duration: 5,
          times: [0, 0.2, 0.5, 0.6, 0.7, 1],
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

export default AnimatedHeroVisual;
