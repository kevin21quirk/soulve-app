import { motion } from "framer-motion";
import { Heart, Users, Target, Sparkles, Globe, HandHeart } from "lucide-react";
import soulveIcon from "@/assets/soulve-icon.png";

const floatingIcons = [
  { Icon: Heart, color: "text-rose-300", delay: 0 },
  { Icon: Users, color: "text-cyan-300", delay: 0.5 },
  { Icon: Target, color: "text-amber-300", delay: 1 },
  { Icon: Sparkles, color: "text-purple-300", delay: 1.5 },
  { Icon: Globe, color: "text-emerald-300", delay: 2 },
  { Icon: HandHeart, color: "text-pink-300", delay: 2.5 },
];

const AnimatedHeroVisual = () => {
  return (
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-center justify-center">
      {/* Outer pulsing ring */}
      <motion.div
        className="absolute w-80 h-80 lg:w-96 lg:h-96 rounded-full bg-gradient-to-r from-white/10 to-white/5"
        animate={{ 
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.1, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Middle pulsing ring */}
      <motion.div
        className="absolute w-64 h-64 lg:w-80 lg:h-80 rounded-full bg-gradient-to-r from-white/15 to-white/5"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.15, 0.4]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
        }}
      />
      
      {/* Inner glowing ring */}
      <motion.div
        className="absolute w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-white/20 to-white/10 blur-sm"
        animate={{ 
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.25, 0.5]
        }}
        transition={{ 
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Orbiting icons container */}
      <motion.div
        className="absolute w-72 h-72 lg:w-96 lg:h-96"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {floatingIcons.map(({ Icon, color, delay }, index) => {
          const angle = (index / floatingIcons.length) * 360;
          const radius = 140; // Distance from center
          const x = Math.cos((angle * Math.PI) / 180) * radius;
          const y = Math.sin((angle * Math.PI) / 180) * radius;
          
          return (
            <motion.div
              key={index}
              className="absolute left-1/2 top-1/2"
              style={{ 
                transform: `translate(${x - 16}px, ${y - 16}px)`
              }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.7, 1, 0.7]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay,
                ease: "easeInOut"
              }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ 
                  duration: 30,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className={`p-2 lg:p-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 ${color}`}
              >
                <Icon className="h-5 w-5 lg:h-6 lg:w-6" />
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Central logo with floating animation */}
      <motion.div
        className="relative z-10"
        animate={{ 
          y: [0, -12, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Glow effect behind logo */}
        <motion.div
          className="absolute inset-0 blur-2xl bg-white/30 rounded-full scale-110"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1.1, 1.2, 1.1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.img
          src={soulveIcon}
          alt="SouLVE - Connecting Communities"
          className="w-32 h-32 lg:w-44 lg:h-44 object-contain relative z-10 drop-shadow-2xl"
          whileHover={{ 
            scale: 1.08,
            rotate: [0, -5, 5, 0]
          }}
          transition={{ duration: 0.4 }}
        />
      </motion.div>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/30"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedHeroVisual;
