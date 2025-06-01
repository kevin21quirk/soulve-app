
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
  const { user, loading } = useAuth();

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
      {/* Add auth button to top right */}
      <div className="absolute top-4 right-4 z-50">
        {user ? (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 hidden sm:inline">
              Welcome back!
            </span>
            <Button onClick={() => navigate("/dashboard")} className="bg-teal-600 hover:bg-teal-700">
              Go to Dashboard
            </Button>
          </div>
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
