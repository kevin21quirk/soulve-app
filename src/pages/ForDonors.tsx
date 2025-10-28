import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, TrendingUp, Shield, Eye, PiggyBank, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForDonors = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Does 100% of my donation really reach the charity?",
      answer: "Yes, absolutely. SouLVE charges zero platform fees on donations. Every penny you give goes directly to the charity. We cover our costs through optional corporate subscriptions and premium features for businesses."
    },
    {
      question: "How does Gift Aid work on SouLVE?",
      answer: "When you donate, simply tick the Gift Aid declaration box. The charity can then claim an extra 25p for every £1 you donate from HMRC at no cost to you. It's completely free money for charities."
    },
    {
      question: "Can I see where my donation is going?",
      answer: "Yes, charities on SouLVE provide impact updates showing exactly how donations are being used. You'll receive notifications when campaigns reach milestones and see the real-world outcomes your donation supports."
    },
    {
      question: "Are charities on SouLVE verified?",
      answer: "Every charity on SouLVE is verified against the Charity Commission register. We verify registration numbers, ensure they're compliant, and only list legitimate UK registered charities."
    },
    {
      question: "Can I set up recurring monthly donations?",
      answer: "Yes, you can set up regular monthly donations to your favourite charities. You can adjust or cancel anytime through your dashboard."
    },
    {
      question: "Will I get a receipt for tax purposes?",
      answer: "Yes, you'll receive a digital receipt immediately after donating, and your donation history is available anytime in your account for tax records."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      <SEOHead
        title="For Donors | Donate to Verified UK Charities | 100% Goes to Charity"
        description="Donate to verified UK charities with 100% of your donation reaching the cause. Track your giving, enable Gift Aid automatically, and see your real impact. Start giving today."
        keywords={["donation platform UK", "charitable giving", "impact donation tracking", "Gift Aid donations", "donate to UK charities", "recurring donations"]}
        url="https://join-soulve.com/for-donors"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Donors</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Give with confidence. 100% of your donation reaches the charity. Track your impact. Make every penny count.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/campaigns")}>
                Start Donating
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                Explore Charities
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Donate Through SouLVE?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Transparent, secure, and impactful giving. Every donation makes a real difference.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">100% to Charity</h3>
            <p className="text-sm text-muted-foreground">
              Zero platform fees. Every penny you donate goes directly to the charity. No deductions, no hidden charges. Your generosity makes maximum impact.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-rose-100 dark:bg-rose-900/20 p-3 w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-rose-600 dark:text-rose-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Automatic Gift Aid</h3>
            <p className="text-sm text-muted-foreground">
              Boost your donation by 25% at no cost to you. Simple one-click Gift Aid declarations mean charities get even more from your generosity.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Eye className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Your Impact</h3>
            <p className="text-sm text-muted-foreground">
              See exactly where your money goes. Receive impact updates from charities showing the real-world outcomes your donation supports.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Verified Charities Only</h3>
            <p className="text-sm text-muted-foreground">
              Every charity is verified against the Charity Commission register. Donate with confidence knowing your money goes to legitimate, compliant organisations.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <PiggyBank className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Flexible Giving Options</h3>
            <p className="text-sm text-muted-foreground">
              One-off donations, monthly recurring gifts, or supporting multiple campaigns. Give in the way that suits you best.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Tax-Efficient Giving</h3>
            <p className="text-sm text-muted-foreground">
              Download donation receipts anytime for tax records. Track your annual giving in one place for simplified tax planning.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How to Donate</h2>
            <p className="text-muted-foreground">Make a difference in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-pink-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Find Your Cause</h3>
              <p className="text-sm text-muted-foreground">Browse thousands of verified UK charities and campaigns. Filter by cause, location, or urgency.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-pink-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Make Your Donation</h3>
              <p className="text-sm text-muted-foreground">Choose your amount, add Gift Aid if eligible, and donate securely. 100% reaches the charity.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-pink-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">See Your Impact</h3>
              <p className="text-sm text-muted-foreground">Receive updates from the charity showing how your donation is making a real difference.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Join a Community of Thoughtful Donors</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Support verified UK charities with confidence. Track your giving, see real impact, 
            and connect with causes that matter to you.
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
          <h2 className="text-3xl font-bold mb-4">Start Making a Difference Today</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of donors supporting verified UK charities on SouLVE. Every donation makes maximum impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/campaigns")}>
              Start Donating
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Browse Charities
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ 100% to charity &nbsp; ✓ Automatic Gift Aid &nbsp; ✓ Verified charities &nbsp; ✓ Track your impact
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForDonors;