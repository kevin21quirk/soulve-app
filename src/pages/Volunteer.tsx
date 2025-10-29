import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Heart, Award, Clock, Users, Target, Calendar, Sparkles, CheckCircle2 } from "lucide-react";

const Volunteer = () => {
  const features = [
    {
      icon: Heart,
      title: "Verified Opportunities",
      description: "All volunteer positions are with verified organisations. Safe, meaningful opportunities you can trust.",
    },
    {
      icon: Award,
      title: "Build Your Legacy",
      description: "Every hour matters. Build a portfolio of impact, earn recognition badges, and see the tangible difference your time makes.",
    },
    {
      icon: Clock,
      title: "Flexible to Your Life",
      description: "Volunteer on your schedule - remote or in-person, weekends or evenings, one-off or ongoing. You choose how to help.",
    },
    {
      icon: Target,
      title: "Skills-Based Matching",
      description: "Find opportunities that match your unique skills and passions. From tech to teaching, everyone has something valuable to offer.",
    },
    {
      icon: Users,
      title: "Connect with Purpose",
      description: "Meet like-minded volunteers, build lifelong friendships, and become part of a community united by shared values.",
    },
    {
      icon: Calendar,
      title: "Track Your Impact",
      description: "Log hours, earn badges, and see your cumulative contribution to causes you care about. Your story of change, visualised.",
    },
  ];

  const howItWorks = [
    { step: "1", title: "Browse Opportunities", description: "Search by cause, skill, location, or availability. Find the perfect volunteer role for you." },
    { step: "2", title: "Apply or Sign Up", description: "Simple application process. Most opportunities confirm within 48 hours." },
    { step: "3", title: "Make a Difference", description: "Show up, contribute, and log your hours. Every action creates real impact." },
    { step: "4", title: "Earn Recognition", description: "Build your impact portfolio, earn badges, and unlock new opportunities as you grow." },
  ];

  const whyVolunteer = [
    { stat: "78%", label: "Report improved mental wellbeing" },
    { stat: "27%", label: "More likely to find employment" },
    { stat: "£15", label: "Social value created per hour" },
    { stat: "92%", label: "Say it gives them purpose" },
  ];

  const featuredCauses = [
    "Environmental Conservation", "Youth Mentoring", "Food Bank Support", "Community Gardening",
    "Digital Literacy for Seniors", "Mental Health Support", "Homeless Outreach", "Animal Welfare",
  ];

  return (
    <>
      <Helmet>
        <title>Volunteer Opportunities | SouLVE</title>
        <meta name="description" content="Transform lives through the power of your time. Find meaningful volunteer opportunities matched to your skills, schedule, and passions. Track your impact and earn recognition." />
      </Helmet>
      <div className="min-h-screen bg-background">
        {/* Hero Section with Gradient */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8">
                <Heart className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Volunteer Your Time</h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-4">
                Transform lives through the power of your time. Whether you have an hour or a month, your skills can create lasting change in your community.
              </p>
              <p className="text-lg text-teal-200 max-w-3xl mx-auto mb-8">
                Connect with verified organisations, track your impact, and join a movement of changemakers turning compassion into action.
              </p>
              <Button size="lg" className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors" disabled>
                <Sparkles className="h-5 w-5 mr-2" />Coming Soon - Q2 2026
              </Button>
            </div>
          </div>
        </section>

        <main className="pb-16">
          <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why Volunteer?</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {whyVolunteer.map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="text-4xl md:text-5xl font-bold text-primary mb-2">{item.stat}</div>
                    <p className="text-sm md:text-base text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Volunteering Made Simple</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {features.map((feature, i) => (
                <Card key={i} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {howItWorks.map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-6">{item.step}</div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Volunteer;
