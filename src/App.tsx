import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import ProfileRegistration from "./pages/ProfileRegistration";
import CampaignBuilderPage from "./pages/CampaignBuilder";
import CampaignAnalyticsPage from "./pages/CampaignAnalyticsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
