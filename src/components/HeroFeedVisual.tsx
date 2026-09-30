import { motion } from "framer-motion";
import { Users, Handshake, Megaphone, CalendarDays, MessageCircle } from "lucide-react";
import soulveIcon from "@/assets/soulve-icon.png";

const ORBIT_DURATION = 40;

// Positions are points on the orbit circle (pentagon: 0°, 72°, 144°, 216°, 288°)
const orbitIcons = [
  { icon: Users, label: "Community", iconColor: "text-teal-600", pos: "top-0 left-1/2" },
  { icon: Handshake, label: "Help", iconColor: "text-rose-500", pos: "top-[34%] left-[98%]" },
  { icon: Megaphone, label: "Campaigns", iconColor: "text-[#0f7fd4]", pos: "top-[90%] left-[79%]" },
  { icon: CalendarDays, label: "Events", iconColor: "text-amber-500", pos: "top-[90%] left-[21%]" },
  { icon: MessageCircle, label: "Feed", iconColor: "text-[#4c3dfb]", pos: "top-[34%] left-[2%]" },
];

const HeroFeedVisual = () => {
  return (
    <div className="relative w-full max-w-xl mx-auto flex items-center justify-center min-h-[480px] lg:min-h-[620px]">
      {/* Ambient glow behind the heart */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <div className="absolute top-8 left-1/4 h-72 w-72 rounded-full bg-[#0ce4af]/25 blur-[100px]" />
        <div className="absolute bottom-4 right-0 h-80 w-80 rounded-full bg-[#18a5fe]/25 blur-[110px]" />
      </div>

      {/* Soft tinted haze behind the heart */}
      <div aria-hidden className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[340px] h-[340px] lg:w-[480px] lg:h-[480px] bg-gradient-to-br from-[#0ce4af]/15 to-[#18a5fe]/15 rounded-full blur-3xl" />
      </div>

      {/* Orbit ring with feature icons */}
      <motion.div
        aria-hidden
        className="absolute w-[400px] h-[400px] lg:w-[560px] lg:h-[560px] rounded-full border border-dashed border-[#18a5fe]/25 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
      >
        {orbitIcons.map((item) => (
          <div
            key={item.label}
            className={`absolute ${item.pos} -translate-x-1/2 -translate-y-1/2`}
          >
            {/* Counter-rotate so icons stay upright while orbiting */}
            <motion.div
              className="flex flex-col items-center gap-1"
              animate={{ rotate: -360 }}
              transition={{ duration: ORBIT_DURATION, repeat: Infinity, ease: "linear" }}
            >
              <div className="h-11 w-11 rounded-full bg-white border border-slate-200 shadow-md shadow-slate-300/50 flex items-center justify-center">
                <item.icon className={`h-5 w-5 ${item.iconColor}`} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {item.label}
              </span>
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* Big spinning heart — spins on load, flashes, then glows continuously */}
      <motion.img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        loading="eager"
        decoding="async"
        className="relative z-10 w-[340px] h-[340px] lg:w-[480px] lg:h-[480px] xl:w-[540px] xl:h-[540px] object-contain animate-heart-glow will-change-[filter]"
        initial={{ opacity: 0, scale: 0.8, rotateY: 0 }}
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

export default HeroFeedVisual;
