import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Megaphone, HandHeart, FileText, Sparkles, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForCommunityGroups = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Do we need to be a registered charity to use SouLVE?",
      answer: "No! SouLVE welcomes community groups, social enterprises, grassroots organisations, residents' associations, and informal groups—whether you're registered with the Charity Commission or not."
    },
    {
      question: "Is SouLVE free for small community groups?",
      answer: "Yes, absolutely. We offer free accounts for community groups and social enterprises with all the essential tools you need to fundraise, engage volunteers, and share your impact."
    },
    {
      question: "Can we fundraise without being a registered charity?",
      answer: "Yes, with some limitations. Whilst registered charities can collect donations directly, community groups can run crowdfunding campaigns for specific projects, seek in-kind donations, and recruit volunteers."
    },
    {
      question: "How do we recruit volunteers?",
      answer: "Post volunteer opportunities on your profile, detailing what help you need. Community members can apply directly, and you manage applications through your dashboard."
    },
    {
      question: "Can we collaborate with other groups?",
      answer: "Absolutely! Connect with other community groups, share resources, co-host events, and access larger networks for partnerships and funding opportunities."
    },
    {
      question: "What support do you provide for small groups?",
      answer: "We offer free training resources, best practice guides, templates for campaigns, and community support forums where groups share experiences and advice."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-sky-50">
      <SEOHead
        title="For Community Groups | Free Tools for Grassroots Organisations UK"
        description="Free platform for UK community groups and social enterprises. Fundraise, recruit volunteers, share your impact, and connect with supporters. No registration required. Start today."
        keywords={["community group platform UK", "social enterprise fundraising", "grassroots organisation tools", "community group software", "volunteer recruitment platform", "local community groups"]}
        url="https://join-soulve.com/for-community-groups"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-sky-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-cyan-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Community Groups</h1>
            <p className="text-xl text-cyan-100 max-w-3xl mx-auto">
              Free tools for grassroots organisations. Fundraise, recruit volunteers, and amplify your community impact—no charity registration required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Get Started Free
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                See How It Works
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Everything Small Groups Need to Thrive</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Purpose-built tools for community groups, social enterprises, and grassroots organisations making local impact.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-cyan-100 dark:bg-cyan-900/20 p-3 w-fit mb-4">
              <HandHeart className="h-6 w-6 text-cyan-600 dark:text-cyan-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Free Fundraising Tools</h3>
            <p className="text-sm text-muted-foreground">
              Launch crowdfunding campaigns for community projects. No platform fees on donations if you're registered. Simple, transparent fundraising.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-sky-100 dark:bg-sky-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-sky-600 dark:text-sky-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Volunteer Recruitment</h3>
            <p className="text-sm text-muted-foreground">
              Post volunteer opportunities, manage applications, track hours, and build a community of committed supporters around your cause.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <Megaphone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Amplify Your Voice</h3>
            <p className="text-sm text-muted-foreground">
              Share campaigns, events, and impact stories. Reach local supporters and beyond through SouLVE's network of engaged community members.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <FileText className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Simple Reporting for Funders</h3>
            <p className="text-sm text-muted-foreground">
              Generate impact reports showing volunteer hours, funds raised, and community outcomes—perfect for funding applications and stakeholder updates.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <Network className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect & Collaborate</h3>
            <p className="text-sm text-muted-foreground">
              Network with other community groups, share resources, co-host events, and access larger partnerships for funding and support.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <Sparkles className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No Technical Skills Required</h3>
            <p className="text-sm text-muted-foreground">
              Intuitive platform designed for community organisers, not tech experts. Set up your profile and launch campaigns in minutes.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-muted-foreground">Launch your community group presence in four simple steps</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-cyan-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">Sign up free and tell your community story. Add photos, describe your mission, and what makes you unique.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-cyan-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Launch Campaigns</h3>
              <p className="text-sm text-muted-foreground">Create fundraising campaigns for projects, post volunteer opportunities, and schedule community events.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-cyan-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Engage Your Community</h3>
              <p className="text-sm text-muted-foreground">Share updates, recruit volunteers, raise funds, and build a loyal community of supporters around your cause.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-cyan-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Measure & Report</h3>
              <p className="text-sm text-muted-foreground">Track your impact with volunteer hours, funds raised, and outcomes achieved. Generate reports for funders.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Perfect for All Types of Community Groups</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">🏘️ Residents' Associations</h3>
            <p className="text-sm text-muted-foreground">Organise community events, recruit volunteers for clean-ups, and fundraise for neighbourhood improvements.</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">🌱 Environmental Groups</h3>
            <p className="text-sm text-muted-foreground">Coordinate conservation projects, recruit volunteers for tree planting, and raise awareness about local environmental issues.</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">🎨 Arts & Culture Groups</h3>
            <p className="text-sm text-muted-foreground">Promote events, recruit volunteers for festivals, and crowdfund for community art projects.</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">⚽ Sports Clubs</h3>
            <p className="text-sm text-muted-foreground">Fundraise for equipment and facilities, recruit coaches and helpers, and engage your community.</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">🤝 Social Enterprises</h3>
            <p className="text-sm text-muted-foreground">Demonstrate your social impact, attract customers who care, and build community support for your mission.</p>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold mb-2">📚 Community Education</h3>
            <p className="text-sm text-muted-foreground">Recruit volunteer tutors, fundraise for learning materials, and showcase student outcomes.</p>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-950/20 dark:to-sky-950/20">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Join 5,000+ UK Community Groups</h2>
              <p className="text-muted-foreground mb-6">
                From village halls to urban projects, grassroots groups across the UK trust SouLVE.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-6">
                <div>
                  <div className="text-3xl font-bold text-cyan-600">5,000+</div>
                  <div className="text-sm text-muted-foreground">Community Groups</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-sky-600">£500K+</div>
                  <div className="text-sm text-muted-foreground">Raised for Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600">100K+</div>
                  <div className="text-sm text-muted-foreground">Volunteer Hours</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
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

      {/* Final CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-12 text-center bg-gradient-to-r from-cyan-600 to-sky-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Amplify Your Community Impact Today</h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join thousands of grassroots groups using SouLVE to fundraise, recruit volunteers, and make their communities better.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Get Started Free
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              See Success Stories
            </Button>
          </div>
          <p className="text-sm text-cyan-100 mt-6">
            ✓ Free forever &nbsp; ✓ No registration needed &nbsp; ✓ Setup in minutes &nbsp; ✓ Expert support
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForCommunityGroups;