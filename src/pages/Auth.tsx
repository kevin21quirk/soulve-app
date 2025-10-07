
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "@/components/auth/AuthHeader";
import EnhancedAuthForm from "@/components/auth/EnhancedAuthForm";
import AuthToggle from "@/components/auth/AuthToggle";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const modeParam = searchParams.get('mode');
  const [isLogin, setIsLogin] = useState(modeParam !== 'signup');
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
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

    // Check if user is already logged in
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        // Session check failed, user stays on auth page
      }
    };
    checkUser();
  }, [navigate]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    navigate("/profile-registration");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
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
  );
};

export default Auth;
