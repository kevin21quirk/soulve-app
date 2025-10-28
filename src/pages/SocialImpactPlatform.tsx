import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { ArrowRight, Users, TrendingUp, Globe, Heart, BarChart3, Shield } from "lucide-react";
import Footer from "@/components/Footer";

const SocialImpactPlatform = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is a social impact platform?",
      answer: "A social impact platform is a digital ecosystem that connects individuals, organizations, and businesses to create measurable positive change in communities. SouLVE enables users to track ESG contributions, run campaigns, and measure real-world impact."
    },
    {
      question: "How does SouLVE measure social impact?",
      answer: "SouLVE uses comprehensive ESG metrics, real-time analytics, and verified contribution tracking to measure social impact. Our platform provides detailed reports on environmental, social, and governance outcomes."
    },
    {
      question: "Who can use SouLVE's social impact platform?",
      answer: "SouLVE is designed for individuals, nonprofits, charities, social enterprises, and corporations looking to create, track, and amplify their social impact. Whether you're running campaigns or measuring ESG performance, SouLVE supports your journey."
    },
    {
      question: "Is SouLVE free to use?",
      answer: "SouLVE offers various plans including free tiers for individuals and small organizations. Our pricing scales with your impact, ensuring accessibility while providing advanced features for larger initiatives."
    }
  ];

  return (
    <>
      <SEOHead
        title="Social Impact Platform | Create Measurable Change | SouLVE"
        description="Transform your social impact initiatives with SouLVE's comprehensive platform. Track ESG contributions, run impactful campaigns, and measure real-world outcomes. Join thousands creating positive change."
        keywords={["social impact platform", "ESG tracking", "social change platform", "impact measurement", "community engagement", "social good technology", "nonprofit platform"]}
        url="https://join-soulve.com/social-impact-platform"
      />
      <FAQSchema faqs={faqs} />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Leading social impact platform enabling measurable positive change through ESG tracking and community engagement",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png"
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              The Social Impact Platform Built for Measurable Change
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of individuals, organizations, and businesses using SouLVE to create, track, and amplify their positive impact on communities worldwide.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Creating Impact <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/about")}>
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SouLVE as Your Social Impact Platform?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Impact Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor your social impact with comprehensive ESG metrics, detailed analytics, and verified contribution tracking in real-time.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Community Engagement</h3>
                <p className="text-muted-foreground">
                  Connect with like-minded changemakers, collaborate on campaigns, and build a network of social impact leaders.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Campaign Management</h3>
                <p className="text-muted-foreground">
                  Launch, manage, and scale impactful campaigns with integrated tools for fundraising, volunteer coordination, and impact reporting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Connect your local initiatives to global movements and amplify your impact through our international network of changemakers.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Purpose-Driven</h3>
                <p className="text-muted-foreground">
                  Built specifically for social good, every feature is designed to maximize your positive impact on communities and the planet.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified & Secure</h3>
                <p className="text-muted-foreground">
                  Trust in our verified impact data, secure donation processing, and transparent reporting systems for all stakeholders.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-lg my-16">
          <h2 className="text-3xl font-bold text-center mb-12">Who Benefits from SouLVE?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-3">For Individuals</h3>
              <p className="text-muted-foreground mb-4">
                Track your personal social impact, participate in campaigns, volunteer opportunities, and connect with causes you care about.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Nonprofits & Charities</h3>
              <p className="text-muted-foreground mb-4">
                Run fundraising campaigns, manage volunteers, track donations, and demonstrate impact to donors with comprehensive reporting.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Social Enterprises</h3>
              <p className="text-muted-foreground mb-4">
                Measure your social and environmental impact, engage stakeholders, and showcase your ESG performance to investors and customers.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Corporations</h3>
              <p className="text-muted-foreground mb-4">
                Manage CSR programs, track employee volunteering, report on ESG metrics, and demonstrate corporate social responsibility.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Amplify Your Social Impact?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the leading social impact platform and start creating measurable change today.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Get Started Free <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default SocialImpactPlatform;
