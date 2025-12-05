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
    <div className="relative w-full h-[400px] lg:h-[500px] flex items-start justify-center pt-4">
      {/* Orbiting icons container */}
      <motion.div
        className="absolute w-80 h-80 lg:w-[420px] lg:h-[420px] top-8"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {floatingIcons.map(({ Icon, color, delay }, index) => {
          const angle = (index / floatingIcons.length) * 360;
          const radius = 170; // Distance from center - increased for larger icon
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

      {/* Central logo with pulsing glow emanating from icon */}
      <motion.div
        className="relative z-10 mt-8"
        animate={{ 
          y: [0, -12, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Outer pulsing glow - radiates from icon */}
        <motion.div
          className="absolute inset-[-40%] blur-3xl bg-cyan-300/20 rounded-full"
          animate={{ 
            opacity: [0.2, 0.5, 0.2],
            scale: [1, 1.4, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Middle pulsing glow */}
        <motion.div
          className="absolute inset-[-20%] blur-2xl bg-white/30 rounded-full"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.25, 1]
          }}
          transition={{ 
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        
        {/* Inner glow - close to icon */}
        <motion.div
          className="absolute inset-0 blur-xl bg-white/40 rounded-full scale-110"
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1.1, 1.2, 1.1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.img
          src={soulveIcon}
          alt="SouLVE - Connecting Communities"
          className="w-48 h-48 lg:w-64 lg:h-64 object-contain relative z-10 drop-shadow-2xl"
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
