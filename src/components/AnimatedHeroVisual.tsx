import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-start justify-center pt-4">
      <img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        className="w-[400px] h-[400px] lg:w-[650px] lg:h-[650px] object-contain animate-heart-glow"
      />
    </div>
  );
};

export default AnimatedHeroVisual;
