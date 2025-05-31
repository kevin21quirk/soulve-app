
import HeroSection from "@/components/HeroSection";
import ImpactStats from "@/components/ImpactStats";
import FeaturesSection from "@/components/FeaturesSection";
import UserTypesSection from "@/components/UserTypesSection";
import NewsletterSection from "@/components/NewsletterSection";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Add auth button to top right */}
      <div className="absolute top-4 right-4 z-50">
        {user ? (
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Go to Dashboard
          </Button>
        ) : (
          <Button onClick={() => navigate("/auth")} variant="outline">
            Sign In
          </Button>
        )}
      </div>
      
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
