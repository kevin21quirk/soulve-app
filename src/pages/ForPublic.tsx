import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Heart, Share2, MapPin, Trophy, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForPublic = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "Is SouLVE really free to use?",
      answer: "Yes, absolutely! Creating an account and participating in campaigns, volunteering, sharing causes, and connecting with your community is completely free. No subscriptions, no hidden fees."
    },
    {
      question: "Do I have to donate money to make a difference?",
      answer: "Not at all! You can make an impact by volunteering, sharing campaigns with your network, signing petitions, attending events, or simply raising awareness. Every action counts."
    },
    {
      question: "Can I support causes in my local area?",
      answer: "Yes! Filter campaigns, volunteering opportunities, and events by location to discover ways to make a difference right in your community."
    },
    {
      question: "What can I track on my profile?",
      answer: "Your SouLVE profile tracks all your contributions—volunteer hours, campaigns supported, shares, and impact made. It's your personal social impact portfolio."
    },
    {
      question: "Do I need to commit to regular volunteering?",
      answer: "No commitment required! Participate when it suits you. Find one-off opportunities, flexible roles, or regular commitments depending on your availability."
    },
    {
      question: "Can I use SouLVE without my employer?",
      answer: "Absolutely. SouLVE is for everyone—students, retirees, employees, freelancers, or anyone who wants to make a positive difference in their community."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-teal-50">
      <SEOHead
        title="For Public | Get Involved in Your Community | Free Social Impact Platform"
        description="Join your community on SouLVE. Discover local campaigns, volunteer opportunities, and causes you care about. Free to join. Make a difference today—no donation required."
        keywords={["community platform UK", "social impact app", "get involved locally", "free volunteering app", "community engagement platform", "support local causes"]}
        url="https://join-soulve.com/for-public"
      />
      <FAQSchema faqs={faqs} />

      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-center mb-6">
            <SouLVELogo size="small" />
          </div>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Everyone</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Make a difference in your community. Discover causes, volunteer, share campaigns, and connect with people who care. Free forever.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Join Free
              </Button>
              <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
                Explore Campaigns
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Make a Difference Your Way</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Whether you donate, volunteer, share, or simply stay informed—every action creates positive change.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <MapPin className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Discover Local Causes</h3>
            <p className="text-sm text-muted-foreground">
              Find campaigns, events, and volunteering opportunities happening right in your neighbourhood. Make a difference where you live.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Support Without Donating</h3>
            <p className="text-sm text-muted-foreground">
              You don't need money to make an impact. Volunteer, share campaigns, sign petitions, or attend events—every action helps.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <Share2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Amplify Your Voice</h3>
            <p className="text-sm text-muted-foreground">
              Share causes you care about with your network. Help campaigns reach more people and raise awareness for important issues.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Connect With Community</h3>
            <p className="text-sm text-muted-foreground">
              Meet like-minded people, join groups, attend events, and build connections around shared values and causes.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <Trophy className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Your Impact</h3>
            <p className="text-sm text-muted-foreground">
              Every action is logged in your personal impact dashboard. See the difference you're making and earn recognition badges.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-3 w-fit mb-4">
              <Smile className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Participate When You Can</h3>
            <p className="text-sm text-muted-foreground">
              No pressure, no commitment. Engage with causes when it suits you. Take breaks, come back anytime—you're always welcome.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get Started in Seconds</h2>
            <p className="text-muted-foreground">Join your community in three simple steps</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-green-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">Sign up free in seconds. Tell us what causes you care about and where you're based.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-green-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Discover & Connect</h3>
              <p className="text-sm text-muted-foreground">Explore campaigns, find volunteering opportunities, and connect with your local community.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-green-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Make an Impact</h3>
              <p className="text-sm text-muted-foreground">Take action—donate, volunteer, share, or participate. See your impact grow over time.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ways to Contribute */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Ways You Can Help</h2>
          <p className="text-muted-foreground">Choose how you want to make a difference</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-3">💰 Donate</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Support campaigns with one-off or monthly donations. 100% reaches the charity with automatic Gift Aid.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>Browse Campaigns</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-3">🙋 Volunteer</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find local or remote volunteering opportunities. Give your time and skills to causes you care about.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/volunteer")}>Find Opportunities</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-3">📢 Share</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Amplify campaigns by sharing them with your network on social media, email, or messaging apps.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/campaigns")}>Campaigns to Share</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-3">📍 Attend Events</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Join community events, fundraisers, and awareness campaigns happening near you.
            </p>
            <Button variant="outline" size="sm" onClick={() => navigate("/events")}>See Events</Button>
          </Card>
        </div>
      </div>

      {/* Trust Section */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Your Community on SouLVE</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Thousands of people across the UK are using SouLVE to connect, collaborate, 
              and create positive change in their local communities.
            </p>
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
        <Card className="p-12 text-center bg-gradient-to-r from-teal-600 to-blue-600 text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join your community on SouLVE. Free forever. No commitment required. Just people helping people.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Join Free Now
            </Button>
            <Button size="lg" variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white">
              Explore First
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ Always free &nbsp; ✓ No donations required &nbsp; ✓ Participate your way &nbsp; ✓ Track your impact
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForPublic;