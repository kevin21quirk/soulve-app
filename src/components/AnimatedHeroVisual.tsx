import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  return (
    <div className="relative w-full h-[600px] lg:h-[700px] flex items-start justify-center">
      <img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        className="w-96 h-96 lg:w-[500px] lg:h-[500px] object-contain animate-heart-glow"
      />
    </div>
  );
};

export default AnimatedHeroVisual;
