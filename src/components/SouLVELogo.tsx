
import { useNavigate } from "react-router-dom";
import soulveLogo from "@/assets/soulve-logo.png";

interface SouLVELogoProps {
  size?: "small" | "medium" | "large" | "xlarge" | "header";
  clickable?: boolean;
}

const SouLVELogo = ({ size = "large", clickable = false }: SouLVELogoProps) => {
  const navigate = useNavigate();
  
  // Size configurations
  const sizeConfig = {
    small: {
      width: "w-32",
      height: "h-16"
    },
    medium: {
      width: "w-48",
      height: "h-24"
    },
    large: {
      width: "w-64",
      height: "h-32"
    },
    xlarge: {
      width: "w-96",
      height: "h-48"
    },
    header: {
      width: "w-auto",
      height: "h-20"
    }
  };

  const config = sizeConfig[size];

  const logoElement = (
    <img
      src={soulveLogo}
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
