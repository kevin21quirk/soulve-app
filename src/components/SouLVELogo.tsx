
interface SouLVELogoProps {
  size?: "small" | "medium" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  // Size configurations based on your brand requirements
  const sizeConfig = {
    small: {
      heartSize: "w-8 h-8",
      textSize: "text-lg",
      taglineSize: "text-xs",
      spacing: "space-x-2",
      containerSpacing: "space-y-1"
    },
    medium: {
      heartSize: "w-12 h-12",
      textSize: "text-2xl",
      taglineSize: "text-sm",
      spacing: "space-x-3",
      containerSpacing: "space-y-2"
    },
    large: {
      heartSize: "w-16 h-16",
      textSize: "text-4xl",
      taglineSize: "text-sm",
      spacing: "space-x-4",
      containerSpacing: "space-y-2"
    }
  };

  const config = sizeConfig[size];

  return (
    <div className="flex items-center justify-center w-full">
      <div className={`flex flex-col items-center ${config.containerSpacing}`}>
        {/* Main Logo Row - Heart + Text */}
        <div className={`flex items-center ${config.spacing}`}>
          {/* Simple Heart Icon matching your brand */}
          <div className={`${config.heartSize} flex-shrink-0`}>
            <svg viewBox="0 0 24 24" className="w-full h-full">
              <defs>
                <linearGradient id={`heartGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ce4af" />
                  <stop offset="50%" stopColor="#18a5fe" />
                  <stop offset="100%" stopColor="#4c3dfb" />
                </linearGradient>
              </defs>
              {/* Clean, simple heart shape matching your brand */}
              <path 
                d="M12,21.35l-1.45-1.32C5.4,15.36,2,12.28,2,8.5 C2,5.42,4.42,3,7.5,3c1.74,0,3.41,0.81,4.5,2.09C13.09,3.81,14.76,3,16.5,3 C19.58,3,22,5.42,22,8.5c0,3.78-3.4,6.86-8.55,11.54L12,21.35z" 
                fill={`url(#heartGradient-${size})`}
                className="drop-shadow-sm"
              />
            </svg>
          </div>

          {/* SouLVE Text */}
          <div className={`${config.textSize} font-bold`}>
            <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
              SouLVE
            </span>
          </div>
        </div>

        {/* Tagline */}
        <div className={`${config.taglineSize} font-medium tracking-wider text-center`}>
          <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
            SOCIAL FEED TO SOCIAL NEED
          </span>
        </div>
      </div>
    </div>
  );
};

export default SouLVELogo;
