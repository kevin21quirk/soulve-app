
interface SouLVELogoProps {
  size?: "small" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  const isLarge = size === "large";
  
  if (isLarge) {
    return (
      <div className="flex items-center justify-center w-full">
        <img 
          src="/lovable-uploads/c062ea76-0576-4ea9-99d1-092d17f82981.png" 
          alt="SouLVE - Social Feed to Social Need" 
          className="w-full h-[32rem] object-contain"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/c062ea76-0576-4ea9-99d1-092d17f82981.png" 
          alt="SouLVE Icon" 
          className="h-8 w-8"
        />
        <div className="text-left">
          <h3 className="text-lg font-bold text-white">SouLVE</h3>
        </div>
      </div>
    );
  }
};

export default SouLVELogo;
