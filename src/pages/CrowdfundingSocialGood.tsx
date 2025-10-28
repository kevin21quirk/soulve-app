import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { ArrowRight, Heart, Users, Target, TrendingUp, Shield, Globe } from "lucide-react";
import Footer from "@/components/Footer";

const CrowdfundingSocialGood = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What makes SouLVE different from other crowdfunding platforms?",
      answer: "SouLVE is purpose-built for social good. Unlike generic crowdfunding platforms, we focus exclusively on social impact campaigns, provide ESG tracking, and connect you with a community of changemakers dedicated to positive social change."
    },
    {
      question: "What types of social good campaigns can I run on SouLVE?",
      answer: "You can run campaigns for charities, community projects, environmental initiatives, social enterprises, nonprofit fundraising, disaster relief, educational programs, and any cause focused on creating positive social impact."
    },
    {
      question: "How much does SouLVE crowdfunding cost?",
      answer: "SouLVE offers competitive transparent pricing with lower fees than traditional crowdfunding platforms. We believe more money should go to your cause, not platform fees. View our pricing page for detailed information."
    },
    {
      question: "How does SouLVE ensure campaign transparency?",
      answer: "Every campaign on SouLVE includes verified impact tracking, transparent fund allocation, and real-time progress updates. Donors can see exactly how their contributions create measurable social change."
    }
  ];

  return (
    <>
      <SEOHead
        title="Crowdfunding for Social Good | Fundraising Platform for Charities | SouLVE"
        description="Launch impactful crowdfunding campaigns for social causes on SouLVE. The leading fundraising platform for charities, nonprofits, and changemakers creating positive social impact."
        keywords={["crowdfunding social good", "charity fundraising platform", "nonprofit crowdfunding", "social impact fundraising", "community fundraising", "cause crowdfunding", "donation platform"]}
        url="https://join-soulve.com/crowdfunding-social-good"
      />
      <FAQSchema faqs={faqs} />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Leading crowdfunding platform for social good and charitable causes",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png"
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              Crowdfunding Platform Built for Social Good
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Raise funds for causes that matter. SouLVE connects your social impact campaigns with passionate donors and changemakers ready to support meaningful change.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Your Campaign <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                Explore Campaigns
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SouLVE for Social Good Crowdfunding?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Purpose-Built for Impact</h3>
                <p className="text-muted-foreground">
                  Unlike generic crowdfunding platforms, SouLVE is designed specifically for social good campaigns with tools tailored for nonprofits and charities.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Engaged Community</h3>
                <p className="text-muted-foreground">
                  Connect with donors and supporters who are actively seeking social impact opportunities and are passionate about creating positive change.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Impact Tracking</h3>
                <p className="text-muted-foreground">
                  Show donors the real-world impact of their contributions with verified metrics, progress updates, and transparent reporting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Campaign Analytics</h3>
                <p className="text-muted-foreground">
                  Optimize your fundraising with detailed analytics on donor behavior, campaign performance, and engagement metrics.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure & Transparent</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security for donations, transparent fund allocation, and verified campaign information builds donor trust.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Globe className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Global Reach</h3>
                <p className="text-muted-foreground">
                  Reach donors worldwide and connect your local cause to a global community of supporters dedicated to social good.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-lg my-16">
          <h2 className="text-3xl font-bold text-center mb-12">Launch Your Social Good Campaign in 3 Steps</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-3">Create Your Campaign</h3>
              <p className="text-muted-foreground">
                Set up your crowdfunding campaign with compelling storytelling, clear goals, and impact metrics in minutes.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-3">Share & Engage</h3>
              <p className="text-muted-foreground">
                Share your campaign with our engaged community and your networks. Update supporters and build momentum.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-3">Track Impact</h3>
              <p className="text-muted-foreground">
                Receive funds, demonstrate impact with verified metrics, and show donors the real-world change they've enabled.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Perfect for Every Type of Social Good Initiative</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {["Charity Fundraising", "Community Projects", "Environmental Causes", "Educational Programs", "Disaster Relief", "Healthcare Initiatives", "Social Enterprises", "Nonprofit Campaigns"].map((useCase, index) => (
              <Card key={index}>
                <CardContent className="pt-6 text-center">
                  <h3 className="font-semibold">{useCase}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Crowdfunding FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-4">Ready to Fundraise for Social Good?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of successful campaigns on SouLVE and start making a difference today.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Launch Your Campaign <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CrowdfundingSocialGood;
