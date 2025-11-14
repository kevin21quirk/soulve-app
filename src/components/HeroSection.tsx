
import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight, Sparkles, Crown, Zap, Calendar } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { BookDemoModal } from "@/components/BookDemoModal";

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [applicantCount, setApplicantCount] = useState<number>(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    // Defer non-critical API calls until browser is idle
    const checkOnboardingStatus = async () => {
      if (!user) {
        setHasCompletedOnboarding(null);
        return;
      }

      try {
        const { data } = await supabase
          .from('questionnaire_responses')
          .select('id')
          .eq('user_id', user.id)
          .limit(1)
          .maybeSingle();
        
        setHasCompletedOnboarding(!!data);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setHasCompletedOnboarding(false);
      }
    };

    const fetchApplicantCount = async () => {
      try {
        const { count } = await supabase
          .from('questionnaire_responses')
          .select('*', { count: 'exact', head: true });
        
        setApplicantCount(count || 0);
      } catch (error) {
        console.error('Error fetching applicant count:', error);
      }
    };

    // Wait for browser idle time before making API calls
    const idleCallback = requestIdleCallback(() => {
      checkOnboardingStatus();
      fetchApplicantCount();
    });

    return () => cancelIdleCallback(idleCallback);
  }, [user]);

  const handleJoinBeta = () => {
    if (user) {
      // If user is logged in, check their onboarding status
      if (hasCompletedOnboarding) {
        navigate("/dashboard");
      } else {
        navigate("/profile-registration");
      }
    } else {
      // For non-logged-in users, go to auth page
      navigate("/auth");
    }
  };

  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white">
      <div className="absolute inset-0 bg-black/10"></div>
      
      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-semibold mb-4 border border-white/30">
                <Crown className="h-4 w-4 text-yellow-300" />
                <span>Limited Access - Founding SouLVERs</span>
                {applicantCount > 0 && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="text-yellow-200">{applicantCount} Founding SouLVERs</span>
                  </>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Social Media
                <br />
                <span className="text-cyan-200">That SouLVE's</span>
                <br />
                Problems.
              </h1>
              
              <p className="text-xl md:text-2xl text-cyan-100 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Join the social media platform where your activity fixes your real life community. Connect like you always do, but this time with a purpose that matters.
              </p>
              
              <p className="text-lg text-cyan-200/90 leading-relaxed max-w-2xl mx-auto lg:mx-0 flex items-center justify-center lg:justify-start gap-4">
                📱 Posts | 👥 Feed | ❤️ Impact | 🌍 Community
              </p>
            </div>
            
            {/* CTA Buttons - Prominently Placed */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bg-white text-[#18a5fe] hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold shadow-xl rounded-xl group border-none"
                onClick={handleJoinBeta}
              >
                <Crown className="mr-3 h-6 w-6" />
                Join the Founding SouLVERs
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#18a5fe] transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold shadow-xl rounded-xl"
                onClick={handleLearnMore}
              >
                <Heart className="mr-3 h-6 w-6" />
                Discover the Vision
              </Button>
              
              <Button 
                size="lg" 
                className="bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#18a5fe] transform hover:scale-105 transition-all duration-300 text-lg px-8 py-4 font-semibold shadow-xl rounded-xl"
                onClick={() => setShowDemoModal(true)}
              >
                <Calendar className="mr-3 h-6 w-6" />
                Book a Demo
              </Button>
            </div>

            {/* Founder's Circle Benefits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto lg:mx-0 border border-white/20">
              <p className="text-sm text-cyan-100 mb-4 font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Your Founding SouLVER Benefits:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-2">
                  <Crown className="h-5 w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Founding SouLVER Badge</span>
                    <span className="text-xs text-cyan-200">Permanent recognition</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Users className="h-5 w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Direct Team Access</span>
                    <span className="text-xs text-cyan-200">Shape the platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Lifetime Benefits</span>
                    <span className="text-xs text-cyan-200">Premium features free</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <Zap className="h-5 w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">First Access</span>
                    <span className="text-xs text-cyan-200">Every new feature</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      
      <BookDemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </div>
  );
};

export default HeroSection;
