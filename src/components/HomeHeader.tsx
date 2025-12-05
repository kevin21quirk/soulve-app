import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import soulveIcon from "@/assets/soulve-icon.png";

const HomeHeader = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <header className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-muted rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Enhanced with animation */}
          <motion.button 
            onClick={() => navigate("/")} 
            className="flex items-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Subtle glow behind logo */}
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img
                src={soulveIcon}
                alt="SouLVE - Connecting Communities"
                className="w-12 h-12 object-contain relative z-10 drop-shadow-md"
              />
            </motion.div>
          </motion.button>

          {/* Auth Section */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground hidden sm:inline font-medium">
                  Welcome back!
                </span>
                <Button 
                  onClick={() => navigate("/dashboard")} 
                  className="bg-gradient-to-r from-primary via-secondary to-[hsl(var(--soulve-purple))] hover:opacity-90 text-primary-foreground shadow-lg border-none"
                >
                  Dashboard
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button 
                  onClick={() => { window.location.hash = "#/auth"; }} 
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Sign In
                </Button>
                <Button 
                  onClick={() => { window.location.hash = "#/auth"; }} 
                  className="bg-gradient-to-r from-primary via-secondary to-[hsl(var(--soulve-purple))] hover:opacity-90 text-primary-foreground shadow-lg border-none"
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
