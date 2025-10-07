import { useNavigate } from "react-router-dom";
import soulveIcon from "@/assets/soulve-icon.jpg";

interface SouLVEIconProps {
  size?: "small" | "medium" | "large" | "xlarge";
  clickable?: boolean;
}

const SouLVEIcon = ({ size = "large", clickable = false }: SouLVEIconProps) => {
  const navigate = useNavigate();
  
  // Size configurations
  const sizeConfig = {
    small: {
      dimensions: "w-10 h-10"
    },
    medium: {
      dimensions: "w-16 h-16"
    },
    large: {
      dimensions: "w-24 h-24"
    },
    xlarge: {
      dimensions: "w-32 h-32"
    }
  };

  const config = sizeConfig[size];

  const iconElement = (
    <img
      src={soulveIcon}
      alt="SouLVE Icon - Connecting Communities"
      className={`${config.dimensions} object-contain rounded-lg`}
    />
  );

  if (clickable) {
    return (
      <button 
        onClick={() => navigate("/")} 
        className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#0ce4af] focus:ring-offset-2 rounded-lg transition-transform hover:scale-105"
      >
        {iconElement}
      </button>
    );
  }

  return (
    <div className="flex items-center justify-center">
      {iconElement}
    </div>
  );
};

export default SouLVEIcon;
