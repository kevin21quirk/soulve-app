import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { 
  Heart, 
  Target, 
  Award, 
  BarChart3, 
  Users, 
  MessageSquare, 
  Building2, 
  Sparkles,
  Shield,
  Search,
  Calendar,
  BookOpen
} from "lucide-react";

const Features = () => {
  const navigate = useNavigate();

  const mainFeatures = [
    {
      icon: Shield,
      title: "Safe Space",
      description: "Completely anonymous peer-to-peer emotional support with trained helpers available 24/7. Seek help without fear of judgement or sharing your identity.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: Target,
      title: "Campaign Builder",
      description: "Create, manage, and launch social impact campaigns with powerful tools for fundraising, volunteer coordination, and impact tracking.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: Award,
      title: "Badge System",
      description: "Earn recognition for your contributions with our comprehensive badge system. Showcase your achievements and impact.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: BarChart3,
      title: "Impact Analytics",
      description: "Track your social impact with detailed analytics, visualisations, and reporting tools. Measure what matters.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: Building2,
      title: "Organisation Tools",
      description: "Manage teams, initiatives, and partnerships with dedicated tools for charities, businesses, and community organisations.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: Search,
      title: "Discovery & Networking",
      description: "Find and connect with like-minded changemakers, organisations, and campaigns aligned with your values.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: MessageSquare,
      title: "Messaging",
      description: "Stay connected with your community through integrated messaging. Collaborate and coordinate with ease.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: BookOpen,
      title: "Impact Stories",
      description: "Share your journey and inspire others. Read real stories of social impact and positive change from our community.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: true
    },
    {
      icon: Calendar,
      title: "Events & Groups",
      description: "Create and join events, build communities around shared causes, and mobilise action through group coordination.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: false,
      comingSoon: "Q2 2026"
    },
    {
      icon: Shield,
      title: "Trust & Safety",
      description: "Comprehensive safety features including content moderation, reporting tools, and community safeguarding measures.",
      gradient: "from-[#0ce4af] to-[#18a5fe]",
      available: false,
      comingSoon: "Q1 2026"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <Helmet>
        <title>Platform Features - SouLVE</title>
        <meta name="description" content="Explore all the powerful features that make SouLVE the leading social impact platform. From Safe Space support to campaign building and impact analytics." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] mb-6">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
            Platform Features
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Everything you need to create meaningful social impact. Discover the comprehensive suite of tools 
            designed to empower changemakers, organizations, and communities.
          </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:opacity-90"
            >
              Get Started Free
            </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mainFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="p-6 hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
              >
                {!feature.available && (
                  <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                    {feature.comingSoon}
                  </div>
                )}
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Built for Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent mb-2">
                10+
              </div>
              <p className="text-muted-foreground">Powerful Features</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent mb-2">
                24/7
              </div>
              <p className="text-muted-foreground">Safe Space Support</p>
            </div>
            <div>
              <div className="text-4xl font-bold bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent mb-2">
                ∞
              </div>
              <p className="text-muted-foreground">Impact Potential</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Explore All Features?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join SouLVE today and access all the tools you need to create lasting social impact.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:opacity-90"
          >
            Start Your Journey
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Features;
