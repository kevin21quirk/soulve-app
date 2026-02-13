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
    console.log('[AUTH PAGE] useEffect triggered:', { loading, hasUser: !!user, hasSession: !!session });
    if (!loading && user && session) {
      console.log('[AUTH PAGE] User authenticated, navigating to dashboard');
      navigate("/dashboard", { replace: true });
    }
  }, [user, session, loading, navigate]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  // Simple auth success - just navigate, let ProtectedRoute handle routing
  const handleAuthSuccess = () => {
    console.log('[AUTH PAGE] handleAuthSuccess called - navigating to dashboard');
    navigate("/dashboard", { replace: true });
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
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-1 mb-6 shadow-2xl relative">
        <div className="max-w-md mx-auto px-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="text-white hover:text-teal-200 hover:bg-white/10 mb-1"
            >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="flex items-center justify-center mb-0">
              <SouLVEIcon size="large" />
            </div>
            <h1 className="text-4xl font-bold mb-0 drop-shadow-lg leading-tight" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
              {isLogin ? "Welcome Back" : "Join Our Testing Community"}
            </h1>
            <p className="text-lg text-teal-50 drop-shadow-md leading-tight">
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
        
        <Card className="shadow-2xl border-2 border-white/20 backdrop-blur-sm bg-white/95 transform transition-all duration-300 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:scale-[1.02]" style={{perspective: '1000px'}}>
          <div className="relative" style={{transformStyle: 'preserve-3d'}}>
          <AuthHeader isLogin={isLogin} />
          <CardContent className="relative z-10">
            <EnhancedAuthForm
              isLogin={isLogin}
              onToggleMode={handleToggleMode}
              onSuccess={handleAuthSuccess}
            />
            <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />
          </CardContent>
          </div>
        </Card>
        </div>
      </div>
    </div>
  );
};

export default Auth;
