import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Users, TrendingUp, Shield, BarChart3, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForCharities = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Is SouLVE really free for charities?",
      answer: "Yes, absolutely. 100% of donations reach your charity with no platform fees. We believe in maximising impact, not profit."
    },
    {
      question: "Do we need to be a registered charity?",
      answer: "Yes, you'll need a valid Charity Commission registration number to verify your organisation on SouLVE."
    },
    {
      question: "Can we claim Gift Aid on donations?",
      answer: "Yes, SouLVE makes Gift Aid declarations simple for donors, helping you boost donations by 25% at no extra cost."
    },
    {
      question: "How do we receive donations?",
      answer: "Donations are transferred directly to your charity's bank account. You maintain full control and transparency."
    },
    {
      question: "Can we manage volunteers through SouLVE?",
      answer: "Yes, our volunteer management tools help you post opportunities, track hours, coordinate events, and recognise contributions."
    },
    {
      question: "What impact reporting features are available?",
      answer: "Generate comprehensive impact reports for trustees, funders, and the Charity Commission. Track donations, volunteer hours, campaign reach, and beneficiary outcomes all in one place."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
      <SEOHead
        title="For Charities | Free Fundraising & Donor Management"
        description="Free fundraising platform for UK charities. 100% of donations reach your cause. Manage donors, volunteers & impact reporting. No platform fees. Get started today."
        keywords={["charity fundraising platform UK", "charity donation management", "charity campaign software", "free fundraising tools", "charity volunteer management", "Gift Aid platform"]}
        url="https://join-soulve.com/for-charities"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Charities</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Maximise your impact with free fundraising tools. 100% of donations reach your cause—no platform fees, no hidden charges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Get Started Free
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/auth")}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                Book a Demo
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything Your Charity Needs</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive tools to fundraise, engage supporters, manage volunteers, and demonstrate impact—all in one platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Zero Platform Fees</h3>
            <p className="text-sm text-muted-foreground">
              100% of donations go directly to your charity. No hidden charges, no monthly fees. We believe every penny should fund your mission.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Automatic Gift Aid</h3>
            <p className="text-sm text-muted-foreground">
              Boost donations by 25% with seamless Gift Aid declarations. We handle the admin so you can focus on your cause.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Volunteer Management</h3>
            <p className="text-sm text-muted-foreground">
              Post opportunities, track hours, coordinate events, and recognise your volunteers. Build a thriving community of supporters.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Impact Reporting</h3>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive reports for trustees, funders, and the Charity Commission. Demonstrate your impact with data-driven insights.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <Shield className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Donor Trust & Transparency</h3>
            <p className="text-sm text-muted-foreground">
              Build trust with transparent reporting. Donors see exactly where their money goes, increasing retention and recurring giving.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-3 w-fit mb-4">
              <Zap className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Quick Setup</h3>
            <p className="text-sm text-muted-foreground">
              Launch your first campaign in minutes. No technical skills required. Our intuitive platform gets you fundraising fast.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground">Get started in four simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-teal-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Register Your Charity</h3>
              <p className="text-sm text-muted-foreground">Sign up and verify your Charity Commission number. Takes less than 5 minutes.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-teal-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">Tell your story, add photos, and showcase your impact. Make donors fall in love with your cause.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-teal-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Launch Campaigns</h3>
              <p className="text-sm text-muted-foreground">Create fundraising campaigns, post volunteer opportunities, and engage your community.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-teal-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Track & Report</h3>
              <p className="text-sm text-muted-foreground">Monitor donations, volunteer hours, and impact metrics. Generate reports for stakeholders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Trusted by UK Charities</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Charities across the UK are using SouLVE to connect with supporters, 
            manage volunteers, and amplify their impact in local communities.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Maximise Your Impact?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of UK charities raising funds, managing volunteers, and demonstrating impact on SouLVE.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Get Started Free
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Contact Our Team
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ Free forever &nbsp; ✓ No platform fees &nbsp; ✓ Setup in minutes &nbsp; ✓ GDPR compliant
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForCharities;