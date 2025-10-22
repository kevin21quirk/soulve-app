
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SouLVEIcon from "./SouLVEIcon";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Clickable and properly sized */}
          <div className="flex items-center">
            <SouLVEIcon size="small" clickable={true} />
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600 hidden sm:inline font-medium">
                  Welcome back!
                </span>
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={() => navigate("/register")} 
                  variant="outline"
                  className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => navigate("/register")} 
                  className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:from-[#0ce4af]/90 hover:via-[#18a5fe]/90 hover:to-[#4c3dfb]/90 text-white shadow-lg border-none"
                >
                  Join Beta
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
