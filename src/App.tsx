import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryProvider } from "./contexts/QueryContext";
import Dashboard from "./pages/Dashboard";
import LandingPage from "./pages/LandingPage";
import ProfilePage from "./pages/ProfilePage";
import MobileLoadingScreen from "./components/MobileLoadingScreen";
import MobileNavigation from "./components/mobile/MobileNavigation";
import MobileFeed from "./components/mobile/MobileFeed";
import MobileDiscover from "./components/mobile/MobileDiscover";
import MobileActivity from "./components/mobile/MobileActivity";
import MobileAnalytics from "./components/mobile/MobileAnalytics";
import MobileMessages from "./components/mobile/messaging/MobileMessages";
import MobileProfile from "./components/mobile/MobileProfile";
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
      case "messaging":
        return <MobileMessages />;
      case "notifications":
        return <MobileActivity />;
      case "impact":
        return <MobileAnalytics />;
      case "points":
        return <MobileAnalytics />;
      case "profile":
        return <MobileProfile />;
      default:
        return <MobileFeed />;
    }
  };

  return (
    <MobileGestureProvider>
      <BrowserRouter>
        <AuthProvider>
          <QueryProvider>
            <div className="min-h-screen bg-white">
              <Toaster />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
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
          </QueryProvider>
        </AuthProvider>
      </BrowserRouter>
    </MobileGestureProvider>
  );
}

export default App;
