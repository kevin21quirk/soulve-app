
import { Button } from "@/components/ui/button";
import { Heart, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SouLVELogo from "./SouLVELogo";

const HeroSection = () => {
  const navigate = useNavigate();

  const handleTryDemo = () => {
    navigate("/dashboard");
  };

  const handleBecomeSoulver = () => {
    navigate("/auth");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-teal-600 via-cyan-600 to-blue-600 text-white min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center animate-fade-in">
          <div className="flex justify-center items-center mb-8">
            <SouLVELogo size="large" />
          </div>
          
          <div className="max-w-5xl mx-auto space-y-8">
            <p className="text-2xl md:text-3xl lg:text-4xl font-light leading-relaxed">
              The social media platform that bridges the human gap AI cannot reach
            </p>
            <p className="text-lg md:text-xl max-w-4xl mx-auto text-cyan-100 leading-relaxed">
              Connect people who need help with those who can provide it. Build trust, track impact, and transform your community one connection at a time.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-12">
            <Button 
              size="lg" 
              className="bg-white text-teal-600 hover:bg-teal-50 transform hover:scale-105 transition-all duration-300 text-lg px-10 py-5 font-semibold shadow-xl rounded-xl"
              onClick={handleTryDemo}
            >
              <Heart className="mr-3 h-6 w-6" />
              Try SouLVE Demo
            </Button>
            <Button 
              size="lg" 
              className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-teal-600 transform hover:scale-105 transition-all duration-300 text-lg px-10 py-5 font-semibold shadow-xl rounded-xl"
              onClick={handleBecomeSoulver}
            >
              <Users className="mr-3 h-6 w-6" />
              Become a Soulver
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
