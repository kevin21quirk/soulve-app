
interface SouLVELogoProps {
  size?: "small" | "medium" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  if (size === "large") {
    return (
      <div className="flex items-center justify-center w-full">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
          alt="SouLVE - Social Feed to Social Need" 
          className="w-full h-[32rem] object-contain"
        />
      </div>
    );
  } else if (size === "medium") {
    return (
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
          alt="SouLVE - Social Feed to Social Need" 
          className="w-80 h-60 object-contain"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <img 
          src="/lovable-uploads/dd4b8f10-f8cb-4ecb-9968-65b10d0d485a.png" 
          alt="SouLVE Icon" 
          className="w-full h-full object-contain"
        />
      </div>
    );
  }
};

export default SouLVELogo;
