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
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-start justify-center">
      {/* Orbiting icons container */}
      <motion.div
        className="absolute w-[450px] h-[450px] lg:w-[600px] lg:h-[600px]"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
      {floatingIcons.map(({ Icon, color, delay }, index) => {
          const angle = (index / floatingIcons.length) * 360;
          const radius = 280;
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

      {/* Central logo - FIXED position, warming pulse via drop-shadow */}
      <div className="relative z-10">
        <motion.img
          src={soulveIcon}
          alt="SouLVE - Connecting Communities"
          className="w-96 h-96 lg:w-[500px] lg:h-[500px] object-contain"
          animate={{
            filter: [
              'drop-shadow(0 0 20px rgba(52, 211, 153, 0.3)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.2)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15))',
              'drop-shadow(0 0 60px rgba(52, 211, 153, 0.9)) drop-shadow(0 0 100px rgba(34, 211, 238, 0.7)) drop-shadow(0 0 140px rgba(59, 130, 246, 0.6))',
              'drop-shadow(0 0 20px rgba(52, 211, 153, 0.3)) drop-shadow(0 0 40px rgba(34, 211, 238, 0.2)) drop-shadow(0 0 60px rgba(59, 130, 246, 0.15))'
            ]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          whileHover={{ 
            scale: 1.05,
            rotate: [0, -3, 3, 0]
          }}
        />
      </div>

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
