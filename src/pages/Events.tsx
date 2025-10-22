import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Target, Plus, Share2, BarChart, ArrowLeft } from "lucide-react";

const Events = () => {
  const features = [
    {
      icon: Plus,
      title: "Easy Event Creation",
      description: "Create events in minutes with our intuitive builder - add dates, locations, tickets, and registration forms",
    },
    {
      icon: Users,
      title: "Attendee Management",
      description: "Track RSVPs, send updates, manage ticket sales, and communicate with attendees all in one place",
    },
    {
      icon: TrendingUp,
      title: "Impact Tracking",
      description: "Measure the success of your events with attendance analytics, fundraising totals, and volunteer hours logged",
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Create Your Event",
      description: "Set up your event details, date, location, and registration requirements",
    },
    {
      number: "02",
      title: "Promote & Share",
      description: "Share your event across social media and invite your network to join",
    },
    {
      number: "03",
      title: "Manage Attendees",
      description: "Track registrations, send reminders, and communicate with participants",
    },
    {
      number: "04",
      title: "Track Impact",
      description: "Measure attendance, funds raised, and the overall impact of your event",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Create & Manage Community Events | SouLVE</title>
        <meta
          name="description"
          content="Organise fundraisers, volunteering days, awareness campaigns, and social gatherings that make a real difference. Powerful event management tools coming soon."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pb-16">
          {/* Back Link */}
          <div className="container mx-auto px-4 pt-8">
            <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
              <Calendar className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Create & Manage Community Events
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Bring your community together with powerful event management tools. Organise fundraisers, volunteering days, awareness campaigns, and social gatherings that make a real difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gap-2" disabled>
                <Calendar className="h-5 w-5" />
                Coming Soon - Q2 2026
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Get Notified</Link>
              </Button>
            </div>
          </section>

          {/* Key Features */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Everything You Need to Run Successful Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-6">
                      <feature.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                How It Works
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {steps.map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="text-6xl font-bold text-primary/20 mb-4">
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Event Types */}
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Event Types You Can Create
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                { title: "Fundraising Events", icon: Target, description: "Galas, charity auctions, sponsored challenges" },
                { title: "Volunteer Days", icon: Users, description: "Community clean-ups, food banks, habitat restoration" },
                { title: "Awareness Campaigns", icon: Share2, description: "Educational workshops, rallies, awareness weeks" },
                { title: "Networking Events", icon: Users, description: "Socials, meetups, collaboration sessions" },
                { title: "Training & Workshops", icon: Calendar, description: "Skills training, certification courses, webinars" },
                { title: "Impact Reporting", icon: BarChart, description: "Annual reports, community updates, impact showcases" },
              ].map((type, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-6 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <type.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{type.title}</h3>
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-primary/5 py-16">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to Create Impactful Events?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                Join the waitlist to be notified when event management tools launch in Q2 2026.
              </p>
              <Button size="lg" asChild>
                <Link to="/contact">Get Early Access</Link>
              </Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Events;
