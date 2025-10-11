
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/AuthContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { ErrorProvider } from "@/contexts/ErrorContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import { LoadingState } from "@/components/ui/loading-state";
import { addSkipLink } from "@/utils/accessibility";
import CookieConsent from "@/components/legal/CookieConsent";
import { FloatingFeedbackButton } from "@/components/feedback/FloatingFeedbackButton";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

// Lazy load route components for better performance
const Index = lazy(() => import("@/pages/Index"));
const Auth = lazy(() => import("@/pages/Auth"));
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const WaitlistDashboard = lazy(() => import("@/pages/WaitlistDashboard"));
const AdminHub = lazy(() => import("@/pages/AdminHub"));
const EmailVerificationHandler = lazy(() => import("@/components/auth/EmailVerificationHandler"));
const PasswordResetHandler = lazy(() => import("@/components/auth/PasswordResetHandler"));
const ProfileRegistration = lazy(() => import("@/pages/ProfileRegistration"));
const PublicProfile = lazy(() => import("@/pages/PublicProfile"));
const CampaignBuilderPage = lazy(() => import("@/pages/CampaignBuilder"));
const EnhancedCampaignAnalyticsDashboard = lazy(() => import("@/components/campaign-analytics/EnhancedCampaignAnalyticsDashboard"));
const DonationPage = lazy(() => import("@/pages/DonationPage"));
const SafeSpaceHelperApplication = lazy(() => import("@/pages/SafeSpaceHelperApplication"));
const SafeSpaceHelperTraining = lazy(() => import("@/pages/SafeSpaceHelperTraining"));
const StakeholderRegistration = lazy(() => import("@/pages/StakeholderRegistration"));
const TermsOfService = lazy(() => import("@/pages/TermsOfService"));
const PrivacyPolicy = lazy(() => import("@/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@/pages/CookiePolicy"));
const WelcomeWizard = lazy(() => import("@/components/onboarding/WelcomeWizard"));
const ProfileSettings = lazy(() => import("@/components/profile/ProfileSettings"));
const OrganizationRedirect = lazy(() => import("@/components/organization/OrganizationRedirect"));
const NotFound = lazy(() => import("@/pages/NotFound"));

function App() {
  useEffect(() => {
    // Add skip link for accessibility
    addSkipLink();
  }, []);
  return (
    <ErrorBoundary>
      <ErrorProvider>
        <AuthProvider>
          <AccountProvider>
            <Suspense fallback={<LoadingState message="Loading application..." />}>
              <GoogleAnalytics />
              <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email" element={<EmailVerificationHandler />} />
            <Route path="/reset-password" element={<PasswordResetHandler />} />
            <Route path="/profile-registration" element={<ProfileRegistration />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/register/esg-contributor/:token" element={<StakeholderRegistration />} />
            <Route path="/profile/:userId" element={<PublicProfile />} />
            <Route path="/organization/:organizationId" element={<OrganizationRedirect />} />
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
            {/* 404 Catch-all Route */}
            <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <FloatingFeedbackButton />
          <CookieConsent />
          <Toaster />
        </AccountProvider>
        </AuthProvider>
      </ErrorProvider>
    </ErrorBoundary>
  );
}

export default App;
