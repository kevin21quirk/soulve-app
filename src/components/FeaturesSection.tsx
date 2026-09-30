
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, TrendingUp, Star, MessageCircle, Zap, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    title: "Trust Score & Verification",
    description: "No more uncertainty. Our verification system builds authentic trust through real actions and community impact, so you know exactly who you're connecting with.",
    icon: Shield,
  },
  {
    title: "AI-Powered Matching",
    description: "Stop wasting time searching. Our intelligent system instantly connects the right help with the right need, every single time.",
    icon: Target,
  },
  {
    title: "Real-Time Impact Tracking",
    description: "See exactly how your actions change lives. Track every contribution, measure every outcome, celebrate every success story.",
    icon: TrendingUp,
  },
  {
    title: "Gamified Engagement",
    description: "Making a difference should feel rewarding. Earn recognition, unlock achievements, and watch your impact level up with every action.",
    icon: Star,
  },
  {
    title: "Community Feed",
    description: "Your social media feed, reimagined for good. Discover needs, offer help, and celebrate impact—all in one place that actually matters.",
    icon: MessageCircle,
  },
  {
    title: "All-In-One Platform",
    description: "Stop juggling multiple apps. Social connection, crowdfunding, volunteering, and donations—unified in one powerful platform.",
    icon: Zap,
  },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section id="features" className="relative py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#18a5fe]/30 bg-[#18a5fe]/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-[#0f7fd4]">
            <Zap className="h-3.5 w-3.5" />
            The Platform
          </span>
          <h2 className="mt-5 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Powerful features,{" "}
            <span className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              effortless impact
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            Everything you need to transform good intentions into measurable change — all in one platform designed for the way communities actually work.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
            >
              <Card className="group h-full rounded-3xl border-slate-200/80 bg-white shadow-sm hover:shadow-2xl hover:shadow-slate-200 hover:-translate-y-1.5 hover:border-[#0ce4af]/40 transition-all duration-300">
                <CardHeader className="pb-3">
                  <div className="inline-flex p-3.5 rounded-2xl bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] mb-4 shadow-lg shadow-[#18a5fe]/25 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 w-fit">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl text-slate-900 group-hover:text-[#0f7fd4] transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600 leading-relaxed text-[15px]">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Button
            size="lg"
            onClick={() => navigate("/auth")}
            className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white px-10 py-6 text-base font-semibold rounded-full shadow-lg shadow-[#18a5fe]/30 hover:scale-105 transition-transform border-none group"
          >
            Start Your Journey
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
