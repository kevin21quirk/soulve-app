import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Users, School, Briefcase, Shield, TrendingUp, Award, BarChart3, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Partner = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    organisationName: "",
    contactName: "",
    email: "",
    phone: "",
    partnershipType: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('partnership_enquiries')
        .insert([{
          organisation_name: formData.organisationName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          partnership_type: formData.partnershipType,
          message: formData.message
        }]);

      if (error) throw error;
      
      toast({
        title: "Partnership enquiry submitted!",
        description: "We'll be in touch within 2 business days to discuss opportunities."
      });

      setFormData({
        organisationName: "",
        contactName: "",
        email: "",
        phone: "",
        partnershipType: "",
        message: ""
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly at partnerships@join-soulve.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const partnershipTypes = [
    {
      icon: <Briefcase className="h-8 w-8" />,
      title: "Corporate Partnerships",
      description: "Employee volunteering programmes, matched giving, ESG reporting, and impact campaigns for businesses committed to social responsibility."
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Charity & Non-Profit",
      description: "Free premium features, fundraising support, volunteer recruitment, and impact measurement tools to amplify your mission."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Local Authority",
      description: "Community engagement tools, citizen services integration, and public consultation platforms to strengthen local democracy."
    },
    {
      icon: <School className="h-8 w-8" />,
      title: "Educational Institutions",
      description: "Student volunteering programmes, skills development, social innovation projects, and research collaboration opportunities."
    }
  ];

  const benefits = [
    { icon: <Shield className="h-6 w-6" />, text: "Verified Organisation Badge" },
    { icon: <TrendingUp className="h-6 w-6" />, text: "Priority Campaign Promotion" },
    { icon: <Award className="h-6 w-6" />, text: "Dedicated Account Manager" },
    { icon: <BarChart3 className="h-6 w-6" />, text: "Custom Impact Reporting" }
  ];

  return (
    <>
      <Helmet>
        <title>Partner With Us - Amplify Your Social Impact | SouLVE</title>
        <meta 
          name="description" 
          content="Join our network of purpose-driven organisations, businesses, and institutions creating measurable social change. Corporate partnerships, charity support, and educational collaboration opportunities available." 
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
                Partner With SouLVE
              </h1>
              <p className="text-xl text-teal-100 mb-4">
                Amplify Your Social Impact Together
              </p>
              <p className="text-lg text-teal-50 max-w-3xl mx-auto">
                Join our network of purpose-driven organisations, businesses, and institutions creating measurable social change. Together, we can do more.
              </p>
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Partnership Opportunities</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {partnershipTypes.map((type, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-primary mb-4">{type.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{type.title}</h3>
                  <p className="text-muted-foreground">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Benefits */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Partnership Benefits</h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-primary mt-1">{benefit.icon}</div>
                  <p className="text-lg">{benefit.text}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-6 bg-primary/5 border border-primary/20 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Additional Features</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• White-label options for enterprise partnerships</li>
                <li>• Co-marketing opportunities and joint campaigns</li>
                <li>• Access to volunteer talent pool for corporate partners</li>
                <li>• Integration with existing CRM and systems via API</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Start a Conversation</h2>
            <p className="text-center text-muted-foreground mb-8">
              Tell us about your organisation and how you'd like to partner with SouLVE
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
              <div>
                <Label htmlFor="organisationName">Organisation Name *</Label>
                <Input
                  id="organisationName"
                  value={formData.organisationName}
                  onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactName">Contact Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="partnershipType">Partnership Interest *</Label>
                <select
                  id="partnershipType"
                  value={formData.partnershipType}
                  onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                  className="w-full px-3 py-2 bg-background border rounded-md"
                  required
                >
                  <option value="">Select partnership type</option>
                  <option value="corporate">Corporate Partnership</option>
                  <option value="charity">Charity/Non-Profit</option>
                  <option value="local_authority">Local Authority</option>
                  <option value="educational">Educational Institution</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <Label htmlFor="message">Tell us about your goals *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  placeholder="What are you hoping to achieve through partnership with SouLVE?"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Partnership Enquiry"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Or email us directly at{" "}
                <a href="mailto:partnerships@join-soulve.com" className="text-primary hover:underline">
                  partnerships@join-soulve.com
                </a>
              </p>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default Partner;
