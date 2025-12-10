import { Link, useNavigate } from "react-router-dom";
import { Users, Heart, Shield, TrendingUp, ArrowLeft, MapPin, Building2, Award, CheckCircle, Globe } from "lucide-react";
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
      answer: "SouLVE is a UK-based social impact platform that connects individuals, charities, businesses, and community groups. Whether you're volunteering, fundraising, or seeking support, SouLVE makes it simple to find opportunities, track your impact, and build genuine connections in your community."
    },
    {
      question: "Who can use SouLVE?",
      answer: "Anyone can join SouLVE. Individuals use it to volunteer and donate. Charities use it to recruit volunteers and raise funds. Businesses use it for CSR programmes and employee engagement. Community groups use it to organise events and connect with supporters."
    },
    {
      question: "Is SouLVE free to use?",
      answer: "Yes, SouLVE is free for individuals, charities, and community groups. Businesses have access to premium features for ESG reporting and employee engagement programmes. All donations reach charities with zero platform fees."
    },
    {
      question: "How does the trust system work?",
      answer: "Your trust score reflects your verified contributions—volunteering hours, donations, profile verification, and community engagement. Higher trust unlocks additional features and helps others feel confident connecting with you."
    },
    {
      question: "Where is SouLVE based?",
      answer: "SouLVE Ltd is a registered company in England and Wales. We're headquartered in the UK and built specifically for UK communities, charities, and businesses."
    },
    {
      question: "How is my data protected?",
      answer: "We take data protection seriously. SouLVE is fully GDPR compliant, with robust security measures and transparent privacy practices. Your data is never sold to third parties."
    }
  ];

  const stats = [
    { value: "100%", label: "Donations to charities", sublabel: "Zero platform fees" },
    { value: "UK", label: "Based & registered", sublabel: "England and Wales" },
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
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About SouLVE</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              We connect people with purpose. A UK platform where communities support one another—through volunteering, fundraising, and genuine connection.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Join SouLVE
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/how-it-works")}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
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
            <Card key={index} className="p-4 md:p-6 text-center">
              <p className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="font-medium text-sm md:text-base">{stat.label}</p>
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
            SouLVE exists to make social good simple. We believe everyone has something to give—whether it's time, money, skills, or support—and everyone deserves access to help when they need it.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            We're building a platform where charities find dedicated volunteers, individuals discover meaningful opportunities, businesses demonstrate genuine social impact, and communities come together to support their own.
          </p>
          <p className="text-lg text-muted-foreground">
            No complicated applications. No hidden fees. Just people helping people, with the technology to track and celebrate every contribution.
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
              SouLVE was born from a simple observation: good people want to help, but finding the right opportunities is frustratingly difficult. Charities struggle to recruit volunteers. Businesses want meaningful CSR but lack the tools. Individuals seeking support don't know where to turn.
            </p>
            <p className="text-lg text-muted-foreground mb-4">
              We set out to solve this—not with another directory or database, but with a platform that genuinely connects people. Where a retiree in Manchester can find a local food bank that needs their skills. Where a business in Birmingham can sponsor community initiatives with full transparency. Where someone facing hardship can request help without stigma.
            </p>
            <p className="text-lg text-muted-foreground">
              Today, SouLVE connects individuals, charities, businesses, and community groups across the UK. Every volunteer hour is tracked. Every donation reaches its destination. Every act of kindness is celebrated. Because when good is measured, good multiplies.
            </p>
          </Card>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Company Information</h2>
            <p className="text-muted-foreground">
              SouLVE is a registered company committed to transparency and accountability.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mx-auto mb-4">
                <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">UK Registered</h3>
              <p className="text-sm text-muted-foreground">
                SouLVE Ltd is registered in England and Wales, operating under UK law and regulations.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted-foreground">
                Your data is protected. We follow strict GDPR guidelines and never sell personal information.
              </p>
            </Card>
            <Card className="p-6 text-center">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mx-auto mb-4">
                <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold mb-2">Built for the UK</h3>
              <p className="text-sm text-muted-foreground">
                Designed specifically for UK charities, businesses, and communities. Local focus, national reach.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of people using SouLVE to volunteer, fundraise, and support their communities.
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
            ✓ Free for individuals &nbsp; ✓ UK-based company &nbsp; ✓ Zero donation fees &nbsp; ✓ GDPR compliant
          </p>
        </Card>
      </section>

      <Footer />
    </div>
  );
};

export default About;
