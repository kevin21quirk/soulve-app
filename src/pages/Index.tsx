import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import HeroSection from "@/components/HeroSection";
import ImpactStoriesSection from "@/components/ImpactStoriesSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import FAQSchema from "@/components/seo/FAQSchema";

const Index = () => {
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();

  useEffect(() => {
    let mounted = true;
    
    // Only redirect if we have an authenticated user
    if (loading || !user || !session) return;

    const checkAuthAndRedirect = async () => {
      try {
        // Check if user is admin FIRST - admins bypass all checks
        const { data: isAdminUser } = await supabase.rpc('is_admin', { 
          user_uuid: user.id 
        });

        if (!mounted) return;

        if (isAdminUser) {
          navigate("/dashboard", { replace: true });
          return;
        }

        // User is authenticated, check if they've completed onboarding
        const { data: questionnaireData } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        if (!mounted) return;

        if (questionnaireData) {
          // User is authenticated and has completed onboarding, redirect to dashboard
          navigate("/dashboard", { replace: true });
          return;
        } else {
          // User is authenticated but hasn't completed onboarding
          navigate("/profile-registration", { replace: true });
          return;
        }
      } catch (error) {
        console.error('[Index] Error checking auth status:', error);
      }
    };

    checkAuthAndRedirect();
    
    return () => {
      mounted = false;
    };
  }, [user, session, loading, navigate]);

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
      <FAQSchema
        faqs={[
          {
            question: "What is SouLVE?",
            answer: "SouLVE is a comprehensive social impact platform that connects individuals, organizations, and communities to create lasting positive change through fundraising campaigns, volunteer coordination, and ESG tracking."
          },
          {
            question: "How can I support campaigns?",
            answer: "You can support campaigns by donating, volunteering your time and skills, sharing campaigns with your network, or offering in-kind support."
          },
          {
            question: "What are impact badges?",
            answer: "Impact badges are recognition awards you earn for your social impact contributions, ranging from common achievements to legendary limited editions."
          }
        ]}
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
