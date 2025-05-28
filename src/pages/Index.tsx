
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
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
