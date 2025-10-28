import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Clock, Award, Heart, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEOHead from "@/components/seo/SEOHead";
import FAQSchema from "@/components/seo/FAQSchema";
import SouLVELogo from "@/components/SouLVELogo";

const ForVolunteers = () => {
  const navigate = useNavigate();

  const faqs = [
    {
      question: "How do I find volunteering opportunities near me?",
      answer: "Simply create your free profile and search by location, cause, or skills. Our matching algorithm suggests opportunities that align with your interests and availability."
    },
    {
      question: "Can I volunteer remotely?",
      answer: "Yes! Many organisations offer remote volunteering opportunities including online mentoring, virtual fundraising, social media support, and administrative tasks."
    },
    {
      question: "Will I get a DBS check through SouLVE?",
      answer: "Individual charities arrange DBS checks when required for specific roles. SouLVE tracks your verified hours and activities to support your applications."
    },
    {
      question: "Can I use my volunteer hours for university applications or CVs?",
      answer: "Absolutely. Your SouLVE profile creates a verified record of all your volunteer hours, skills gained, and impact made—perfect for UCAS applications, CVs, and job interviews."
    },
    {
      question: "Do I need any experience to start volunteering?",
      answer: "No experience necessary! We have opportunities for all skill levels, from entry-level roles to skills-based volunteering for professionals."
    },
    {
      question: "How flexible are the volunteering opportunities?",
      answer: "Very flexible. Filter by time commitment (one-off, regular, flexible hours) to find opportunities that fit your schedule, whether it's a few hours a month or every week."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <SEOHead
        title="For Volunteers | Find Volunteering Opportunities Near You"
        description="Discover local volunteering opportunities in the UK. Track volunteer hours, earn recognition, and make a real difference. Free to join. Find your cause today."
        keywords={["volunteer opportunities UK", "find volunteering near me", "volunteer matching platform", "track volunteer hours", "volunteering app UK", "skills-based volunteering"]}
        url="https://join-soulve.com/for-volunteers"
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">For Volunteers</h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto">
              Discover meaningful volunteering opportunities, track your impact, and connect with causes you care about—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
                Start Volunteering
              </Button>
              <Button 
                size="lg"
                onClick={() => navigate("/help-center")}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
              >
                Browse Opportunities
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Volunteer with SouLVE?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find opportunities that match your skills, interests, and schedule. Make a real difference in your community.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/20 p-3 w-fit mb-4">
              <MapPin className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Local & Remote Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Find volunteering near you or work remotely. Filter by location, cause, and availability to discover perfect matches.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-pink-100 dark:bg-pink-900/20 p-3 w-fit mb-4">
              <Clock className="h-6 w-6 text-pink-600 dark:text-pink-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Track Your Impact</h3>
            <p className="text-sm text-muted-foreground">
              Every hour you volunteer is logged and verified. Build a portfolio of your contributions for CVs, university applications, and job interviews.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/20 p-3 w-fit mb-4">
              <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Earn Recognition</h3>
            <p className="text-sm text-muted-foreground">
              Unlock badges and achievements as you volunteer. Showcase your commitment and inspire others to make a difference.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-3 w-fit mb-4">
              <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Causes You Care About</h3>
            <p className="text-sm text-muted-foreground">
              From animal welfare to mental health, education to environment—find opportunities aligned with your passions and values.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/20 p-3 w-fit mb-4">
              <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Build Your Network</h3>
            <p className="text-sm text-muted-foreground">
              Connect with like-minded volunteers, meet charity leaders, and build relationships that last beyond your volunteering.
            </p>
          </Card>

          <Card className="p-6">
            <div className="rounded-full bg-teal-100 dark:bg-teal-900/20 p-3 w-fit mb-4">
              <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Flexible Commitment</h3>
            <p className="text-sm text-muted-foreground">
              Choose one-off events, regular weekly slots, or flexible opportunities that fit around your work, studies, or family life.
            </p>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Start Volunteering in Minutes</h2>
            <p className="text-muted-foreground">Four simple steps to making a difference</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="rounded-full bg-purple-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-semibold mb-2">Create Your Profile</h3>
              <p className="text-sm text-muted-foreground">Sign up free and tell us about your skills, interests, and availability.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-purple-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-semibold mb-2">Discover Opportunities</h3>
              <p className="text-sm text-muted-foreground">Browse hundreds of volunteering roles near you or remotely. Filter by cause, time, and skills.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-purple-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-semibold mb-2">Apply & Get Started</h3>
              <p className="text-sm text-muted-foreground">Apply to opportunities with one click. Charities will contact you directly to get started.</p>
            </div>

            <div className="text-center">
              <div className="rounded-full bg-purple-600 text-white w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
              <h3 className="font-semibold mb-2">Track Your Impact</h3>
              <p className="text-sm text-muted-foreground">Log hours, earn badges, and build your volunteering portfolio for CVs and applications.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Join Thousands of UK Volunteers</h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform connects volunteers with meaningful opportunities across the UK. 
            Find flexible roles that match your skills, interests, and availability.
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
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="text-xl text-teal-100 mb-8 max-w-2xl mx-auto">
            Join thousands of volunteers finding meaningful opportunities on SouLVE. Start your journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth")}>
              Start Volunteering
            </Button>
            <Button 
              size="lg"
              onClick={() => navigate("/help-center")}
              className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Browse Opportunities
            </Button>
          </div>
          <p className="text-sm text-teal-100 mt-6">
            ✓ Free to join &nbsp; ✓ Flexible hours &nbsp; ✓ Track your impact &nbsp; ✓ Build your portfolio
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ForVolunteers;