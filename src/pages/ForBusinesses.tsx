import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Building2, Users, BarChart3, Award, Shield, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForBusinesses = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does SouLVE help with ESG reporting?",
      answer: "Our platform automatically tracks and reports your corporate social impact activities aligned with UK ESG frameworks. Generate comprehensive reports for stakeholders, investors, and regulatory compliance including Companies Act 2006 section 172 statements."
    },
    {
      question: "Can we track employee volunteering hours?",
      answer: "Yes, employees log their volunteering through SouLVE, providing your business with verified data on volunteer hours, causes supported, and community impact for ESG reporting."
    },
    {
      question: "What is matched giving?",
      answer: "When your employees donate to causes, your business can automatically match their contributions—doubling the impact whilst building employee engagement and brand reputation."
    },
    {
      question: "How much does it cost?",
      answer: "SouLVE offers flexible pricing based on company size. Contact us for a tailored quote. All employee donations reach charities with zero platform fees."
    },
    {
      question: "Can we create our own corporate campaigns?",
      answer: "Absolutely. Launch branded campaigns for your chosen causes, engage employees and customers, and showcase your corporate social responsibility transparently."
    },
    {
      question: "Is SouLVE compliant with UK regulations?",
      answer: "Yes, we're fully GDPR compliant and support reporting requirements under the Companies Act 2006, Modern Slavery Act, and other UK ESG regulations."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <SEOHead
        title="For Businesses | Corporate Social Responsibility & ESG Solutions"
        description="Transform your CSR strategy with comprehensive ESG reporting, employee volunteering, and corporate giving. Meet UK compliance requirements. Request a demo today."
        keywords={["corporate social responsibility UK", "employee volunteering platform", "CSR programme management", "ESG reporting software", "corporate giving", "matched giving platform"]}
        url="https://join-soulve.com/for-businesses"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-blue-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Businesses</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Build a world-class CSR programme. Engage employees, demonstrate ESG impact, and meet UK compliance requirements—all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Request a Demo
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Complete Corporate Social Responsibility Solution</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            From ESG reporting to employee engagement—everything your business needs to make a measurable social impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Comprehensive ESG Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Automated ESG reporting aligned with UK frameworks. Track social impact, volunteer hours, and charitable giving. Generate reports for stakeholders, investors, and regulatory compliance.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-indigo-100 dark:bg-indigo-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Employee Volunteering Programme</h3>
            <p className="text-sm text-muted-foreground">
              Launch employee volunteering initiatives with tracking, team challenges, and impact measurement. Boost engagement, retention, and workplace culture.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Corporate Giving & Matched Funding</h3>
            <p className="text-sm text-muted-foreground">
              Implement matched giving programmes where your company matches employee donations—doubling impact whilst strengthening company culture.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">UK Regulatory Compliance</h3>
            <p className="text-sm text-muted-foreground">
              Meet Companies Act 2006, Modern Slavery Act, and other UK ESG requirements. Demonstrate compliance with verified data and audit trails.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <Award className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Brand Reputation & Visibility</h3>
            <p className="text-sm text-muted-foreground">
              Showcase your social impact publicly. Build trust with customers, attract conscious consumers, and differentiate your brand through authentic CSR.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3 w-fit mb-4">
              <Building2 className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Stakeholder Engagement</h3>
            <p className="text-sm text-muted-foreground">
              Transparent reporting for board members, investors, customers, and employees. Demonstrate tangible social impact with data-driven insights.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Launch your CSR programme in weeks, not months</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Setup & Onboarding</h3>
              <p className="text-sm text-muted-foreground">Our team helps configure your corporate account, branding, and CSR goals.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Invite Employees</h3>
              <p className="text-sm text-muted-foreground">Roll out to your workforce with custom communications, training, and support materials.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Launch Programmes</h3>
              <p className="text-sm text-muted-foreground">Create volunteering days, matched giving, corporate campaigns, and team challenges.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-blue-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Track & Report</h3>
              <p className="text-sm text-muted-foreground">Generate ESG reports, monitor engagement, and demonstrate impact to stakeholders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Trusted by Leading UK Businesses</h2>
            <p className="text-muted-foreground mb-6">
              From SMEs to FTSE 100 companies, businesses across sectors trust SouLVE for their CSR and ESG reporting needs.
            </p>
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div>
                <div className="text-3xl font-bold text-blue-600">500+</div>
                <div className="text-sm text-muted-foreground">Companies</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-indigo-600">100K+</div>
                <div className="text-sm text-muted-foreground">Employees Engaged</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">£5M+</div>
                <div className="text-sm text-muted-foreground">Corporate Giving</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* FAQ */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-2">{faq.question}</h3>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Transform Your Corporate Social Responsibility</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join forward-thinking businesses using SouLVE to engage employees, demonstrate ESG impact, and meet compliance requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Request a Demo
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Download ESG Guide
            </Button>
          </div>
          <p className="text-sm text-blue-100 mt-6">
            ✓ UK compliance ready &nbsp; ✓ Automated ESG reporting &nbsp; ✓ Employee engagement &nbsp; ✓ Dedicated support
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForBusinesses;