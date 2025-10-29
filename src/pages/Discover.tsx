import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Search, Users, Filter, Heart, Building2, Target, MapPin, Sparkles, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Discover = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Search,
      title: "Smart Search",
      description: "Find people, organisations, and campaigns using powerful search filters and AI-powered recommendations."
    },
    {
      icon: Filter,
      title: "Advanced Filters",
      description: "Filter by location, interests, skills, causes, and more to find the perfect connections."
    },
    {
      icon: Users,
      title: "Community Profiles",
      description: "Explore detailed profiles showcasing impact history, badges, skills, and interests."
    },
    {
      icon: Heart,
      title: "Shared Values",
      description: "Connect with people who share your passion for specific causes and social impact areas."
    },
    {
      icon: Building2,
      title: "Organisations",
      description: "Discover charities, businesses, and community groups aligned with your values."
    },
    {
      icon: Target,
      title: "Active Campaigns",
      description: "Find ongoing campaigns and initiatives where you can contribute and make a difference."
    }
  ];

  const connectionTypes = [
    {
      title: "Individual Changemakers",
      description: "Connect with passionate individuals working on social impact projects",
      gradient: "from-[#0ce4af] to-[#18a5fe]"
    },
    {
      title: "Charities & Nonprofits",
      description: "Partner with established organisations driving positive change",
      gradient: "from-[#0ce4af] to-[#18a5fe]"
    },
    {
      title: "Social Enterprises",
      description: "Collaborate with businesses committed to social and environmental impact",
      gradient: "from-[#0ce4af] to-[#18a5fe]"
    },
    {
      title: "Community Leaders",
      description: "Learn from experienced leaders mobilising communities for good",
      gradient: "from-[#0ce4af] to-[#18a5fe]"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Discover People & Organizations - SouLVE</title>
        <meta name="description" content="Find like-minded individuals, organizations, and campaigns that share your passion for social impact. Build meaningful connections with our discovery tools." />
      </Helmet>

      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-6">
              <Search className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Discover Your Community</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
              Find like-minded changemakers, organizations, and campaigns that share your passion for social impact. 
              Build meaningful connections and collaborate on projects that matter.
            </p>
            <Button 
              size="lg"
              onClick={() => navigate('/auth')}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Start Discovering
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Powerful Discovery Tools</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 mb-4">
                  <feature.icon className="h-6 w-6 text-[#0ce4af]" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Connection Types Section */}
      <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Who You Can Connect With</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our platform brings together a diverse community of changemakers. Find the right connections for your impact goals.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {connectionTypes.map((type, index) => (
              <Card key={index} className="p-6 hover:shadow-xl transition-all group">
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${type.gradient} mb-4 group-hover:w-24 transition-all`}></div>
                <h3 className="text-xl font-semibold mb-2">{type.title}</h3>
                <p className="text-muted-foreground">{type.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How Discovery Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Create Profile", description: "Set up your profile with interests and causes" },
              { step: "2", title: "Search & Filter", description: "Use our tools to find relevant connections" },
              { step: "3", title: "Connect", description: "Send messages and connection requests" },
              { step: "4", title: "Collaborate", description: "Work together on impactful projects" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted/50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-6">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Your Impact Community Awaits</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of changemakers discovering meaningful connections every day.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
          >
            Join SouLVE Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Discover;
