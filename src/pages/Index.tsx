import { useEffect, lazy, Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import HomeHeader from "@/components/HomeHeader";
import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import FAQSchema from "@/components/seo/FAQSchema";
import { LoadingState } from "@/components/ui/loading-state";

// HeroSection is above-the-fold - load immediately for faster LCP
import HeroSection from "@/components/HeroSection";

// Lazy load below-the-fold sections
const ImpactStoriesSection = lazy(() => import("@/components/ImpactStoriesSection"));
const FeaturesSection = lazy(() => import("@/components/FeaturesSection"));
const UserTypesSection = lazy(() => import("@/components/UserTypesSection"));
const Footer = lazy(() => import("@/components/Footer"));

const Index = () => {
  const navigate = useNavigate();
  const { user, session, loading } = useAuth();

  useEffect(() => {
    // Simple redirect - let ProtectedRoute handle all the detailed auth checks
    // This eliminates duplicate database calls
    if (!loading && user && session) {
      navigate("/dashboard", { replace: true });
    }
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
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingState message="Loading content..." />
        </div>
      }>
        <ImpactStoriesSection />
      </Suspense>
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingState message="Loading features..." />
        </div>
      }>
        <FeaturesSection />
      </Suspense>
      <Suspense fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <LoadingState message="Loading..." />
        </div>
      }>
        <UserTypesSection />
      </Suspense>
      <Suspense fallback={
        <div className="min-h-[200px] flex items-center justify-center">
          <LoadingState size="sm" />
        </div>
      }>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
