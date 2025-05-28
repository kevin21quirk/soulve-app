
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Target, TrendingUp, Star, MessageCircle, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Trust Score & Verification",
      description: "Build trust through our comprehensive verification system and earn trust scores based on community impact.",
      icon: Shield,
      colour: "text-teal-600",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      title: "AI-Powered Matching",
      description: "Our intelligent system connects 'Soulvers' with community needs, ensuring the right help reaches the right people.",
      icon: Target,
      colour: "text-blue-600",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Real-Time Impact Tracking",
      description: "See the immediate and long-term impact of your actions with our comprehensive tracking dashboard.",
      icon: TrendingUp,
      colour: "text-purple-600",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Gamified Engagement",
      description: "Earn recognition, unlock achievements, and level up your community impact through our engaging reward system.",
      icon: Star,
      colour: "text-yellow-600",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Community Feed",
      description: "Transform your social feed into a powerful tool for social good - see needs, offer help, celebrate impact.",
      icon: MessageCircle,
      colour: "text-green-600",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Unified Platform",
      description: "One platform for social media, crowdfunding, volunteering, and donations - everything you need to make a difference.",
      icon: Zap,
      colour: "text-indigo-600",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-centre mb-16">
        <h2 className="text-4xl font-bold text-grey-900 mb-4">The Missing Link in Community Connection</h2>
        <p className="text-xl text-grey-600 max-w-3xl mx-auto">
          SouLVE combines the best of social media, crowdfunding, volunteering, and donations into one powerful platform that actually creates change.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-0 shadow-lg">
            <CardHeader className="pb-4">
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-xl text-grey-900">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-grey-600 leading-relaxed">
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
