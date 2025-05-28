
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
          className="w-full h-[32rem] object-contain"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
          alt="SouLVE Icon" 
          className="h-24 w-24"
        />
      </div>
    );
  }
};

export default SouLVELogo;
