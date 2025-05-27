
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
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
