
interface SouLVELogoProps {
  size?: "small" | "medium" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  // Size configurations
  const sizeConfig = {
    small: {
      width: "w-24",
      height: "h-12"
    },
    medium: {
      width: "w-32",
      height: "h-16"
    },
    large: {
      width: "w-48",
      height: "h-24"
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center justify-center w-full">
      <img
        src="/lovable-uploads/4f432fd5-5311-4750-a629-270c1963069d.png"
        alt="SouLVE Logo - Social Feed to Social Need"
        className={`${config.width} ${config.height} object-contain`}
      />
    </div>
  );
};

export default SouLVELogo;
