import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  return (
    <div className="relative w-full h-[500px] lg:h-[600px] flex items-start justify-center">
      <img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        className="w-[400px] h-[400px] lg:w-[750px] lg:h-[750px] object-contain animate-heart-glow"
      />
    </div>
  );
};

export default AnimatedHeroVisual;
