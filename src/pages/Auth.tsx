
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthForm from "@/components/auth/AuthForm";
import AuthToggle from "@/components/auth/AuthToggle";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkUser();
  }, [navigate]);

  const handleToggleMode = () => {
    setIsLogin(!isLogin);
  };

  const handleAuthSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <AuthHeader isLogin={isLogin} />
        <CardContent>
          <AuthForm
            isLogin={isLogin}
            onToggleMode={handleToggleMode}
            onSuccess={handleAuthSuccess}
          />
          <AuthToggle isLogin={isLogin} onToggle={handleToggleMode} />
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
