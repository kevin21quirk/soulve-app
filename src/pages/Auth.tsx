import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/auth/AuthHeader";
import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";
import AuthToggle from "@/components/auth/AuthToggle";
import SouLVEIcon from "@/components/SouLVEIcon";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam !== 'signup');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('online');
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();

  // Only check backend connectivity once on mount
  useEffect(() => {
    let mounted = true;
    
    const checkBackend = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (mounted) {
          if (error) {
            if (error.message?.includes('upstream') || error.message?.includes('503')) {
              setBackendStatus('offline');
            } else {
              setBackendStatus('online');
            }
          } else {
            setBackendStatus('online');
          }
        }
      } catch (error) {
        if (mounted) {
          setBackendStatus('offline');
        }
      }
    };

    checkBackend();
    
    return () => {
      mounted = false;
    };
  }, []);

  // Simple redirect - let ProtectedRoute handle detailed checks
  useEffect(() => {
    if (!loading && user && session) {
      window.location.hash = "#/dashboard";
    }
  }, [user, session, loading]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Simple auth success - just navigate, let ProtectedRoute handle routing
  const handleAuthSuccess = () => {
    window.location.hash = "#/dashboard";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 mb-8">
        <div className="max-w-md mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => { window.location.hash = "#/"; }}
              className="text-white hover:text-teal-200 hover:bg-white/10 mb-4"
            >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <SouLVEIcon size="large" />
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Welcome Back" : "Join Our Testing Community"}
            </h1>
            <p className="text-teal-100">
              {isLogin 
                ? "Sign in to continue helping your community" 
                : "Be part of our exclusive beta program"
              }
            </p>
          </div>
        </div>
      </div>

      {/* Auth Content */}
      <div className="max-w-md mx-auto px-4 pb-8">
        <div className="space-y-4">
        {backendStatus === 'offline' && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Backend Service Issue Detected</strong>
              <p className="mt-1 text-sm">
                Your Supabase backend is experiencing connectivity issues after the recent upgrade. 
                This may resolve itself in a few minutes. If the issue persists, please check your 
                <a 
                  href="https://supabase.com/dashboard/project/anuvztvypsihzlbkewci" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Supabase dashboard
                </a>.
              </p>
            </AlertDescription>
          </Alert>
        )}
        
        <Card>
          <AuthHeader isLogin={isLogin} />
          <CardContent>
            <EnhancedAuthForm
              isLogin={isLogin}
              onToggleMode={handleToggleMode}
              onSuccess={handleAuthSuccess}
            />
            <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
