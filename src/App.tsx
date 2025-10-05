
import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { ErrorProvider } from "@/contexts/ErrorContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import WaitlistDashboard from "@/pages/WaitlistDashboard";
import AdminHub from "@/pages/AdminHub";
import EmailVerificationHandler from "@/components/auth/EmailVerificationHandler";
import PasswordResetHandler from "@/components/auth/PasswordResetHandler";
import ProfileRegistration from "@/pages/ProfileRegistration";
import PublicProfile from "@/pages/PublicProfile";
import CampaignBuilderPage from "@/pages/CampaignBuilder";
import EnhancedCampaignAnalyticsDashboard from "@/components/campaign-analytics/EnhancedCampaignAnalyticsDashboard";
import DonationPage from "@/pages/DonationPage";
import SafeSpaceHelperApplication from "@/pages/SafeSpaceHelperApplication";
import SafeSpaceHelperTraining from "@/pages/SafeSpaceHelperTraining";
import StakeholderRegistration from "@/pages/StakeholderRegistration";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookieConsent from "@/components/legal/CookieConsent";
import WelcomeWizard from "@/components/onboarding/WelcomeWizard";
import ProfileSettings from "@/components/profile/ProfileSettings";

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
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/register/esg-contributor/:token" element={<StakeholderRegistration />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/waitlist" element={<WaitlistDashboard />} />
            <Route path="/welcome" element={<WelcomeWizard />} />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <ProfileSettings />
                </ProtectedRoute>
              } 
            />
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
              path="/safe-space/helper/training" 
              element={
                <ProtectedRoute>
                  <SafeSpaceHelperTraining />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/*" 
              element={
                <AdminRoute>
                  <AdminHub />
                </AdminRoute>
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
          <CookieConsent />
          <Toaster />
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
