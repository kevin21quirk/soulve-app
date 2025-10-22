import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Clock, Award, Users, ArrowLeft } from "lucide-react";

const Volunteer = () => {
  const features = [
    { icon: Clock, title: "Flexible Opportunities", description: "Find one-off events, ongoing roles, remote and in-person volunteering." },
    { icon: Award, title: "Skills-Based Matching", description: "Get matched with opportunities that need your specific skills." },
    { icon: Users, title: "Impact Tracking", description: "Log hours, earn badges, and see the tangible impact of your time." },
  ];

  return (
    <>
      <Helmet>
        <title>Volunteer Opportunities | SouLVE</title>
        <meta name="description" content="Discover meaningful volunteer opportunities with verified organisations across your community." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pb-16">
          <div className="container mx-auto px-4 pt-8">
            <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <section className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
              <Heart className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Volunteer Opportunities</h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover meaningful volunteer opportunities with verified organisations. Find causes that match your skills and passions.
            </p>
            <Button size="lg" disabled>Coming Soon - Q2 2026</Button>
          </section>
          <section className="container mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <div key={i} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                    <f.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                  <p className="text-muted-foreground">{f.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default Volunteer;
