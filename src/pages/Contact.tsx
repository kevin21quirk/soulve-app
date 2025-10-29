import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Clock, Send, ArrowLeft, CheckCircle2, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    contactType: "general"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          contact_type: formData.contactType
        }]);

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: "Message sent!",
        description: "We'll respond within 2 business days."
      });

      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        contactType: "general"
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or email us directly at info@join-soulve.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-8 w-8" />,
      title: "General Enquiries",
      description: "Questions about the platform or how to get started",
      email: "info@join-soulve.com",
      color: "text-blue-500"
    },
    {
      icon: <MessageCircle className="h-8 w-8" />,
      title: "Support",
      description: "Technical issues or account assistance",
      email: "support@join-soulve.com",
      color: "text-green-500"
    },
    {
      icon: <HelpCircle className="h-8 w-8" />,
      title: "Partnerships",
      description: "Collaboration opportunities and business enquiries",
      email: "partnerships@join-soulve.com",
      color: "text-purple-500"
    }
  ];

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Message Sent - Contact Us | SouLVE</title>
        </Helmet>
        <div className="min-h-screen bg-background">
          <div className="flex items-center justify-center min-h-[80vh] px-4">
            <div className="text-center max-w-md">
              <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-4">Message Received!</h1>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for contacting us. We'll get back to you within 2 business days.
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
        <title>Contact Us - Get in Touch | SouLVE</title>
        <meta 
          name="description" 
          content="Get in touch with the SouLVE team. We're here to help with questions, technical support, partnerships, and more. Multiple ways to reach us." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-xl text-teal-100 mb-4">
                We're Here to Help
              </p>
              <p className="text-lg text-teal-50 max-w-3xl mx-auto">
                Whether you have a question, need support, or want to explore partnership opportunities, our team is ready to assist you.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How Can We Help?</h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 text-center hover:shadow-lg transition-shadow">
                  <div className={`${method.color} mx-auto mb-4 flex justify-center`}>{method.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{method.title}</h3>
                  <p className="text-muted-foreground mb-4">{method.description}</p>
                  <a 
                    href={`mailto:${method.email}`} 
                    className="text-primary hover:underline text-sm font-medium"
                  >
                    {method.email}
                  </a>
                </div>
              ))}
            </div>

            {/* Response Time */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 flex items-start gap-4 max-w-3xl mx-auto">
              <Clock className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-muted-foreground">
                  We aim to respond to all enquiries within <strong>2 business days</strong>. For urgent technical issues, our support team typically responds within 24 hours during business hours (Monday-Friday, 9AM-5PM GMT).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Send Us a Message</h2>
            <p className="text-center text-muted-foreground mb-8">
              Fill out the form below and we'll get back to you as soon as possible
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
              <div>
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactType">What is this regarding? *</Label>
                <select
                  id="contactType"
                  value={formData.contactType}
                  onChange={(e) => setFormData({ ...formData, contactType: e.target.value })}
                  className="w-full px-3 py-2 bg-background border rounded-md"
                  required
                >
                  <option value="general">General Enquiry</option>
                  <option value="support">Technical Support</option>
                  <option value="partnership">Partnership Opportunity</option>
                  <option value="feedback">Feedback or Suggestion</option>
                </select>
              </div>

              <div>
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief summary of your message"
                  required
                />
              </div>

              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  placeholder="Please provide as much detail as possible..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                <Send className="h-5 w-5 mr-2" />
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </section>

        {/* Additional Resources */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Other Ways to Get Help</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/help" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Help Centre</h3>
                <p className="text-muted-foreground">Browse FAQs and guides</p>
              </Link>
              <Link to="/report-issue" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Report an Issue</h3>
                <p className="text-muted-foreground">Report bugs or concerns</p>
              </Link>
              <Link to="/community-guidelines" className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">Community Guidelines</h3>
                <p className="text-muted-foreground">Learn about our standards</p>
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Contact;
