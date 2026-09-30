import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Heart, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import AuthHeader from "@/components/auth/AuthHeader";
import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";
import AuthToggle from "@/components/auth/AuthToggle";
import HeroFeedVisual from "@/components/HeroFeedVisual";
import soulveIcon from "@/assets/soulve-icon.png";

const panelPoints = [
  { icon: Heart, text: "Connect with your community" },
  { icon: Users, text: "Volunteer, donate, campaign" },
  { icon: TrendingUp, text: "Track your real-world impact" },
];

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#18a5fe] mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Brand showcase panel — desktop only */}
      <div className="relative hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col items-center justify-center overflow-hidden bg-slate-50 border-r border-slate-100">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-[#0ce4af]/20 blur-[120px]" />
          <div className="absolute bottom-0 -right-24 h-96 w-96 rounded-full bg-[#18a5fe]/20 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] bg-[length:32px_32px]" />
        </div>

        <div className="relative flex flex-col items-center px-10">
          <HeroFeedVisual />

          <h2 className="mt-2 text-3xl xl:text-4xl font-bold tracking-tight text-slate-950 text-center">
            Where social meets{" "}
            <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              impact
            </span>
          </h2>
          <p className="mt-3 text-slate-500 text-center max-w-md">
            Sign in to keep making a difference in your community.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            {panelPoints.map((point) => (
              <div
                key={point.text}
                className="flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-4 py-2 shadow-sm"
              >
                <point.icon className="h-4 w-4 text-teal-600 shrink-0" />
                <span className="text-xs font-medium text-slate-600 whitespace-nowrap">{point.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form side */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="px-4 sm:px-8 pt-5">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-slate-500 hover:text-slate-900 hover:bg-slate-100 h-9 text-sm rounded-full -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back to Home
          </Button>
        </div>

        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 py-10">
          <div className="w-full max-w-md space-y-6">
            {/* Mobile brand mark */}
            <div className="lg:hidden flex flex-col items-center text-center">
              <img
                src={soulveIcon}
                alt="SouLVE - Connecting Communities"
                className="h-20 w-20 object-contain animate-heart-glow"
              />
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                {isLogin ? "Welcome back" : "Join our community"}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {isLogin
                  ? "Sign in to continue helping your community"
                  : "Be part of our exclusive beta program"}
              </p>
            </div>

            {backendStatus === 'offline' && (
              <Alert variant="destructive" className="rounded-2xl">
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

            <Card className="rounded-3xl border-slate-200/80 shadow-xl shadow-slate-200/60 bg-white overflow-hidden">
              <AuthHeader isLogin={isLogin} />
              <CardContent className="pt-6">
                <EnhancedAuthForm
                  isLogin={isLogin}
                  onToggleMode={handleToggleMode}
                  onSuccess={handleAuthSuccess}
                />
                <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />
              </CardContent>
            </Card>

            <p className="text-center text-xs text-slate-400">
              Secure sign-in powered by Supabase Auth
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
