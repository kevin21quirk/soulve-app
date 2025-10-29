import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, CheckCircle, Eye, Lock, Users, AlertCircle, Phone, ArrowLeft } from "lucide-react";

const TrustSafety = () => {
  const safetyFeatures = [
    { icon: CheckCircle, title: "Identity Verification", description: "Multi-layer verification for organisations and helpers to ensure authenticity and build trust." },
    { icon: Shield, title: "Safe Space Protocols", description: "Anonymous support with trained helpers following strict safeguarding procedures." },
    { icon: Eye, title: "Content Moderation", description: "AI-powered and human moderation to detect and remove harmful content quickly." },
    { icon: Lock, title: "Donation Protection", description: "Secure payment processing and fraud prevention to protect your contributions." },
    { icon: Users, title: "Privacy Controls", description: "Granular privacy settings to control who sees your information and activity." },
    { icon: AlertCircle, title: "24/7 Monitoring", description: "Round-the-clock security monitoring and rapid response to potential threats." },
  ];

  return (
    <>
      <Helmet>
        <title>Trust & Safety Centre | SouLVE</title>
        <meta name="description" content="Your security is our priority. Learn about SouLVE's comprehensive trust and safety features." />
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
              <h1 className="text-4xl md:text-6xl font-bold mb-6">Trust & Safety Centre</h1>
              <p className="text-xl text-teal-100 max-w-3xl mx-auto">
                Your security is our priority. Comprehensive safety measures to protect you and our community.
              </p>
            </div>
          </div>
        </section>

        <main className="pb-16">
          <section className="container mx-auto px-4 py-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Our Safety Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {safetyFeatures.map((feature, index) => (
                <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                      <feature.icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
          <section className="bg-muted/50 py-16">
            <div className="container mx-auto px-4 text-center">
              <Button size="lg" asChild><Link to="/report">Report a Safety Concern</Link></Button>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default TrustSafety;
