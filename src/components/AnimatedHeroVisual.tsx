import soulveIcon from "@/assets/soulve-icon.png";

const AnimatedHeroVisual = () => {
  return (
    <div className="relative -mt-32">
      <img
        src={soulveIcon}
        alt="SouLVE - Connecting Communities"
        className="w-[400px] h-[400px] lg:w-[750px] lg:h-[750px] object-contain animate-heart-glow"
      />
    </div>
  );
};

export default AnimatedHeroVisual;
