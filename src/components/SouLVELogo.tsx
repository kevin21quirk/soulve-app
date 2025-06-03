
import { useNavigate } from "react-router-dom";

interface SouLVELogoProps {
  size?: "small" | "medium" | "large" | "header";
  clickable?: boolean;
}

const SouLVELogo = ({ size = "large", clickable = false }: SouLVELogoProps) => {
  const navigate = useNavigate();
  
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
    },
    header: {
      width: "w-auto",
      height: "h-14"
    }
  };

  const config = sizeConfig[size];

  const logoElement = (
    <img
      src="/lovable-uploads/605436fd-d9bb-4b60-9785-44f3332c9fd6.png"
      alt="SouLVE Logo - Social Feed to Social Need"
      className={`${config.width} ${config.height} object-contain`}
    />
  );

  if (clickable) {
    return (
      <button 
        onClick={() => navigate("/")} 
        className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0ce4af] focus:ring-offset-2 rounded-lg transition-transform hover:scale-105"
      >
        {logoElement}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      {logoElement}
    </div>
  );
};

export default SouLVELogo;
