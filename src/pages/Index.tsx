import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HeroSection from "@/components/HeroSection";
import ImpactStoriesSection from "@/components/ImpactStoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // Check if user is admin FIRST - admins bypass all checks
          const { data: isAdminUser } = await supabase.rpc('is_admin', { 
            user_uuid: session.user.id 
          });

          if (isAdminUser) {
            navigate("/dashboard", { replace: true });
            return;
          }

          // User is authenticated, check if they've completed onboarding
          const { data: questionnaireData } = await supabase
            .from('questionnaire_responses')
            .select('id')
            .eq('user_id', session.user.id)
            .limit(1)
            .maybeSingle();
          
          if (questionnaireData) {
            // User is authenticated and has completed onboarding, redirect to dashboard
            navigate("/dashboard", { replace: true });
            return;
          } else {
            // User is authenticated but hasn't completed onboarding
            navigate("/profile-registration", { replace: true });
            return;
          }
        }
        
        // User is not authenticated, show the marketing page
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
      <SEOHead
        title="SouLVE - Connect, Contribute, Create Impact"
        description="Join SouLVE to track your ESG contributions, support social impact campaigns, volunteer, and make a lasting difference in your community and beyond."
        keywords={["social impact platform", "ESG tracking", "charity campaigns", "volunteering", "donations", "community impact", "fundraising", "social enterprise"]}
        url="https://join-soulve.com"
      />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Social impact platform connecting people, organizations, and campaigns for lasting change",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png",
          sameAs: []
        }}
      />
      <HomeHeader />
      <HeroSection />
      <ImpactStoriesSection />
      <FeaturesSection />
      <UserTypesSection />
      <Footer />
    </div>
  );
};

export default Index;
