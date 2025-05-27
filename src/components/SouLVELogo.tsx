
interface SouLVELogoProps {
  size?: "small" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  const isLarge = size === "large";
  
  if (isLarge) {
    return (
      <div className="flex items-center justify-center w-full">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
          alt="SouLVE - Social Feed to Social Need" 
          className="w-full max-w-7xl h-80 object-contain"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
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
