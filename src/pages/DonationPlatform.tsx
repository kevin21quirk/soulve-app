import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import StructuredData from "@/components/seo/StructuredData";
import { ArrowRight, DollarSign, Shield, Heart, BarChart3, Clock, CheckCircle } from "lucide-react";
import Footer from "@/components/Footer";

const DonationPlatform = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Is SouLVE a safe donation platform?",
      answer: "Yes, SouLVE uses enterprise-grade security, encrypted payment processing, and verified organizations to ensure your donations are safe and reach their intended recipients. All transactions are protected and transparent."
    },
    {
      question: "What types of causes can I donate to on SouLVE?",
      answer: "SouLVE supports donations to charities, nonprofits, social enterprises, community projects, environmental causes, educational programs, disaster relief, and any verified social good initiative."
    },
    {
      question: "Can I track the impact of my donations?",
      answer: "Absolutely. SouLVE provides detailed impact tracking for every donation, showing you exactly how your contribution creates real-world change with verified metrics and progress updates."
    },
    {
      question: "Are donations on SouLVE tax-deductible?",
      answer: "Many organizations on SouLVE are registered charities offering tax-deductible donations. Check the specific organization's profile for their tax status and donation receipt information."
    }
  ];

  return (
    <>
      <SEOHead
        title="Online Donation Platform | Secure Charitable Giving | SouLVE"
        description="Donate to verified charities and social causes on SouLVE's secure donation platform. Track your impact, support meaningful causes, and create measurable positive change with every contribution."
        keywords={["donation platform", "online donations", "charity donations", "secure giving platform", "nonprofit donations", "charitable giving", "donation tracking", "impact donations"]}
        url="https://join-soulve.com/donation-platform"
      />
      <FAQSchema faqs={faqs} />
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Secure online donation platform connecting donors with verified social impact causes",
          url: "https://join-soulve.com",
          logo: "https://join-soulve.com/og-image.png"
        }}
      />

      <div className="min-h-screen bg-gradient-to-b from-background to-muted">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] bg-clip-text text-transparent">
              The Donation Platform Where Your Generosity Creates Measurable Impact
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Support verified charities and social causes with secure online donations. Track your impact in real-time and see exactly how your contributions create positive change.
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
                Start Donating <ArrowRight className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/")}>
                Browse Causes
              </Button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Why Donate Through SouLVE?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <Shield className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Secure & Verified</h3>
                <p className="text-muted-foreground">
                  All organizations are verified, donations are encrypted, and every transaction is protected by enterprise-grade security.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <BarChart3 className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Impact Tracking</h3>
                <p className="text-muted-foreground">
                  See the real-world impact of your donations with verified metrics, progress updates, and transparent reporting on outcomes.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Heart className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Diverse Causes</h3>
                <p className="text-muted-foreground">
                  Support charities, nonprofits, community projects, environmental initiatives, and social enterprises all in one place.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <DollarSign className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Transparent Fees</h3>
                <p className="text-muted-foreground">
                  Low, transparent platform fees ensure maximum funds reach your chosen causes. No hidden costs or surprise charges.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Recurring Donations</h3>
                <p className="text-muted-foreground">
                  Set up monthly recurring donations to provide sustained support for causes you care about with automated giving.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <CheckCircle className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-3">Donation Receipts</h3>
                <p className="text-muted-foreground">
                  Receive instant donation receipts for tax purposes, track your giving history, and manage all donations in one dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-16 bg-muted/50 rounded-lg my-16">
          <h2 className="text-3xl font-bold text-center mb-12">How SouLVE Donation Platform Works</h2>
          <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Browse Causes</h3>
              <p className="text-muted-foreground text-sm">
                Discover verified charities and social impact campaigns aligned with your values.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Choose Amount</h3>
              <p className="text-muted-foreground text-sm">
                Select your donation amount and frequency (one-time or recurring monthly donations).
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Secure Payment</h3>
              <p className="text-muted-foreground text-sm">
                Complete your donation with encrypted payment processing and instant confirmation.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-primary-foreground w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="text-lg font-semibold mb-2">Track Impact</h3>
              <p className="text-muted-foreground text-sm">
                Receive updates on how your donation creates real-world change with verified impact metrics.
              </p>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Benefits of Donating Through SouLVE</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-xl font-semibold mb-3">For Individual Donors</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Track all donations in one centralized dashboard</li>
                <li>• See real-world impact with verified metrics</li>
                <li>• Receive tax-deductible receipts instantly</li>
                <li>• Set up recurring donations for sustained impact</li>
                <li>• Connect with like-minded donors and causes</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">For Organizations</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Receive donations with low transparent fees</li>
                <li>• Access donor management tools</li>
                <li>• Demonstrate impact with automatic reporting</li>
                <li>• Build recurring donor relationships</li>
                <li>• Reach engaged donors actively seeking causes</li>
              </ul>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Donation Platform FAQs</h2>
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
            <h2 className="text-3xl font-bold mb-4">Start Making a Difference Today</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of donors using SouLVE to create measurable positive change. Your generosity matters.
            </p>
            <Button size="lg" onClick={() => navigate("/auth")} className="gap-2">
              Make Your First Donation <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default DonationPlatform;
