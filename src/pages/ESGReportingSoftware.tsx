import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { ArrowRight, FileText, BarChart3, Shield, Clock, CheckCircle, TrendingUp } from "lucide-react";
import Footer from "@/components/Footer";

const ESGReportingSoftware = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "What is ESG reporting software?",
      answer: "ESG reporting software helps organizations track, measure, and report on their Environmental, Social, and Governance performance. SouLVE provides automated ESG metrics, compliance tracking, and comprehensive reporting tools."
    },
    {
      question: "Why do I need ESG reporting tools?",
      answer: "ESG reporting is increasingly required by investors, regulators, and stakeholders. Our software simplifies compliance, demonstrates corporate responsibility, and helps attract conscious investors and customers."
    },
    {
      question: "How does SouLVE's ESG reporting work?",
      answer: "SouLVE automatically tracks your ESG activities, calculates key metrics, and generates compliant reports. Our platform integrates with your existing systems to provide real-time ESG performance data."
    },
    {
      question: "Is SouLVE compliant with ESG reporting standards?",
      answer: "Yes, SouLVE aligns with major ESG reporting frameworks including GRI, SASB, and TCFD. Our software ensures your reports meet regulatory requirements and stakeholder expectations."
    }
  ];

  return (
    <>
      <SEOHead
        title="ESG Reporting Software | Automated ESG Metrics & Compliance | SouLVE"
        description="Simplify ESG reporting with SouLVE's automated software. Track environmental, social, and governance metrics, generate compliant reports, and demonstrate corporate responsibility effortlessly."
        keywords={["ESG reporting software", "ESG metrics", "ESG compliance", "environmental reporting", "social impact reporting", "governance reporting", "sustainability software", "ESG analytics"]}
        url="https://join-soulve.com/esg-reporting-software"
      />
      <FAQSchema faqs={faqs} />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Advanced ESG reporting software for automated compliance and sustainability tracking",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png"
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              ESG Reporting Software That Simplifies Compliance
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Automate your ESG metrics tracking, generate compliant reports, and demonstrate your commitment to environmental, social, and governance excellence with SouLVE's comprehensive reporting software.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Free Trial <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/esg-leaders")}>
                View ESG Leaders
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Comprehensive ESG Reporting Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Automated ESG Metrics</h3>
                <p className="text-muted-foreground">
                  Track environmental impact, social contributions, and governance practices automatically with real-time data integration and analytics.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Compliant Report Generation</h3>
                <p className="text-muted-foreground">
                  Generate reports aligned with GRI, SASB, TCFD, and other major ESG reporting frameworks with one click.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Verified Data Security</h3>
                <p className="text-muted-foreground">
                  Enterprise-grade security ensures your ESG data is protected, verified, and audit-ready at all times.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Real-Time Dashboards</h3>
                <p className="text-muted-foreground">
                  Monitor your ESG performance in real-time with intuitive dashboards and customizable visualizations for stakeholders.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Compliance Tracking</h3>
                <p className="text-muted-foreground">
                  Stay ahead of regulatory requirements with automated compliance monitoring and alerts for ESG reporting deadlines.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Performance Benchmarking</h3>
                <p className="text-muted-foreground">
                  Compare your ESG performance against industry benchmarks and identify opportunities for improvement.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-lg my-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Organizations Choose SouLVE for ESG Reporting</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-3">Save 80% of Reporting Time</h3>
              <p className="text-muted-foreground mb-4">
                Automate data collection and report generation, reducing manual work from weeks to hours.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Meet Regulatory Requirements</h3>
              <p className="text-muted-foreground mb-4">
                Stay compliant with evolving ESG regulations and reporting standards without constant manual updates.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Attract Conscious Investors</h3>
              <p className="text-muted-foreground mb-4">
                Demonstrate your ESG commitment with transparent, verified data that builds investor confidence.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Improve ESG Performance</h3>
              <p className="text-muted-foreground mb-4">
                Identify gaps, track progress, and make data-driven decisions to enhance your ESG scores over time.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">ESG Reporting Software FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-4">Transform Your ESG Reporting Today</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join leading organizations using SouLVE to automate ESG compliance and demonstrate corporate responsibility.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Start Your Free Trial <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ESGReportingSoftware;
