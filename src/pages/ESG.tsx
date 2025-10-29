import { Link } from "react-router-dom";
import { ArrowLeft, Leaf, BarChart3, Shield, Users, FileCheck, TrendingUp, Award, Globe, Building2, CheckCircle2, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Footer from "@/components/Footer";

const ESG = () => {
  const esgPillars = [
    {
      icon: Leaf,
      title: "Environmental",
      description: "Track carbon reduction, sustainability initiatives, and environmental impact across all activities.",
      metrics: ["Carbon Footprint", "Resource Conservation", "Waste Reduction", "Green Initiatives"],
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Users,
      title: "Social",
      description: "Measure community engagement, volunteer hours, diversity initiatives, and social impact programs.",
      metrics: ["Volunteer Hours", "Community Reach", "Diversity & Inclusion", "Social Programs"],
      color: "from-blue-500 to-cyan-600"
    },
    {
      icon: Shield,
      title: "Governance",
      description: "Ensure transparency, ethical practices, accountability, and responsible organizational management.",
      metrics: ["Transparency Score", "Ethical Compliance", "Accountability", "Board Diversity"],
      color: "from-purple-500 to-indigo-600"
    }
  ];

  const features = [
    {
      icon: BarChart3,
      title: "Real-Time ESG Scoring",
      description: "Automated calculation of ESG scores based on verified activities, campaigns, and organizational practices. Updated in real-time as your organization makes impact."
    },
    {
      icon: FileCheck,
      title: "Comprehensive Reporting",
      description: "Generate detailed ESG reports for stakeholders, investors, and regulatory compliance. Export-ready formats aligned with global standards."
    },
    {
      icon: TrendingUp,
      title: "Impact Analytics",
      description: "Advanced analytics dashboard showing ESG trends, benchmarks against industry standards, and actionable insights for improvement."
    },
    {
      icon: Award,
      title: "Trust Score System",
      description: "Public-facing trust scores that combine ESG performance, verification status, transparency, and community engagement. Build credibility."
    },
    {
      icon: Globe,
      title: "Global Standards Alignment",
      description: "Aligned with UN Sustainable Development Goals (SDGs), GRI Standards, and SASB frameworks. Ready for investors and partners."
    },
    {
      icon: Building2,
      title: "Organization-Wide Tracking",
      description: "Track ESG performance across teams, departments, and campaigns. Aggregate data for holistic organizational view."
    }
  ];

  const benefits = [
    {
      icon: Target,
      title: "For Organizations",
      points: [
        "Attract impact investors and ESG-focused funding",
        "Demonstrate measurable social and environmental impact",
        "Meet regulatory compliance requirements",
        "Build trust and credibility with stakeholders",
        "Differentiate from competitors with verified data"
      ]
    },
    {
      icon: Users,
      title: "For Supporters & Donors",
      points: [
        "Make informed decisions with transparent ESG data",
        "Support organizations aligned with your values",
        "Track the real-world impact of your contributions",
        "Discover high-performing, verified organizations",
        "Contribute to sustainable, ethical causes"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Gradient */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <Badge variant="outline" className="mb-4 text-sm bg-white/10 text-white border-white/20">
              Environmental, Social & Governance
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              ESG Impact Measurement
            </h1>
            <p className="text-xl text-teal-100 max-w-4xl mx-auto mb-6">
              The first social impact platform with built-in ESG scoring, real-time tracking, and comprehensive reporting for organizations and supporters.
            </p>
            <p className="text-lg text-teal-200 max-w-3xl mx-auto">
              Transform how you measure, report, and communicate your environmental, social, and governance impact. Built for transparency, accountability, and growth.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-16">

        {/* What is ESG Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding ESG</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              ESG stands for Environmental, Social, and Governance - the three pillars of sustainable and responsible organizational practices. SouLVE automatically tracks and scores all three.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {esgPillars.map((pillar) => (
              <Card key={pillar.title} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${pillar.color}`} />
                <CardHeader>
                  <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${pillar.color} flex items-center justify-center mb-4`}>
                    <pillar.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-2xl">{pillar.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-6">{pillar.description}</p>
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground mb-3">Key Metrics Tracked:</p>
                    {pillar.metrics.map((metric) => (
                      <div key={metric} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Platform Features */}
        <section className="bg-muted/50 py-16 -mx-4 px-4 mb-20">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Comprehensive ESG Platform</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Everything you need to measure, manage, and communicate your ESG performance in one integrated platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Card key={feature.title}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
            </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why ESG Matters</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              ESG performance is no longer optional - it's essential for funding, partnerships, and building trust in today's impact economy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <benefit.icon className="h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {benefit.points.map((point, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{point}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="bg-muted/50 py-16 -mx-4 px-4 mb-20">
          <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ESG Scoring Works</h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Our automated ESG scoring system evaluates organizations across multiple dimensions in real-time.
            </p>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
            <CardContent className="pt-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-4">Scoring Components</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Environmental Score</span>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Based on environmental activities, carbon tracking, and sustainability initiatives
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Social Impact Score</span>
                        <span className="text-sm text-muted-foreground">25%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Volunteer hours, community engagement, diversity metrics, and social programs
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Governance Score</span>
                        <span className="text-sm text-muted-foreground">20%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Transparency, accountability, ethical practices, and organizational structure
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Verification Score</span>
                        <span className="text-sm text-muted-foreground">15%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Level of verification, documentation quality, and third-party validation
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Engagement Score</span>
                        <span className="text-sm text-muted-foreground">15%</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Community engagement, response rates, and stakeholder communication
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold mb-4">Score Ranges</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-none">90-100</Badge>
                      <span className="font-medium">Exceptional</span>
                      <span className="text-sm text-muted-foreground">Industry leading ESG performance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-none">80-89</Badge>
                      <span className="font-medium">Excellent</span>
                      <span className="text-sm text-muted-foreground">Strong ESG commitment</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-none">70-79</Badge>
                      <span className="font-medium">Very Good</span>
                      <span className="text-sm text-muted-foreground">Above average performance</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-none">60-69</Badge>
                      <span className="font-medium">Good</span>
                      <span className="text-sm text-muted-foreground">Meeting expectations</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">50-59</Badge>
                      <span className="font-medium">Fair</span>
                      <span className="text-sm text-muted-foreground">Room for improvement</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">&lt;50</Badge>
                      <span className="font-medium">Developing</span>
                      <span className="text-sm text-muted-foreground">Building ESG foundation</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
            </div>
        </section>

        {/* CTA Section */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2">
            <CardContent className="pt-12 pb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Tracking Your ESG Impact Today</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Join organizations using SouLVE to measure, improve, and communicate their ESG performance. Build trust through transparency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/auth?tab=signup" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8">
                  Get Started Free
                </Link>
                <Link to="/features" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-11 px-8">
                  View All Features
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ESG;
