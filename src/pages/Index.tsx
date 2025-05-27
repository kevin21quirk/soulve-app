import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Heart, Users, Globe, Shield, Target, Zap, Star, TrendingUp, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [email, setEmail] = useState("");
  const [impactStats, setImpactStats] = useState({ connections: 0, verified: 0, communities: 0 });
  const { toast } = useToast();

  // Animate impact numbers on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setImpactStats({ connections: 15420, verified: 2834, communities: 187 });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Welcome to the SouLVE Community!",
        description: "You'll be the first to know when we launch. Get ready to bridge the human gap!",
      });
      setEmail("");
    }
  };

  // SouLVE Logo Component
  const SouLVELogo = ({ size = "large" }: { size?: "small" | "large" }) => {
    const isLarge = size === "large";
    
    if (isLarge) {
      // Use full logo for large version with increased size
      return (
        <div className="flex items-center justify-center">
          <img 
            src="/lovable-uploads/277d412c-6e36-4592-bb09-13ca866e9d79.png" 
            alt="SouLVE - Social Feed to Social Need" 
            className="h-32 w-auto bg-transparent"
          />
        </div>
      );
    } else {
      // Use icon only for small version
      return (
        <div className="flex items-center space-x-2">
          <img 
            src="/lovable-uploads/25feaabf-2868-4cfc-a034-77054efffb53.png" 
            alt="SouLVE Icon" 
            className="h-8 w-8"
          />
          <div className="text-left">
            <h3 className="text-lg font-bold text-white">SouLVE</h3>
          </div>
        </div>
      );
    }
  };

  const features = [
    {
      title: "Trust Score & Verification",
      description: "Build trust through our comprehensive verification system and earn trust scores based on community impact.",
      icon: Shield,
      color: "text-teal-600",
      gradient: "from-teal-500 to-cyan-500"
    },
    {
      title: "AI-Powered Matching",
      description: "Our intelligent system connects 'Soulvers' with community needs, ensuring the right help reaches the right people.",
      icon: Target,
      color: "text-blue-600",
      gradient: "from-blue-500 to-indigo-500"
    },
    {
      title: "Real-Time Impact Tracking",
      description: "See the immediate and long-term impact of your actions with our comprehensive tracking dashboard.",
      icon: TrendingUp,
      color: "text-purple-600",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      title: "Gamified Engagement",
      description: "Earn recognition, unlock achievements, and level up your community impact through our engaging reward system.",
      icon: Star,
      color: "text-yellow-600",
      gradient: "from-yellow-500 to-orange-500"
    },
    {
      title: "Community Feed",
      description: "Transform your social feed into a powerful tool for social good - see needs, offer help, celebrate impact.",
      icon: MessageCircle,
      color: "text-green-600",
      gradient: "from-green-500 to-teal-500"
    },
    {
      title: "Unified Platform",
      description: "One platform for social media, crowdfunding, volunteering, and donations - everything you need to make a difference.",
      icon: Zap,
      color: "text-indigo-600",
      gradient: "from-indigo-500 to-blue-500"
    }
  ];

  const userTypes = [
    {
      title: "Community Members",
      description: "Request help when you need it, offer support when you can. Build meaningful connections in your neighborhood.",
      audience: "Individuals seeking or offering help"
    },
    {
      title: "Businesses & CSR",
      description: "Amplify your corporate social responsibility initiatives and connect directly with community needs.",
      audience: "Companies looking to make measurable impact"
    },
    {
      title: "Charities & Organizations",
      description: "Expand your reach, connect with volunteers, and track your impact across communities.",
      audience: "Non-profits and community groups"
    },
    {
      title: "Community Leaders",
      description: "Lead initiatives, coordinate responses, and build stronger, more connected communities.",
      audience: "Local leaders and activists"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center animate-fade-in">
            {/* Updated SouLVE Logo */}
            <div className="flex justify-center items-center mb-8">
              <SouLVELogo size="large" />
            </div>
            
            <p className="text-xl md:text-2xl mb-4 max-w-4xl mx-auto leading-relaxed">
              The social media platform that bridges the human gap AI cannot reach
            </p>
            <p className="text-lg mb-8 max-w-3xl mx-auto text-cyan-100">
              Connect people who need help with those who can provide it. Build trust, track impact, and transform your community one connection at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-teal-50 transform hover:scale-105 transition-all duration-200" asChild>
                <a href="/dashboard">
                  <Heart className="mr-2 h-5 w-5" />
                  Try SouLVE Demo
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-600 transform hover:scale-105 transition-all duration-200">
                <Users className="mr-2 h-5 w-5" />
                Become a Soulver
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: "Connections Made", value: impactStats.connections.toLocaleString(), icon: Heart, color: "bg-gradient-to-r from-teal-500 to-cyan-500" },
            { label: "Verified Soulvers", value: impactStats.verified.toLocaleString(), icon: Shield, color: "bg-gradient-to-r from-blue-500 to-indigo-500" },
            { label: "Active Communities", value: impactStats.communities.toLocaleString(), icon: Globe, color: "bg-gradient-to-r from-purple-500 to-pink-500" }
          ].map((stat, index) => (
            <Card key={index} className="bg-white/95 backdrop-blur shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className={`inline-flex p-3 rounded-full ${stat.color} mb-4`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">The Missing Link in Community Connection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
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
                <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
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

      {/* Target Users */}
      <div className="bg-gradient-to-r from-gray-50 to-teal-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Built for Everyone Who Cares</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're looking to help or need support, SouLVE creates meaningful connections across all communities.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {userTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 bg-white/80 backdrop-blur border-0 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg text-gray-900">{type.title}</CardTitle>
                  <CardDescription className="text-sm text-teal-600 font-medium">
                    {type.audience}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">{type.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pre-Release CTA */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Join the Pre-Release Community</h2>
          <p className="text-xl text-teal-100 mb-2">
            Be the first to experience the platform that bridges the human gap AI cannot reach.
          </p>
          <p className="text-lg text-teal-200 mb-8">
            Together, we can build a better future - one connection at a time.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/90 border-0"
              required
            />
            <Button type="submit" className="bg-white text-teal-600 hover:bg-teal-50">
              Join SouLVE
            </Button>
          </form>
          <p className="text-sm text-teal-200 mt-4">
            Contact us: <a href="mailto:info@join-soulve.com" className="underline hover:text-white">info@join-soulve.com</a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <SouLVELogo size="small" />
              </div>
              <p className="text-gray-400 text-sm">
                Bridging the human gap AI cannot reach through trust-based community connections.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impact Stories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">For Individuals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Businesses</a></li>
                <li><a href="#" className="hover:text-white transition-colors">For Organizations</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About SouLVE</a></li>
                <li><a href="mailto:info@join-soulve.com" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SouLVE. Building better communities through meaningful connections.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
