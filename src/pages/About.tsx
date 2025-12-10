import { Link, useNavigate } from "react-router-dom";
import { Users, Heart, Shield, TrendingUp, ArrowLeft, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";
import Footer from "@/components/Footer";

const About = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is SouLVE?",
      answer: "SouLVE is a community platform that connects people who want to help with people who need it. Whether you're offering your skills to neighbours, asking for support when life gets tough, volunteering with local charities, or fundraising for causes you care about—SouLVE makes it simple to find opportunities near you."
    },
    {
      question: "Who can use SouLVE?",
      answer: "Anyone can join SouLVE. Individuals use it to offer help in their neighbourhood, ask for support when needed, and find local volunteer opportunities. Charities use it to recruit volunteers and raise funds. Businesses use it for CSR programmes and employee engagement. Community groups use it to organise events and connect with supporters."
    },
    {
      question: "Is SouLVE free to use?",
      answer: "SouLVE is free for individuals to join and use. Charities and community groups can create accounts at no cost. Businesses have access to premium features for ESG reporting and employee engagement programmes."
    },
    {
      question: "How does the trust system work?",
      answer: "Your trust score reflects your verified contributions—volunteering hours, donations, profile verification, and community engagement. Higher trust unlocks additional features and helps others feel confident connecting with you."
    },
    {
      question: "How is my data protected?",
      answer: "We take data protection seriously. SouLVE is fully GDPR compliant, with robust security measures and transparent privacy practices. Your data is never sold to third parties."
    }
  ];

  const stats = [
    { value: "Local", label: "Community focused", sublabel: "Help near you" },
    { value: "Verified", label: "Trusted profiles", sublabel: "Real people, real impact" },
    { value: "GDPR", label: "Fully compliant", sublabel: "Your data protected" },
  ];

  const values = [
    {
      icon: Users,
      title: "People First",
      description: "Everything we build serves the people who use it—individuals seeking support, volunteers giving time, and organisations creating change.",
      colour: "teal"
    },
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "Verified profiles, transparent impact tracking, and honest communication. We build trust through actions, not words.",
      colour: "blue"
    },
    {
      icon: Heart,
      title: "Genuine Connection",
      description: "Technology enables, but people connect. We create the space for authentic relationships that technology alone cannot replicate.",
      colour: "purple"
    },
    {
      icon: TrendingUp,
      title: "Measurable Impact",
      description: "Every volunteer hour, every donation, every act of kindness—tracked, verified, and celebrated. Real impact, not empty metrics.",
      colour: "green"
    }
  ];

  const getColourClasses = (colour: string) => {
    const colours: Record<string, { bg: string; icon: string }> = {
      teal: { bg: "bg-teal-100 dark:bg-teal-900/20", icon: "text-teal-600 dark:text-teal-400" },
      blue: { bg: "bg-blue-100 dark:bg-blue-900/20", icon: "text-blue-600 dark:text-blue-400" },
      purple: { bg: "bg-purple-100 dark:bg-purple-900/20", icon: "text-purple-600 dark:text-purple-400" },
      green: { bg: "bg-green-100 dark:bg-green-900/20", icon: "text-green-600 dark:text-green-400" },
    };
    return colours[colour] || colours.teal;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 dark:from-background dark:via-background dark:to-background">
      <SEOHead
        title="About SouLVE | UK Social Impact Platform"
        description="SouLVE is a UK-based platform connecting individuals, charities, businesses, and communities. Volunteer, fundraise, and create lasting social impact. Free to join."
        keywords={["about SouLVE", "social impact platform UK", "volunteering platform", "charity platform UK", "community connection", "CSR platform"]}
        url="https://join-soulve.com/about"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About SouLVE</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              We connect people with purpose. A UK platform where communities support one another—through volunteering, fundraising, and genuine connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="gradient" onClick={() => navigate("/auth")}>
                Join SouLVE
              </Button>
              <Button 
                size="lg"
                variant="outline"
                onClick={() => navigate("/how-it-works")}
                className="bg-white text-gray-900 border-white hover:bg-gray-100 hover:text-gray-900"
              >
                How It Works
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4 md:p-6 text-center shadow-sm">
              <p className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="font-medium text-sm md:text-base text-foreground">{stat.label}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.sublabel}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
        </div>
        <Card className="p-8">
          <p className="text-lg text-muted-foreground mb-4">
            SouLVE exists to connect people who want to help with people who need it. We believe everyone has something to give—whether it's time, skills, or practical support—and everyone deserves access to help when life gets difficult.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            We're building a platform where you can offer your skills to neighbours who need them, ask for help without judgment when you're struggling, find volunteer opportunities on your doorstep, and connect with people in your community who share your values.
          </p>
          <p className="text-lg text-muted-foreground">
            Charities find dedicated volunteers. Individuals discover meaningful ways to contribute. Communities come together to support their own. Just people helping people, with the technology to make it happen.
          </p>
        </Card>
      </section>

      {/* Values Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These aren't aspirations—they're commitments that shape every feature we build and every decision we make.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const colours = getColourClasses(value.colour);
              return (
                <Card key={index} className="p-6">
                  <div className={`rounded-full ${colours.bg} p-3 w-fit mb-4`}>
                    <value.icon className={`h-6 w-6 ${colours.icon}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
        </div>
        <div className="space-y-6">
          <Card className="p-8">
            <p className="text-lg text-muted-foreground mb-4">
              SouLVE was born from a simple observation: good people want to help, but finding the right opportunities is frustratingly difficult. At the same time, people who need support often don't know where to turn or feel uncomfortable asking.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We set out to solve both problems—not with another directory or database, but with a platform that genuinely connects neighbours. Where someone with DIY skills can help an elderly neighbour fix a fence. Where a single parent can ask for help with school pickups without stigma. Where a retiree can find a local food bank that needs their experience.
            </p>
            <p className="text-lg text-muted-foreground">
              SouLVE connects individuals, charities, businesses, and community groups. Every volunteer hour is tracked. Every act of kindness is celebrated. Because when good is visible, good multiplies.
            </p>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How People Use SouLVE</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're offering help or asking for it, SouLVE connects you with your local community.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3 w-fit mx-auto mb-4">
                <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="font-semibold mb-2">Offer Help</h3>
              <p className="text-sm text-muted-foreground">
                Share your skills and time with neighbours who need them. From gardening to admin support, every skill matters.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">Ask for Help</h3>
              <p className="text-sm text-muted-foreground">
                Life gets difficult sometimes. Request support from your community without judgment—someone nearby wants to help.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Connect Locally</h3>
              <p className="text-sm text-muted-foreground">
                Find volunteer opportunities, community events, and people near you who share your values.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index} className="p-6">
              <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
              <p className="text-sm text-muted-foreground">{faq.answer}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-primary to-secondary text-white border-0">
          <h2 className="text-3xl font-bold mb-4">Ready to Connect With Your Community?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Start offering help, asking for support, or finding volunteer opportunities near you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Create Free Account
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/for-charities")}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              For Charities
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ Free for individuals &nbsp; ✓ GDPR compliant &nbsp; ✓ Location-based discovery
          </p>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default About;
