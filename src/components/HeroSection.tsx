
import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SouLVELogo from "./SouLVELogo";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleTryDemo = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  const handleBecomeSoulver = () => {
    navigate("/auth");
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect.
                <br />
                <span className="text-cyan-200">Support.</span>
                <br />
                Transform.
              </h1>
              
              <p className="text-xl md:text-2xl text-cyan-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                The community platform where help meets hope. Connect with people who need support and those ready to provide it.
              </p>
            </div>
            
            {/* CTA Buttons - Prominently Placed */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-[#18a5fe] hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold shadow-xl rounded-xl group border-none"
                onClick={handleTryDemo}
              >
                <Heart className="mr-3 h-6 w-6" />
                Try SouLVE Demo
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#18a5fe] transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold shadow-xl rounded-xl"
                onClick={handleBecomeSoulver}
              >
                <Users className="mr-3 h-6 w-6" />
                Become a Soulver
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-cyan-100">Verified Community</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-cyan-100">Safe & Secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-cyan-100">Real Impact</span>
              </div>
            </div>
          </div>
          
          {/* Right Column - Logo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute inset-0 bg-white/10 rounded-3xl blur-3xl"></div>
              <div className="relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <SouLVELogo size="medium" />
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
    </div>
  );
};

export default HeroSection;
