
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
