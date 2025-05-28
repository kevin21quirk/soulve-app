
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, TrendingUp, Star, MessageCircle, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Trust Score & Verification",
      description: "Build trust through our comprehensive verification system and earn trust scores based on community impact.",
      icon: Shield,
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      title: "AI-Powered Matching",
      description: "Our intelligent system connects 'Soulvers' with community needs, ensuring the right help reaches the right people.",
      icon: Target,
      gradient: "from-teal-600 to-blue-500"
    },
    {
      title: "Real-Time Impact Tracking",
      description: "See the immediate and long-term impact of your actions with our comprehensive tracking dashboard.",
      icon: TrendingUp,
      gradient: "from-cyan-500 to-blue-500"
    },
    {
      title: "Gamified Engagement",
      description: "Earn recognition, unlock achievements, and level up your community impact through our engaging reward system.",
      icon: Star,
      gradient: "from-teal-500 to-blue-600"
    },
    {
      title: "Community Feed",
      description: "Transform your social feed into a powerful tool for social good - see needs, offer help, celebrate impact.",
      icon: MessageCircle,
      gradient: "from-teal-600 to-cyan-500"
    },
    {
      title: "Unified Platform",
      description: "One platform for social media, crowdfunding, volunteering, and donations - everything you need to make a difference.",
      icon: Zap,
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 bg-white">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">The Missing Link in Community Connection</h2>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          SouLVE combines the best of social media, crowdfunding, volunteering, and donations into one powerful platform that actually creates change.
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
    </div>
  );
};

export default FeaturesSection;
