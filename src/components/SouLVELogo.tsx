
interface SouLVELogoProps {
  size?: "small" | "medium" | "large";
}

const SouLVELogo = ({ size = "large" }: SouLVELogoProps) => {
  if (size === "large") {
    return (
      <div className="flex items-center justify-center w-full">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="heartGradient-large" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ce4af" />
                    <stop offset="50%" stopColor="#18a5fe" />
                    <stop offset="100%" stopColor="#4c3dfb" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50,20 C35,5 15,15 15,35 C15,55 50,85 50,85 C50,85 85,55 85,35 C85,15 65,5 50,20 Z" 
                  fill="url(#heartGradient-large)"
                  className="drop-shadow-lg"
                />
                <path 
                  d="M30,30 C35,25 45,25 50,35 C55,25 65,25 70,30 C65,35 55,40 50,45 C45,40 35,35 30,30" 
                  fill="white" 
                  opacity="0.4"
                />
              </svg>
            </div>
            <div className="text-4xl font-bold">
              <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
                SouLVE
              </span>
            </div>
          </div>
          <div className="text-sm font-medium tracking-wider">
            <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
              SOCIAL FEED TO SOCIAL NEED
            </span>
          </div>
        </div>
      </div>
    );
  } else if (size === "medium") {
    return (
      <div className="flex items-center justify-center">
        <div className="flex flex-col items-center space-y-2">
          <div className="flex items-center space-x-3">
            <div className="relative w-12 h-12">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <defs>
                  <linearGradient id="heartGradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ce4af" />
                    <stop offset="50%" stopColor="#18a5fe" />
                    <stop offset="100%" stopColor="#4c3dfb" />
                  </linearGradient>
                </defs>
                <path 
                  d="M50,20 C35,5 15,15 15,35 C15,55 50,85 50,85 C50,85 85,55 85,35 C85,15 65,5 50,20 Z" 
                  fill="url(#heartGradient-medium)"
                  className="drop-shadow-lg"
                />
                <path 
                  d="M30,30 C35,25 45,25 50,35 C55,25 65,25 70,30 C65,35 55,40 50,45 C45,40 35,35 30,30" 
                  fill="white" 
                  opacity="0.4"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">
              <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
                SouLVE
              </span>
            </div>
          </div>
          <div className="text-xs font-medium tracking-wider">
            <span className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
              SOCIAL FEED TO SOCIAL NEED
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
            d="M50,20 C35,5 15,15 15,35 C15,55 50,85 50,85 C50,85 85,55 85,35 C85,15 65,5 50,20 Z" 
            fill="url(#heartGradient-small)"
            className="drop-shadow-sm"
          />
          <path 
            d="M30,30 C35,25 45,25 50,35 C55,25 65,25 70,30 C65,35 55,40 50,45 C45,40 35,35 30,30" 
            fill="white" 
            opacity="0.4"
          />
        </svg>
      </div>
    );
  }
};

export default SouLVELogo;
