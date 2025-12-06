import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  return (
    <div className="relative -mt-56">
      {/* Subtle white haze behind heart */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[300px] h-[300px] lg:w-[550px] lg:h-[550px] bg-white/25 rounded-full blur-3xl" />
      </div>
      
      <img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        className="relative z-10 w-[400px] h-[400px] lg:w-[750px] lg:h-[750px] object-contain animate-heart-glow"
      />
    </div>
  );
};

export default AnimatedHeroVisual;
