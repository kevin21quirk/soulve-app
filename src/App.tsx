
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import ProfileRegistration from "./pages/ProfileRegistration";
import Index from "./pages/Index";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLoadingScreen from "./components/MobileLoadingScreen";
import MobileNavigation from "./components/mobile/MobileNavigation";
import MobileFeed from "./components/mobile/MobileFeed";
import MobileDiscover from "./components/mobile/MobileDiscover";
import MobileActivity from "./components/mobile/MobileActivity";
import MobileAnalytics from "./components/mobile/MobileAnalytics";
import MobileInstallPrompt from "@/components/mobile/MobileInstallPrompt";
import { MobileGestureProvider } from "@/components/mobile/MobileGestureProvider";

function App() {
  const [activeTab, setActiveTab] = React.useState("feed");
  const [isLoading, setIsLoading] = React.useState(false);

  // Only show loading for mobile route
  React.useEffect(() => {
    if (window.location.pathname === '/mobile') {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, []);

  const renderMobileContent = () => {
    switch (activeTab) {
      case "feed":
        return <MobileFeed />;
      case "discover":
        return <MobileDiscover />;
      case "notifications":
        return <MobileActivity />;
      case "impact":
        return <MobileAnalytics />;
      case "points":
        return <MobileAnalytics />;
      default:
        return <MobileFeed />;
    }
  };

  return (
    <MobileGestureProvider>
      <AuthProvider>
        <div className="min-h-screen bg-white">
          <Toaster />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/profile-registration" element={<ProfileRegistration />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route
              path="/mobile"
              element={
                isLoading ? (
                  <MobileLoadingScreen />
                ) : (
                  <>
                    {renderMobileContent()}
                    <MobileNavigation
                      activeTab={activeTab}
                      onTabChange={setActiveTab}
                    />
                  </>
                )
              }
            />
          </Routes>
          
          {/* Mobile Install Prompt */}
          <MobileInstallPrompt />
        </div>
      </AuthProvider>
    </MobileGestureProvider>
  );
}

export default App;
