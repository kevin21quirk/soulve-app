import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { ArrowRight, Building2, Users, BarChart3, Award, Target, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";

const CorporateSocialResponsibility = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is Corporate Social Responsibility (CSR)?",
      answer: "CSR is a business model where companies integrate social and environmental concerns into their operations. SouLVE helps organizations implement, track, and report on CSR initiatives including employee volunteering, charitable giving, ESG compliance, and community engagement."
    },
    {
      question: "Why is CSR important for businesses?",
      answer: "CSR improves brand reputation, attracts conscious consumers and investors, enhances employee engagement, ensures regulatory compliance, and demonstrates commitment to stakeholders. SouLVE makes CSR implementation measurable and impactful."
    },
    {
      question: "How does SouLVE help with CSR programs?",
      answer: "SouLVE provides end-to-end CSR management including program setup, employee engagement tools, donation tracking, volunteer coordination, ESG reporting, and verified impact measurement—all in one integrated platform."
    },
    {
      question: "Can small businesses use SouLVE for CSR?",
      answer: "Absolutely. SouLVE is designed for organizations of all sizes, from small businesses starting their first CSR initiative to large enterprises managing complex global programs. Our scalable platform grows with your CSR ambitions."
    }
  ];

  return (
    <>
      <SEOHead
        title="Corporate Social Responsibility Platform | CSR Program Management | SouLVE"
        description="Transform your CSR strategy with SouLVE's comprehensive platform. Manage employee volunteering, track charitable giving, report ESG metrics, and demonstrate measurable corporate social impact."
        keywords={["corporate social responsibility", "CSR platform", "CSR program management", "employee volunteering", "corporate giving", "ESG compliance", "CSR reporting", "corporate philanthropy"]}
        url="https://join-soulve.com/corporate-social-responsibility"
      />
      <FAQSchema faqs={faqs} />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Comprehensive corporate social responsibility platform for CSR program management and impact tracking",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png"
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              Corporate Social Responsibility Platform for Modern Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Launch, manage, and scale your CSR programs with SouLVE. Engage employees, track impact, ensure ESG compliance, and demonstrate your commitment to corporate social responsibility.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Your CSR Program <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                Book a Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Complete CSR Program Management</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Building2 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Corporate Giving Programs</h3>
                <p className="text-muted-foreground">
                  Manage corporate donations, matching gift programs, and charitable partnerships with transparent tracking and automated reporting.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Users className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Employee Volunteering</h3>
                <p className="text-muted-foreground">
                  Coordinate employee volunteer programs, track volunteer hours, and recognize top contributors with integrated engagement tools.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">ESG Reporting</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive ESG reports for stakeholders, investors, and regulators with automated data collection and verified metrics.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Impact Measurement</h3>
                <p className="text-muted-foreground">
                  Track and demonstrate the real-world impact of your CSR initiatives with verified metrics and transparent reporting dashboards.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Target className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Goal Tracking</h3>
                <p className="text-muted-foreground">
                  Set CSR goals, track progress, and ensure alignment with corporate values and sustainability commitments.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Employee Engagement</h3>
                <p className="text-muted-foreground">
                  Boost employee morale and retention with engaging CSR programs that align personal values with corporate mission.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-lg my-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Leading Companies Choose SouLVE for CSR</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-3">Streamline CSR Operations</h3>
              <p className="text-muted-foreground mb-4">
                Manage all CSR activities from one centralized platform—employee giving, volunteering, grants, and impact reporting—saving time and resources.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Enhance Brand Reputation</h3>
              <p className="text-muted-foreground mb-4">
                Demonstrate authentic commitment to social responsibility with verified impact data that builds trust with customers and stakeholders.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Attract & Retain Talent</h3>
              <p className="text-muted-foreground mb-4">
                Engage employees with meaningful CSR programs that align personal values with company mission, improving retention and satisfaction.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Meet ESG Requirements</h3>
              <p className="text-muted-foreground mb-4">
                Satisfy investor and regulatory ESG reporting requirements with automated compliance tracking and verified impact metrics.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Drive Business Value</h3>
              <p className="text-muted-foreground mb-4">
                CSR initiatives increase customer loyalty, attract conscious investors, and create competitive advantage in your market.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Scale Your Impact</h3>
              <p className="text-muted-foreground mb-4">
                Grow your CSR programs from local initiatives to global campaigns with tools that scale across departments and regions.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">CSR Solutions for Every Business Need</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              "Employee Volunteer Programs",
              "Corporate Donation Matching",
              "Community Partnership Management",
              "Skills-Based Volunteering",
              "Disaster Relief Coordination",
              "Sustainability Initiatives",
              "Pro Bono Services Tracking",
              "Charitable Grant Management",
              "Cause Marketing Campaigns"
            ].map((solution, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-center">{solution}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">CSR Platform FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-4">Transform Your Corporate Social Responsibility</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join forward-thinking companies using SouLVE to build meaningful CSR programs that create measurable social impact.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Get Started <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/contact")}>
                Schedule a Demo
              </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default CorporateSocialResponsibility;
