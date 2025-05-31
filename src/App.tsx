
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileRegistration from "./pages/ProfileRegistration";
import CampaignBuilderPage from "./pages/CampaignBuilder";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import MobileLoadingScreen from "./components/MobileLoadingScreen";
import "./App.css";

function App() {
  const [isReady, setIsReady] = useState(!Capacitor.isNativePlatform());

  useEffect(() => {
    console.log('🎯 App component mounted');
    console.log('📍 Current location:', window.location.href);
    console.log('🗺️ Hash:', window.location.hash);
    console.log('📱 Platform:', Capacitor.getPlatform());

    if (Capacitor.isNativePlatform()) {
      // Small delay to ensure native platform is fully ready
      const timer = setTimeout(() => {
        console.log('✅ Mobile platform ready');
        setIsReady(true);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  // Show loading screen on mobile until ready
  if (!isReady) {
    return <MobileLoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile-registration" element={<ProfileRegistration />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/campaign-builder" element={
          <ProtectedRoute>
            <CampaignBuilderPage />
          </ProtectedRoute>
        } />
        <Route path="/campaign-analytics/:campaignId" element={
          <ProtectedRoute>
            <CampaignAnalyticsPage />
          </ProtectedRoute>
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
