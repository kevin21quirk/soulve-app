
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "@/components/auth/AuthHeader";
import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";
import AuthToggle from "@/components/auth/AuthToggle";
import SouLVEIcon from "@/components/SouLVEIcon";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam !== 'signup');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check backend connectivity
    const checkBackend = async () => {
      try {
        const { error } = await supabase.auth.getSession();
        if (error) {
          if (error.message?.includes('upstream') || error.message?.includes('503')) {
            setBackendStatus('offline');
          } else {
            setBackendStatus('online');
          }
        } else {
          setBackendStatus('online');
        }
      } catch (error) {
        setBackendStatus('offline');
      }
    };

    checkBackend();

    // Check if user is already logged in and redirect appropriately
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          // Check if user is admin FIRST - admins bypass all checks
          const { data: isAdminUser } = await supabase.rpc('is_admin', { 
            user_uuid: session.user.id 
          });

          if (isAdminUser) {
            navigate('/dashboard', { replace: true });
            return;
          }

          // Check if user has completed onboarding
          const { data: questionnaireData } = await supabase
            .from('questionnaire_responses')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1)
            .maybeSingle();
          
          if (questionnaireData) {
            navigate("/dashboard", { replace: true });
          } else {
            navigate("/profile-registration", { replace: true });
          }
        } else {
          setIsCheckingSession(false);
        }
      } catch (error) {
        // Session check failed, user stays on auth page
        setIsCheckingSession(false);
      }
    };
    checkUser();
  }, [navigate]);

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
        // User has completed onboarding, go to dashboard
        navigate("/dashboard", { replace: true });
      } else {
        // New user, needs to complete profile
        navigate("/profile-registration", { replace: true });
      }
    } catch (error) {
      console.error('Error in handleAuthSuccess:', error);
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Branded Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4 mb-8">
        <div className="max-w-md mx-auto px-4 text-center">
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
