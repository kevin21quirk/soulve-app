
interface SouLVELogoProps {
  size?: "small" | "medium" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  if (size === "large") {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center space-x-4">
          <div className="relative w-20 h-20">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="heartGradient-large" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ce4af" />
                  <stop offset="50%" stopColor="#18a5fe" />
                  <stop offset="100%" stopColor="#4c3dfb" />
                </linearGradient>
              </defs>
              <path 
                d="M50,85 C50,85 20,65 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,65 50,85 50,85 Z" 
                fill="url(#heartGradient-large)"
                className="drop-shadow-lg"
              />
              <path 
                d="M35,35 Q50,25 65,35 Q50,45 35,35" 
                fill="white" 
                opacity="0.3"
              />
            </svg>
          </div>
          <div className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
              SouLVE
            </span>
          </div>
        </div>
      </div>
    );
  } else if (size === "medium") {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <defs>
                <linearGradient id="heartGradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0ce4af" />
                  <stop offset="50%" stopColor="#18a5fe" />
                  <stop offset="100%" stopColor="#4c3dfb" />
                </linearGradient>
              </defs>
              <path 
                d="M50,85 C50,85 20,65 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,65 50,85 50,85 Z" 
                fill="url(#heartGradient-medium)"
                className="drop-shadow-lg"
              />
              <path 
                d="M35,35 Q50,25 65,35 Q50,45 35,35" 
                fill="white" 
                opacity="0.3"
              />
            </svg>
          </div>
          <div className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
              SouLVE
            </span>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center w-10 h-10">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id="heartGradient-small" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0ce4af" />
              <stop offset="50%" stopColor="#18a5fe" />
              <stop offset="100%" stopColor="#4c3dfb" />
            </linearGradient>
          </defs>
          <path 
            d="M50,85 C50,85 20,65 20,40 C20,25 30,15 45,15 C47,15 50,20 50,20 C50,20 53,15 55,15 C70,15 80,25 80,40 C80,65 50,85 50,85 Z" 
            fill="url(#heartGradient-small)"
            className="drop-shadow-sm"
          />
          <path 
            d="M35,35 Q50,25 65,35 Q50,45 35,35" 
            fill="white" 
            opacity="0.3"
          />
        </svg>
      </div>
    );
  }
};

export default SouLVELogo;
