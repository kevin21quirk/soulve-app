import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Users, Heart, Award, Target, BarChart3, Clock, DollarSign, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Impact = () => {
  const features = [
    {
      icon: Users,
      title: "Personal Impact Dashboard",
      description: "Your contribution history, total donated, hours volunteered, and badges earned all in one place.",
    },
    {
      icon: Target,
      title: "Campaign Outcomes",
      description: "Detailed reports on how campaign funds were used and the measurable results achieved.",
    },
    {
      icon: BarChart3,
      title: "Community Statistics",
      description: "Platform-wide metrics showing collective impact across all causes and communities.",
    },
    {
      icon: Heart,
      title: "Impact Stories",
      description: "Real stories from beneficiaries showing the tangible change created by our community.",
    },
  ];

  const metrics = [
    { icon: DollarSign, value: "£2.4M+", label: "Raised for Communities" },
    { icon: Clock, value: "45,000+", label: "Volunteer Hours Logged" },
    { icon: Target, value: "1,200+", label: "Campaigns Successfully Funded" },
    { icon: Users, value: "89%", label: "Users Report Increased Connection" },
  ];

  const reportTypes = [
    {
      title: "Individual Impact",
      items: [
        "Total donations made",
        "Campaigns supported",
        "Volunteer hours contributed",
        "Badges and achievements earned",
        "Community engagement metrics",
      ],
    },
    {
      title: "Campaign Impact",
      items: [
        "Funds raised vs. goal",
        "Number of supporters",
        "Geographic reach",
        "Outcomes and results delivered",
        "Beneficiary testimonials",
      ],
    },
    {
      title: "Platform Impact",
      items: [
        "Total community donations",
        "Active campaigns and causes",
        "Volunteer work completed",
        "Lives impacted",
        "SDG alignment and progress",
      ],
    },
  ];

  return (
    <>
      <Helmet>
        <title>Impact Reports | SouLVE</title>
        <meta
          name="description"
          content="See the measurable difference our community is making. Transparent impact reports showing donations, volunteer hours, campaigns completed, and lives changed."
        />
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
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Impact Reports</h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
                Transparent, data-driven reports showing the real-world impact of our community. Track donations, volunteer hours, campaigns completed, and lives changed across every cause.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2 bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors" disabled>
                  <BarChart3 className="h-5 w-5" />
                  Coming Soon - Q2 2026
                </Button>
                <Button size="lg" variant="outline" asChild className="bg-white/10 text-white border-white/20 hover:bg-white/20">
                  <Link to="/contact">Get Notified</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll See */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                What You'll See in Impact Reports
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

        {/* Report Types */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Comprehensive Impact Tracking
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {reportTypes.map((type, index) => (
                <Card key={index} className="border-border/50">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-semibold mb-6 text-center">{type.title}</h3>
                    <ul className="space-y-3">
                      {type.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                ))}
              </div>
            </div>
        </section>

        {/* Transparency Statement */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 max-w-4xl text-center">
              <h2 className="text-3xl font-bold mb-6">
                Built on Transparency
              </h2>
              <p className="text-xl text-muted-foreground mb-6">
                We believe every donor and volunteer deserves to see the impact of their contributions. Our impact reports provide complete transparency into where funds go, how campaigns perform, and the real-world outcomes achieved.
              </p>
              <p className="text-lg text-muted-foreground mb-8">
                Whether you're an individual supporter, campaign creator, or organization, you'll have access to detailed, verifiable impact data that shows exactly how your efforts are making a difference.
              </p>
              <Card className="border-border/50 inline-block">
                <CardContent className="p-6">
                  <p className="text-sm text-muted-foreground">
                    <strong>Coming Q2 2026:</strong> Real-time impact dashboards, downloadable PDF reports, and automated campaign outcome tracking.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

        {/* CTA */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Want to Track Your Impact?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join the waitlist to be notified when impact reporting tools launch in Q2 2026.
            </p>
            <Button size="lg" asChild>
              <Link to="/contact">Get Early Access</Link>
              </Button>
            </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Impact;
