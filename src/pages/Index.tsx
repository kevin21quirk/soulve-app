
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <HomeHeader />
      <HeroSection />
      <ImpactStats />
      <FeaturesSection />
      <UserTypesSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
};

export default Index;
