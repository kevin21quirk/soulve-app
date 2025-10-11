import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        console.log('[Index] Session check:', { hasSession: !!session, userId: session?.user?.id, sessionError });
        
        if (session) {
          // User is authenticated, check if they've completed onboarding
          const { data: questionnaireData, error: questionnaireError } = await supabase
            .from('questionnaire_responses')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();
          
          console.log('[Index] Questionnaire check:', { 
            hasQuestionnaire: !!questionnaireData, 
            questionnaireError,
            userId: session.user.id 
          });
          
          if (questionnaireData) {
            // User is authenticated and has completed onboarding, redirect to dashboard
            console.log('[Index] Redirecting to dashboard');
            navigate("/dashboard", { replace: true });
            return;
          } else {
            // User is authenticated but hasn't completed onboarding
            console.log('[Index] Redirecting to profile-registration');
            navigate("/profile-registration", { replace: true });
            return;
          }
        }
        
        // User is not authenticated, show the marketing page
        console.log('[Index] No session, showing marketing page');
        setIsChecking(false);
      } catch (error) {
        console.error('[Index] Error checking auth status:', error);
        setIsChecking(false);
      }
    };

    checkAuthAndRedirect();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <HomeHeader />
      <HeroSection />
      <FeaturesSection />
      <UserTypesSection />
      <Footer />
    </div>
  );
};

export default Index;
