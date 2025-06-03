
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import SouLVELogo from "./SouLVELogo";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10">
              <SouLVELogo size="small" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
              SouLVE
            </h1>
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
                  className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => navigate("/auth")} 
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-50"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default HomeHeader;
