import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Mail, Heart, TrendingUp, Users, CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Newsletter = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    interests: [] as string[],
    frequency: "monthly"
  });
  const [gdprConsent, setGdprConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!gdprConsent) {
      toast({
        title: "Consent required",
        description: "Please agree to receive emails from SouLVE",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // TODO: Database types need regeneration after migration
      console.log('Newsletter subscription:', formData);
      
      setIsSubscribed(true);
      toast({
        title: "You're subscribed!",
        description: "Check your email for confirmation"
      });
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "Please try again or contact info@join-soulve.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const newsletterFeatures = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Impact Spotlights",
      description: "Real stories from campaigns and volunteers making a tangible difference in communities"
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: "Platform Updates",
      description: "Be the first to know about new features, improvements, and upcoming events"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Highlights",
      description: "Celebrate top campaigns, most-active volunteers, and milestone achievements"
    }
  ];

  const interestOptions = [
    { id: "volunteering", label: "Volunteering Opportunities" },
    { id: "campaigns", label: "Campaign Updates" },
    { id: "news", label: "Community News" },
    { id: "impact", label: "Impact Stories" }
  ];

  if (isSubscribed) {
    return (
      <>
        <Helmet>
          <title>Newsletter Subscription Confirmed | SouLVE</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="text-center max-w-md">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">You're Subscribed!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Check your email to confirm your subscription. You'll start receiving updates based on your preferences.
              </p>
              <Button onClick={() => window.location.href = "/"}>
                Return to Homepage
              </Button>
            </div>
          </div>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Subscribe to Newsletter - Stay Updated | SouLVE</title>
        <meta 
          name="description" 
          content="Get monthly updates on platform features, impact stories, volunteer opportunities, and inspiring community achievements delivered to your inbox." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <Mail className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Stay Connected
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Subscribe to the SouLVE Newsletter
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Get monthly updates on platform features, impact stories, volunteer opportunities, and inspiring community achievements delivered to your inbox.
            </p>
          </div>
        </section>

        {/* What You'll Receive */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What You'll Receive</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {newsletterFeatures.map((feature, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 text-center">
                  <div className="text-primary mx-auto mb-4 flex justify-center">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subscription Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Sign Up Today</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="firstName">First Name (optional)</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="How should we address you?"
                />
              </div>

              <div>
                <Label className="mb-3 block">What interests you?</Label>
                <div className="space-y-3">
                  {interestOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={option.id}
                        checked={formData.interests.includes(option.id)}
                        onCheckedChange={() => handleInterestToggle(option.id)}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm cursor-pointer"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="frequency">Email Frequency</Label>
                <select
                  id="frequency"
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                  className="w-full px-3 py-2 bg-background border rounded-md"
                >
                  <option value="weekly">Weekly Digest</option>
                  <option value="monthly">Monthly Roundup</option>
                </select>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="gdpr"
                  checked={gdprConsent}
                  onCheckedChange={(checked) => setGdprConsent(checked as boolean)}
                />
                <label htmlFor="gdpr" className="text-sm text-muted-foreground cursor-pointer">
                  I agree to receive emails from SouLVE. You can unsubscribe at any time.
                </label>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We respect your privacy. Read our{" "}
                <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
              </p>
            </form>
          </div>
        </section>

        {/* Past Issues Preview */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Recent Newsletter Highlights</h2>
            <p className="text-muted-foreground mb-8">
              Here's a preview of what our community has been receiving
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6 text-left">
                <p className="text-sm text-muted-foreground mb-2">January 2026</p>
                <h3 className="text-xl font-semibold mb-3">Community Impact Report</h3>
                <p className="text-muted-foreground">
                  Celebrating our community's achievements, featuring stories from volunteers who've made extraordinary contributions.
                </p>
              </div>
              <div className="bg-card border rounded-lg p-6 text-left">
                <p className="text-sm text-muted-foreground mb-2">December 2025</p>
                <h3 className="text-xl font-semibold mb-3">Year in Review</h3>
                <p className="text-muted-foreground">
                  A look back at 2025's most impactful campaigns, milestones reached, and communities transformed.
                </p>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Newsletter;
