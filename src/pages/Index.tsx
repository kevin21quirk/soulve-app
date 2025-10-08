
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import Footer from "@/components/Footer";
import HomeHeader from "@/components/HomeHeader";

const Index = () => {
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
