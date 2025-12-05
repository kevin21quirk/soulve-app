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
    <div className="relative w-full h-[500px] lg:h-[650px] flex items-start justify-center pt-4">
      {/* Orbiting icons container */}
      <motion.div
        className="absolute w-[450px] h-[450px] lg:w-[600px] lg:h-[600px] top-4"
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 30,
          repeat: Infinity,
          ease: "linear"
        }}
      >
      {floatingIcons.map(({ Icon, color, delay }, index) => {
          const angle = (index / floatingIcons.length) * 360;
          const radius = 280; // Distance from center - increased for larger icon
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

      {/* Central logo with gradient-matching pulsing glow */}
      <motion.div
        className="relative z-10 mt-4"
        animate={{ 
          y: [0, -10, 0],
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {/* Outer emerald glow - top of heart */}
        <motion.div
          className="absolute inset-[-50%] blur-3xl rounded-full"
          style={{ 
            background: 'radial-gradient(ellipse at 50% 30%, rgba(52, 211, 153, 0.5) 0%, transparent 60%)'
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Cyan glow - middle */}
        <motion.div
          className="absolute inset-[-45%] blur-2xl rounded-full"
          style={{ 
            background: 'radial-gradient(ellipse at 50% 50%, rgba(34, 211, 238, 0.45) 0%, transparent 55%)'
          }}
          animate={{ 
            opacity: [0.35, 0.65, 0.35],
            scale: [1, 1.15, 1]
          }}
          transition={{ 
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3
          }}
        />
        
        {/* Blue glow - bottom */}
        <motion.div
          className="absolute inset-[-50%] blur-3xl rounded-full"
          style={{ 
            background: 'radial-gradient(ellipse at 50% 70%, rgba(59, 130, 246, 0.5) 0%, transparent 60%)'
          }}
          animate={{ 
            opacity: [0.4, 0.7, 0.4],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 3.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        />
        
        <motion.img
          src={soulveIcon}
          alt="SouLVE - Connecting Communities"
          className="w-96 h-96 lg:w-[500px] lg:h-[500px] object-contain relative z-10"
          animate={{
            filter: [
              'drop-shadow(0 0 25px rgba(52, 211, 153, 0.5)) drop-shadow(0 0 50px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 75px rgba(59, 130, 246, 0.3))',
              'drop-shadow(0 0 50px rgba(52, 211, 153, 0.8)) drop-shadow(0 0 90px rgba(34, 211, 238, 0.6)) drop-shadow(0 0 120px rgba(59, 130, 246, 0.5))',
              'drop-shadow(0 0 25px rgba(52, 211, 153, 0.5)) drop-shadow(0 0 50px rgba(34, 211, 238, 0.4)) drop-shadow(0 0 75px rgba(59, 130, 246, 0.3))'
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
