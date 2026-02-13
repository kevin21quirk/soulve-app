import { useNavigate } from "react-router-dom";
import soulveIcon from "@/assets/soulve-icon.png";

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
      dimensions: "w-40 h-40"
    },
    xlarge: {
      dimensions: "w-48 h-48"
    }
  };

  const config = sizeConfig[size];

  const iconElement = (
    <div className="relative">
      <img
        src={soulveIcon}
        alt="SouLVE Icon - Connecting Communities"
        className={`${config.dimensions} object-contain rounded-lg animate-[pulse_2s_ease-in-out_infinite] drop-shadow-2xl`}
        style={{
          filter: 'drop-shadow(0 0 20px rgba(12, 228, 175, 0.4))',
          animation: 'heartbeat 2s ease-in-out infinite'
        }}
      />
      <style>{`
        @keyframes heartbeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1);
          }
          75% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
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
