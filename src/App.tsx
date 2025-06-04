
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Index from "./pages/Index";
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
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  }, []);

  if (isLoading) {
    return <MobileLoadingScreen />;
  }

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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route
              path="/mobile"
              element={
                <>
                  {renderMobileContent()}
                  <MobileNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                  />
                </>
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
