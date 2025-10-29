import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Users, MessageCircle, Scale, AlertTriangle, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Guidelines = () => {
  const principles = [
    {
      icon: Heart,
      title: "Respect & Kindness",
      description: "Treat all community members with respect. No harassment, bullying, or hate speech of any kind. We're all here to make a positive difference.",
      examples: [
        "Be considerate in your language and tone",
        "Respect different viewpoints and backgrounds",
        "Address conflicts constructively and privately",
      ],
    },
    {
      icon: Shield,
      title: "Authenticity & Honesty",
      description: "Be genuine in your interactions. Misrepresentation, fraud, or impersonation is strictly prohibited. Transparency builds trust.",
      examples: [
        "Use your real identity or clearly state if representing an organization",
        "Don't create fake accounts or impersonate others",
        "Be honest about campaign goals and fund usage",
      ],
    },
    {
      icon: Users,
      title: "Privacy & Safety",
      description: "Protect your privacy and respect others'. Do not share personal information without consent or engage in doxxing.",
      examples: [
        "Don't share others' contact details or private information",
        "Respect confidentiality in private conversations",
        "Use platform privacy settings appropriately",
      ],
    },
    {
      icon: MessageCircle,
      title: "Constructive Engagement",
      description: "Engage constructively to build our community. Spam, trolling, or disruptive behaviour undermines our mission.",
      examples: [
        "Stay on topic in discussions and campaigns",
        "Provide helpful feedback rather than destructive criticism",
        "Don't spam or post repetitive content",
      ],
    },
    {
      icon: Scale,
      title: "Legal Compliance",
      description: "Follow all applicable laws. No illegal activities, scams, or fundraising fraud. Report suspicious activity immediately.",
      examples: [
        "Only raise funds for legitimate causes",
        "Comply with data protection and privacy laws",
        "Don't promote illegal activities or services",
      ],
    },
  ];

  const prohibited = [
    "Hate speech, discrimination, or harassment based on race, ethnicity, religion, gender, sexual orientation, disability, or any other characteristic",
    "Threats, violence, or content that incites harm",
    "Sexual content, nudity, or sexually explicit material",
    "Spam, scams, phishing, or fraudulent schemes",
    "Misinformation or deliberately misleading content",
    "Impersonation of individuals, organizations, or brands",
    "Doxxing or sharing private information without consent",
    "Illegal activities, including drug sales or terrorist content",
    "Copyright infringement or intellectual property violations",
  ];

  return (
    <>
      <Helmet>
        <title>Community Guidelines | SouLVE</title>
        <meta
          name="description"
          content="Our community guidelines ensure SouLVE remains a respectful, inclusive space for everyone working towards positive social change."
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
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Community Guidelines</h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto">
                Our guidelines ensure SouLVE remains a respectful, inclusive space for everyone working towards positive social change.
              </p>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="container mx-auto px-4 py-16 max-w-4xl">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground leading-relaxed">
                  SouLVE exists to connect people who want to make a difference. Our community is built on trust, respect, and a shared commitment to positive social impact. These guidelines help ensure that everyone can participate safely and productively.
                </p>
              </CardContent>
            </Card>
          </section>

        {/* Core Principles */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Our Core Principles
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {principles.map((principle, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <principle.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">{principle.title}</h3>
                        <p className="text-muted-foreground mb-4">{principle.description}</p>
                      </div>
                    </div>
                    <div className="ml-16">
                      <p className="text-sm font-semibold mb-2">Examples:</p>
                      <ul className="space-y-1">
                        {principle.examples.map((example, idx) => (
                          <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                ))}
              </div>
            </div>
        </section>

        {/* Prohibited Content */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 max-w-4xl">
              <div className="flex items-center gap-3 mb-8">
                <AlertTriangle className="h-8 w-8 text-destructive" />
                <h2 className="text-3xl font-bold">Prohibited Content & Behaviour</h2>
              </div>
              <Card className="border-destructive/20">
                <CardContent className="p-8">
                  <p className="text-muted-foreground mb-6">
                    The following content and behaviours are strictly prohibited on SouLVE and may result in account suspension or permanent ban:
                  </p>
                  <ul className="space-y-3">
                    {prohibited.map((item, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center text-destructive font-bold text-sm mt-0.5">
                          {index + 1}
                        </span>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

        {/* Reporting & Enforcement */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8">Reporting & Enforcement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">How to Report</h3>
                  <p className="text-muted-foreground mb-4">
                    If you see content or behaviour that violates these guidelines, please report it immediately. All reports are reviewed by our moderation team.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/report">Report a Violation</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-border/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg mb-3">Enforcement Actions</h3>
                  <p className="text-muted-foreground mb-4">
                    Violations may result in warnings, temporary suspensions, or permanent account termination depending on severity. Repeat offenders will face stricter consequences.
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link to="/trust-safety">Learn About Safety</Link>
                  </Button>
                </CardContent>
                </Card>
              </div>
            </div>
        </section>

        {/* CTA */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Help Us Build a Better Community
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                By following these guidelines, you help create a safe, welcoming space where everyone can contribute to positive change.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/auth">Join SouLVE</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Guidelines;
