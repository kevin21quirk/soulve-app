
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

  // Handle redirect when auth state is ready and user is logged in
  useEffect(() => {
    let mounted = true;
    
    if (loading || !user || !session) return;

    const redirectUser = async () => {
      try {
        // Check if user is admin FIRST - admins bypass all checks
        const { data: isAdminUser } = await supabase.rpc('is_admin', { 
          user_uuid: user.id 
        });

        if (!mounted) return;

        if (isAdminUser) {
          navigate('/dashboard', { replace: true });
          return;
        }

        // Check if user has completed onboarding
        const { data: questionnaireData } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();

        if (!mounted) return;
        
        if (questionnaireData) {
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/profile-registration", { replace: true });
        }
      } catch (error) {
        // Stay on auth page if check fails
      }
    };

    redirectUser();
    
    return () => {
      mounted = false;
    };
  }, [user, session, loading, navigate]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = async () => {
    try {
      // Check if user has completed onboarding
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Error getting user:', userError);
        return;
      }

      // Check if user is admin FIRST - admins bypass all checks
      const { data: isAdminUser } = await supabase.rpc('is_admin', { 
        user_uuid: user.id 
      });

      if (isAdminUser) {
        navigate("/dashboard", { replace: true });
        return;
      }

      // Check for questionnaire completion
      const { data: questionnaireData, error: questionnaireError } = await supabase
        .from('questionnaire_responses')
        .select('id')
        .eq('user_id', user.id)
        .limit(1)
        .maybeSingle();
      
      if (questionnaireError) {
        console.error('Error checking questionnaire:', questionnaireError);
      }
      
      if (questionnaireData) {
        // User has completed onboarding - check waitlist status
        const { data: profileData } = await supabase
          .from('profiles')
          .select('waitlist_status')
          .eq('id', user.id)
          .maybeSingle();
        
        const waitlistStatus = profileData?.waitlist_status;
        
        if (waitlistStatus === 'pending' || waitlistStatus === 'denied') {
          // User is not approved, redirect to waitlist
          navigate("/waitlist", { replace: true });
        } else {
          // User is approved, go to dashboard
          navigate("/dashboard", { replace: true });
        }
      } else {
        // New user, needs to complete profile
        navigate("/profile-registration", { replace: true });
      }
    } catch (error) {
      console.error('Error in handleAuthSuccess:', error);
    }
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
            onClick={() => navigate('/')}
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
                  href={`https://supabase.com/dashboard/project/${import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0]}`}
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
