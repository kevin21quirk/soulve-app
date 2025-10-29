import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link } from "react-router-dom";
import { Heart, Shield, Users, Award, Clock, BookOpen, CheckCircle2, ArrowLeft } from "lucide-react";

const Helpers = () => {
  const navigate = useNavigate();

  const benefits = [
    {
      icon: Shield,
      title: "Anonymous & Safe",
      description: "All support is completely anonymous - no judgement, just compassionate listening"
    },
    {
      icon: Heart,
      title: "Make a Real Difference",
      description: "Provide meaningful emotional support to those who need it most"
    },
    {
      icon: Users,
      title: "Join a Community",
      description: "Connect with other helpers and share experiences"
    },
    {
      icon: Award,
      title: "Recognition",
      description: "Earn badges and recognition for your valuable contributions"
    }
  ];

  const requirements = [
    "Be 18 years or older",
    "Complete our comprehensive helper training programme",
    "Pass background verification checks",
    "Commit to at least 2 hours per week",
    "Demonstrate empathy and active listening skills",
    "Agree to our helper code of conduct"
  ];

  const howItWorks = [
    { step: "1", title: "Apply", description: "Submit your application to become a helper" },
    { step: "2", title: "Train", description: "Complete our training modules on mental health support" },
    { step: "3", title: "Verify", description: "Pass verification and background checks" },
    { step: "4", title: "Help", description: "Start supporting community members in need" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Safe Space Helpers - SouLVE</title>
        <meta name="description" content="Learn about our Safe Space Helper programme. Become a trained helper and provide anonymous peer support to community members facing mental health challenges." />
      </Helmet>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Safe Space Helpers
            </h1>
            <p className="text-xl text-teal-100 max-w-3xl mx-auto mb-8">
              Our Safe Space Helper programme connects trained volunteers with community members who need emotional support - completely anonymously. Whether you need someone to talk to or want to help others, we provide a safe, confidential space for mental health support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/auth')}
                className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50"
              >
                Apply to Become a Helper
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-white text-white hover:bg-white/10"
              >
                Request Support
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Safe Space - Anonymity Focus */}
      <section className="py-12 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 border-2 border-[#0ce4af]/20">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe]">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Completely Anonymous Support</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We understand that reaching out for help can be difficult. That's why Safe Space is designed to be completely anonymous. You don't need to share your identity, and all conversations are private and confidential.
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0ce4af] mt-0.5 flex-shrink-0" />
                    <span>No personal information required</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0ce4af] mt-0.5 flex-shrink-0" />
                    <span>All conversations are confidential</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0ce4af] mt-0.5 flex-shrink-0" />
                    <span>Trained helpers follow strict privacy guidelines</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#0ce4af] mt-0.5 flex-shrink-0" />
                    <span>Ask for support without fear of judgement</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Become a Helper?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-teal-100 to-blue-100 mb-4">
                  <benefit.icon className="h-6 w-6 text-[#0ce4af]" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white text-2xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="h-6 w-6 text-[#0ce4af]" />
              <h2 className="text-2xl font-bold">Helper Requirements</h2>
            </div>
            <div className="space-y-3">
              {requirements.map((requirement, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{requirement}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our community of trained helpers and start supporting those who need it most.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] hover:opacity-90"
          >
            Get Started Today
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Helpers;
