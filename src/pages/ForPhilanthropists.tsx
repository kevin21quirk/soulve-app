import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Crown, Target, LineChart, Users, FileText, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForPhilanthropists = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How does SouLVE support strategic philanthropy?",
      answer: "Our platform provides comprehensive data and impact metrics to inform your giving decisions. Access verified charity financials, track outcomes across your portfolio, and measure long-term impact against your philanthropic goals."
    },
    {
      question: "Can I connect with other major donors?",
      answer: "Yes, our private philanthropist network facilitates collaboration between major donors. Share insights, co-fund initiatives, and leverage collective expertise whilst maintaining confidentiality where required."
    },
    {
      question: "How do you handle large donations and grants?",
      answer: "We support donations of all sizes, including multi-year grants and restricted funding. Our team works directly with you and recipient organisations to structure agreements, set milestones, and ensure proper governance."
    },
    {
      question: "Can I manage my charitable trust or foundation through SouLVE?",
      answer: "Yes, our philanthropist accounts support foundation management including trustee access, grant application processing, impact reporting, and compliance documentation for Charity Commission requirements."
    },
    {
      question: "What due diligence do you provide on charities?",
      answer: "We provide comprehensive charity profiles including Charity Commission data, financial health indicators, governance quality, impact track record, and third-party ratings. Our team can also conduct bespoke due diligence for major gifts."
    },
    {
      question: "Is my philanthropic activity kept confidential?",
      answer: "Absolutely. You control your visibility settings. Make anonymous donations, limit public profile information, and engage privately with charities. We respect your preferences for discretion."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50">
      <SEOHead
        title="For Philanthropists | Strategic Giving & Major Donor Platform UK"
        description="Strategic philanthropy platform for major donors in the UK. Data-driven giving, charity due diligence, impact measurement, and donor collaboration. Join the network today."
        keywords={["philanthropy platform UK", "major donor platform", "strategic giving", "charity due diligence", "philanthropic foundations", "charitable trusts UK"]}
        url="https://join-soulve.com/for-philanthropists"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Philanthropists</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Strategic, data-driven philanthropy. Connect with high-impact charities, collaborate with fellow donors, and measure your legacy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Join the Network
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                Book Private Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Strategic Philanthropy Tools for Major Donors</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Make informed giving decisions with comprehensive data, expert insights, and collaborative opportunities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-amber-100 dark:bg-amber-900/20 p-3 w-fit mb-4">
              <Target className="h-6 w-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Data-Driven Decision Making</h3>
            <p className="text-sm text-muted-foreground">
              Access comprehensive charity profiles, financial health indicators, impact metrics, and third-party ratings to inform strategic giving decisions.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <LineChart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Portfolio Impact Measurement</h3>
            <p className="text-sm text-muted-foreground">
              Track outcomes across your entire philanthropic portfolio. Measure long-term impact, compare interventions, and optimise your giving strategy.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Private Donor Network</h3>
            <p className="text-sm text-muted-foreground">
              Connect with fellow philanthropists, co-fund initiatives, share insights, and leverage collective expertise whilst maintaining confidentiality.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Comprehensive Due Diligence</h3>
            <p className="text-sm text-muted-foreground">
              Verified Charity Commission data, governance quality assessments, financial analysis, and bespoke due diligence for major gifts.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Briefcase className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Foundation Management</h3>
            <p className="text-sm text-muted-foreground">
              Manage charitable trusts and foundations including grant applications, trustee collaboration, compliance reporting, and Charity Commission requirements.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-3 w-fit mb-4">
              <Crown className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Direct Charity Engagement</h3>
            <p className="text-sm text-muted-foreground">
              Connect directly with charity leadership, understand strategic priorities, co-create impact frameworks, and maintain ongoing relationships.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Your Philanthropic Journey</h2>
            <p className="text-muted-foreground">Strategic giving in four stages</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-amber-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Research & Discovery</h3>
              <p className="text-sm text-muted-foreground">Explore high-impact charities, analyse data, and identify organisations aligned with your values.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-amber-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Due Diligence</h3>
              <p className="text-sm text-muted-foreground">Access comprehensive charity profiles, financial health reports, and governance assessments.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-amber-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Strategic Giving</h3>
              <p className="text-sm text-muted-foreground">Structure gifts, set milestones, establish reporting requirements, and engage charity leadership.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-amber-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Impact Monitoring</h3>
              <p className="text-sm text-muted-foreground">Track outcomes, receive comprehensive reports, measure against goals, and optimise your portfolio.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">A Network for Strategic Philanthropists</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect with like-minded philanthropists, access verified charity data, 
            and deploy resources strategically for measurable social impact.
          </p>
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
        <Card className="p-12 text-center bg-gradient-to-r from-primary to-secondary text-white">
          <h2 className="text-3xl font-bold mb-4">Elevate Your Philanthropic Impact</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join a private network of strategic philanthropists using data and collaboration to maximise social impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Join the Network
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Schedule Consultation
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ Strategic insights &nbsp; ✓ Private network &nbsp; ✓ Due diligence support &nbsp; ✓ Impact measurement
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForPhilanthropists;