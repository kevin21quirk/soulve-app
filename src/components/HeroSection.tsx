import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight, Sparkles, Crown, Zap, Calendar } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { BookDemoModal } from "@/components/BookDemoModal";
import { motion } from "framer-motion";
import AnimatedHeroVisual from "./AnimatedHeroVisual";

const featurePills = [
  { label: "Social Feed", icon: "feed" },
  { label: "Real Impact", icon: "impact" },
  { label: "Community", icon: "community" },
  { label: "Purpose-Driven", icon: "purpose" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [applicantCount, setApplicantCount] = useState<number>(0);
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
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

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const idleCallback = requestIdleCallback(() => {
        checkOnboardingStatus();
        fetchApplicantCount();
      });

      return () => cancelIdleCallback(idleCallback);
    } else {
      const timeoutId = setTimeout(() => {
        checkOnboardingStatus();
        fetchApplicantCount();
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [user]);

  const handleJoinBeta = () => {
    if (user) {
      if (hasCompletedOnboarding) {
        navigate("/dashboard");
      } else {
        navigate("/profile-registration");
      }
    } else {
      navigate("/auth");
    }
  };

  const handleLearnMore = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary via-secondary to-[hsl(var(--soulve-purple))] text-white min-h-[90vh]">
      {/* Static background gradient overlay - removed animation for scroll performance */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10" />
      
      
      {/* Main Hero Content */}
      <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start pt-4">
          
          {/* Left Column - Content */}
          <motion.div 
            className="text-center lg:text-left space-y-6 lg:space-y-8"
            initial={{ opacity: 0.6, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="space-y-5">
              <motion.div 
                className="inline-flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-white/25 shadow-lg"
                initial={{ opacity: 0.7, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.2 }}
              >
                <Crown className="h-4 w-4 text-amber-300" />
                <span>Limited Access - Founding SouLVERs</span>
                {applicantCount > 0 && (
                  <>
                    <span className="text-white/50">•</span>
                    <span className="text-amber-200">{applicantCount} Founding SouLVERs</span>
                  </>
                )}
              </motion.div>
              
              <motion.h1 
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
                initial={{ opacity: 0.7, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08, duration: 0.25 }}
              >
                Social Media
                <br />
                <span className="bg-gradient-to-r from-cyan-200 via-white to-cyan-200 bg-clip-text text-transparent">
                  That SouLVE's
                </span>
                <br />
                Problems.
              </motion.h1>
              
              <motion.p 
                className="text-lg sm:text-xl lg:text-2xl text-white/90 leading-relaxed max-w-xl mx-auto lg:mx-0"
                initial={{ opacity: 0.7, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.25 }}
              >
                Join the social media platform where your activity fixes your real life community. Connect like you always do, but with purpose.
              </motion.p>
              
              {/* Feature Pills - Replace emojis */}
              <motion.div 
                className="flex flex-wrap gap-2 justify-center lg:justify-start"
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.12, duration: 0.2 }}
              >
                {featurePills.map((pill, index) => (
                  <motion.span
                    key={pill.label}
                    className="px-4 py-2 bg-white/15 rounded-full text-sm font-medium border border-white/20 hover:bg-white/25 transition-colors cursor-default"
                    whileHover={{ scale: 1.05 }}
                    initial={{ opacity: 0.8, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.12 + index * 0.03, duration: 0.15 }}
                  >
                    {pill.label}
                  </motion.span>
                ))}
              </motion.div>
            </div>
            
            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0.7, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              <Button 
                size="lg"
                className="bg-white text-secondary hover:bg-white/95 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-6 py-6 font-semibold shadow-2xl rounded-xl group border-none"
                onClick={handleJoinBeta}
              >
                <Crown className="mr-2 h-5 w-5" />
                <span>Join the Founding SouLVERs</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              
              <Button 
                size="lg"
                className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-6 py-6 font-semibold shadow-xl rounded-xl"
                onClick={handleLearnMore}
              >
                <Heart className="mr-2 h-5 w-5" />
                <span>Discover the Vision</span>
              </Button>
              
              <Button 
                size="lg"
                className="bg-white/20 border-2 border-white/30 text-white hover:bg-white/30 transform hover:scale-105 transition-all duration-300 text-base sm:text-lg px-6 py-6 font-semibold shadow-xl rounded-xl"
                onClick={() => setShowDemoModal(true)}
              >
                <Calendar className="mr-2 h-5 w-5" />
                <span>Book a Demo</span>
              </Button>
            </motion.div>

            {/* Founder's Circle Benefits - removed backdrop-blur for scroll performance */}
            <motion.div 
              className="bg-gradient-to-br from-white/15 to-white/5 rounded-2xl p-5 sm:p-6 max-w-xl mx-auto lg:mx-0 border border-white/20 shadow-xl"
              initial={{ opacity: 0.7, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18, duration: 0.2 }}
            >
              <p className="text-sm text-white/90 mb-4 font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-amber-300" />
                <span>Your Founding SouLVER Benefits:</span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-start space-x-3">
                  <Crown className="h-5 w-5 text-amber-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Founding SouLVER Badge</span>
                    <span className="text-xs text-white/70">Permanent recognition</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-cyan-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Direct Team Access</span>
                    <span className="text-xs text-white/70">Shape the platform</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-5 w-5 text-purple-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">Lifetime Benefits</span>
                    <span className="text-xs text-white/70">Premium features free</span>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-emerald-300 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm text-white font-medium block">First Access</span>
                    <span className="text-xs text-white/70">Every new feature</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Animated Visual */}
          <motion.div 
            className="hidden lg:block"
            initial={{ opacity: 0.6, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <AnimatedHeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background/20 to-transparent" />
      
      <BookDemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </div>
  );
};

export default HeroSection;
