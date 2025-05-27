
interface SouLVELogoProps {
  size?: "small" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  const isLarge = size === "large";
  
  if (isLarge) {
    return (
      <div className="flex items-center justify-center">
        <img 
          src="/lovable-uploads/53d273ee-32cd-476f-ae09-3ba4733b6611.png" 
          alt="SouLVE - Social Feed to Social Need" 
          className="h-48 w-auto"
        />
      </div>
    );
  } else {
    return (
      <div className="flex items-center space-x-2">
        <img 
          src="/lovable-uploads/25feaabf-2868-4cfc-a034-77054efffb53.png" 
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
