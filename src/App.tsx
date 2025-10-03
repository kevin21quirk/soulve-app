
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorProvider } from "@/contexts/ErrorContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import WaitlistDashboard from "@/pages/WaitlistDashboard";
import EmailVerificationHandler from "@/components/auth/EmailVerificationHandler";
import PasswordResetHandler from "@/components/auth/PasswordResetHandler";
import ProfileRegistration from "@/pages/ProfileRegistration";
import PublicProfile from "@/pages/PublicProfile";
import CampaignBuilderPage from "@/pages/CampaignBuilder";
import EnhancedCampaignAnalyticsDashboard from "@/components/campaign-analytics/EnhancedCampaignAnalyticsDashboard";
import DonationPage from "@/pages/DonationPage";
import SafeSpaceHelperApplication from "@/pages/SafeSpaceHelperApplication";

function App() {
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<EmailVerificationHandler />} />
            <Route path="/reset-password" element={<PasswordResetHandler />} />
            <Route path="/profile-registration" element={<ProfileRegistration />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/waitlist" element={<WaitlistDashboard />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/campaign-builder" 
              element={
                <ProtectedRoute>
                  <CampaignBuilderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/campaigns/:campaignId/analytics" 
              element={
                <ProtectedRoute>
                  <EnhancedCampaignAnalyticsDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/donate" 
              element={
                <ProtectedRoute>
                  <DonationPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/safe-space/helper/apply" 
              element={
                <ProtectedRoute>
                  <SafeSpaceHelperApplication />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Toaster />
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
