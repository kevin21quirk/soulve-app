
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Target, TrendingUp, Star, MessageCircle, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const FeaturesSection = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      title: "Trust Score & Verification",
      description: "No more uncertainty. Our verification system builds authentic trust through real actions and community impact, so you know exactly who you're connecting with.",
      icon: Shield,
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      title: "AI-Powered Matching",
      description: "Stop wasting time searching. Our intelligent system instantly connects the right help with the right need, every single time.",
      icon: Target,
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Real-Time Impact Tracking",
      description: "See exactly how your actions change lives. Track every contribution, measure every outcome, celebrate every success story.",
      icon: TrendingUp,
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Gamified Engagement",
      description: "Making a difference should feel rewarding. Earn recognition, unlock achievements, and watch your impact level up with every action.",
      icon: Star,
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Community Feed",
      description: "Your social media feed, reimagined for good. Discover needs, offer help, and celebrate impact—all in one place that actually matters.",
      icon: MessageCircle,
      gradient: "from-green-500 to-emerald-500"
    },
    {
      title: "All-In-One Platform",
      description: "Stop juggling multiple apps. Social connection, crowdfunding, volunteering, and donations—unified in one powerful platform.",
      icon: Zap,
      gradient: "from-red-500 to-rose-500"
    }
  ];

  return (
    <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features, Effortless Impact</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Everything you need to transform good intentions into measurable change—all in one platform designed for the way communities actually work.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-white border border-gray-100 hover:border-teal-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group shadow-sm">
            <CardHeader className="pb-4">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-gray-900 group-hover:text-teal-700 transition-colors">
                {feature.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-600 leading-relaxed">
                {feature.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-16">
        <Button 
          size="lg"
          onClick={() => navigate("/register")}
          className="bg-gradient-to-r from-primary to-secondary text-white px-12 py-4 text-lg font-semibold hover:scale-105 transition-transform shadow-lg"
        >
          Start Your Journey
        </Button>
      </div>
    </section>
  );
};

export default FeaturesSection;
