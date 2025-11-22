
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
    // Safari compatibility: Use requestIdleCallback if available, otherwise setTimeout
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = requestIdleCallback(() => {
        checkOnboardingStatus();
        fetchApplicantCount();
      });

      return () => cancelIdleCallback(idleCallback);
    } else {
      // Fallback for Safari
      const timeoutId = setTimeout(() => {
        checkOnboardingStatus();
        fetchApplicantCount();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
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
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-center lg:text-left space-y-8 animate-fade-in">
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold mb-4 border border-white/30 max-w-full">
                <Crown className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-300 flex-shrink-0" />
                <span className="whitespace-nowrap">Limited Access - Founding SouLVERs</span>
                {applicantCount > 0 && (
                  <>
                    <span className="text-white/60">•</span>
                    <span className="text-yellow-200 whitespace-nowrap">{applicantCount} Founding SouLVERs</span>
                  </>
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight break-words">
                Social Media
                <br />
                <span className="text-cyan-200">That SouLVE's</span>
                <br />
                Problems.
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-cyan-100 leading-relaxed max-w-full sm:max-w-2xl mx-auto lg:mx-0 break-words">
                Join the social media platform where your activity fixes your real life community. Connect like you always do, but this time with a purpose that matters.
              </p>
              
              <p className="text-sm sm:text-base md:text-lg text-cyan-200/90 leading-relaxed max-w-full sm:max-w-2xl mx-auto lg:mx-0 flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-3 md:gap-4">
                📱 Posts | 👥 Feed | ❤️ Impact | 🌍 Community
              </p>
            </div>
            
            {/* CTA Buttons - Prominently Placed */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start w-full">
              <Button 
                size="default"
                className="w-full sm:w-auto bg-white text-[#18a5fe] hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 font-semibold shadow-xl rounded-xl group border-none"
                onClick={handleJoinBeta}
              >
                <Crown className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="truncate">Join the Founding SouLVERs</span>
                <ArrowRight className="ml-1 sm:ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform flex-shrink-0" />
              </Button>
              
              <Button 
                size="default"
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#18a5fe] transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 font-semibold shadow-xl rounded-xl"
                onClick={handleLearnMore}
              >
                <Heart className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="truncate">Discover the Vision</span>
              </Button>
              
              <Button 
                size="default"
                className="w-full sm:w-auto bg-white/20 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-[#18a5fe] transform hover:scale-105 transition-all duration-300 text-sm sm:text-base md:text-lg px-4 py-3 sm:px-6 sm:py-3 md:px-8 md:py-4 font-semibold shadow-xl rounded-xl"
                onClick={() => setShowDemoModal(true)}
              >
                <Calendar className="mr-2 sm:mr-3 h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
                <span className="truncate">Book a Demo</span>
              </Button>
            </div>

            {/* Founder's Circle Benefits */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 sm:p-6 max-w-full sm:max-w-xl mx-auto lg:mx-0 border border-white/20">
              <p className="text-xs sm:text-sm text-cyan-100 mb-3 sm:mb-4 font-semibold flex items-center gap-2">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                <span>Your Founding SouLVER Benefits:</span>
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                <div className="flex items-start space-x-2 min-w-0">
                  <Crown className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-white font-medium block break-words">Founding SouLVER Badge</span>
                    <span className="text-[10px] sm:text-xs text-cyan-200">Permanent recognition</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 min-w-0">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-white font-medium block break-words">Direct Team Access</span>
                    <span className="text-[10px] sm:text-xs text-cyan-200">Shape the platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 min-w-0">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-white font-medium block break-words">Lifetime Benefits</span>
                    <span className="text-[10px] sm:text-xs text-cyan-200">Premium features free</span>
                  </div>
                </div>
                <div className="flex items-start space-x-2 min-w-0">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-green-300 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-xs sm:text-sm text-white font-medium block break-words">First Access</span>
                    <span className="text-[10px] sm:text-xs text-cyan-200">Every new feature</span>
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
