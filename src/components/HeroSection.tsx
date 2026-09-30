import { Button } from "@/components/ui/button";
import { Heart, Users, ArrowRight, Sparkles, Crown, Zap, Calendar } from "@/components/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { BookDemoModal } from "@/components/BookDemoModal";
import { motion } from "framer-motion";
import HeroFeedVisual from "./HeroFeedVisual";

const founderStack = [
  { initials: "JD", gradient: "from-[#0ce4af] to-[#18a5fe]" },
  { initials: "AK", gradient: "from-[#18a5fe] to-[#4c3dfb]" },
  { initials: "RW", gradient: "from-[#0ce4af] to-teal-600" },
  { initials: "EL", gradient: "from-[#4c3dfb] to-[#18a5fe]" },
  { initials: "MO", gradient: "from-sky-400 to-[#18a5fe]" },
];

const featurePills = [
  { label: "Social Feed", icon: Heart },
  { label: "Real Impact", icon: Zap },
  { label: "Community", icon: Users },
  { label: "Purpose-Driven", icon: Sparkles },
];

const benefits = [
  { icon: Crown, color: "text-amber-500", title: "Founding SouLVER Badge", sub: "Permanent recognition" },
  { icon: Users, color: "text-sky-600", title: "Direct Team Access", sub: "Shape the platform" },
  { icon: Sparkles, color: "text-[#4c3dfb]", title: "Lifetime Benefits", sub: "Premium features free" },
  { icon: Zap, color: "text-emerald-600", title: "First Access", sub: "Every new feature" },
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
        console.error('Error checking onboarding status:', JSON.stringify(error));
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
        console.error('Error fetching applicant count:', JSON.stringify(error));
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
    <section className="relative overflow-hidden bg-white min-h-[92vh] flex items-center">
      {/* Ambient background */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-32 h-[540px] w-[540px] rounded-full bg-[#0ce4af]/20 blur-[130px]"
          animate={{ x: [0, 40, 0], y: [0, -24, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-1/4 -right-40 h-[580px] w-[580px] rounded-full bg-[#18a5fe]/20 blur-[130px]"
          animate={{ x: [0, -36, 0], y: [0, 28, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-44 left-1/3 h-[440px] w-[440px] rounded-full bg-[#4c3dfb]/10 blur-[130px]"
          animate={{ x: [0, 24, 0], y: [0, -16, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(15,23,42,0.05)_1px,transparent_0)] bg-[length:32px_32px]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">

          {/* Copy */}
          <motion.div
            className="text-center lg:text-left space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
            >
              <Crown className="h-4 w-4 text-amber-500" />
              <span>Limited Access · Founding SouLVERs</span>
              {applicantCount > 0 && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-teal-600">{applicantCount.toLocaleString()} joined</span>
                </>
              )}
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-slate-950"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
            >
              Social media
              <br />
              that{" "}
              <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
                SouLVEs
              </span>
              <br />
              problems.
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.4 }}
            >
              The social platform where your everyday activity fixes real problems in your community. Scroll, connect, post — but with purpose.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              className="flex flex-wrap gap-2 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {featurePills.map((pill) => (
                <span
                  key={pill.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:border-[#0ce4af]/50 hover:text-slate-900 transition-colors cursor-default shadow-sm"
                >
                  <pill.icon className="h-3.5 w-3.5 text-teal-600" />
                  {pill.label}
                </span>
              ))}
            </motion.div>

            {/* Social proof */}
            <motion.div
              className="flex items-center gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.22, duration: 0.4 }}
            >
              <div className="flex -space-x-3">
                {founderStack.map((f) => (
                  <div
                    key={f.initials}
                    className={`h-10 w-10 rounded-full bg-gradient-to-br ${f.gradient} flex items-center justify-center text-[11px] font-bold text-white ring-2 ring-white shadow-md`}
                  >
                    {f.initials}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-[#0ce4af] opacity-60 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0ce4af]" />
                  </span>
                  Growing every day
                </div>
                <p className="text-xs text-slate-500">Founding members shaping the platform</p>
              </div>
            </motion.div>

            {/* CTAs */}
            <motion.div
              className="flex flex-col sm:flex-row sm:flex-wrap gap-3 justify-center lg:justify-start max-w-xl mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.4 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-base font-semibold px-7 py-6 rounded-full shadow-xl shadow-[#18a5fe]/30 group border-none transition-all hover:scale-[1.03] hover:opacity-95"
                onClick={handleJoinBeta}
              >
                <Crown className="mr-2 h-5 w-5" />
                <span>Join the Founding SouLVERs</span>
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <Button
                size="lg"
                className="bg-white border border-slate-200 text-slate-800 hover:border-[#18a5fe]/60 hover:text-[#0f7fd4] text-base font-semibold px-7 py-6 rounded-full shadow-sm transition-all hover:scale-[1.03]"
                onClick={handleLearnMore}
              >
                <Heart className="mr-2 h-5 w-5" />
                <span>Discover the Vision</span>
              </Button>

              <Button
                size="lg"
                variant="ghost"
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 text-sm font-semibold px-5 py-3 rounded-full border border-slate-200"
                onClick={() => setShowDemoModal(true)}
              >
                <Calendar className="mr-2 h-4 w-4" />
                <span>Book a Demo</span>
              </Button>
            </motion.div>

            {/* Benefits */}
            <motion.div
              className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-md mx-auto lg:mx-0 pt-2"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.4 }}
            >
              {benefits.map((b) => (
                <div key={b.title} className="flex items-start gap-2.5">
                  <b.icon className={`h-5 w-5 ${b.color} mt-0.5 shrink-0`} />
                  <div>
                    <span className="block text-sm font-medium text-slate-900">{b.title}</span>
                    <span className="block text-xs text-slate-500">{b.sub}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Heart visual */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <HeroFeedVisual />
          </motion.div>
        </div>
      </div>

      <BookDemoModal open={showDemoModal} onOpenChange={setShowDemoModal} />
    </section>
  );
};

export default HeroSection;
