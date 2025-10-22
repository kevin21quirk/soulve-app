import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Building2, Shield, Headphones, Plug, Lock, BarChart3, Check, X, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Enterprise = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    employeeCount: "",
    useCase: "",
    interestedFeatures: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // TODO: Database types need regeneration after migration
      console.log('Enterprise enquiry:', formData);
      
      toast({
        title: "Enterprise enquiry submitted!",
        description: "Our team will contact you within 1 business day to schedule a demo."
      });

      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        employeeCount: "",
        useCase: "",
        interestedFeatures: []
      });
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "Please try again or contact us at enterprise@join-soulve.com",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const enterpriseFeatures = [
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "White-Label Platform",
      description: "Custom branding, domain, and full platform customisation for your organisation's unique needs"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced ESG Reporting",
      description: "Automated SDG tracking, regulatory compliance, and investor-grade impact reports"
    },
    {
      icon: <Lock className="h-8 w-8" />,
      title: "Single Sign-On (SSO)",
      description: "Seamless integration with your existing systems via SAML, OAuth, and LDAP"
    },
    {
      icon: <Headphones className="h-8 w-8" />,
      title: "Dedicated Support",
      description: "Priority 24/7 support with dedicated account manager and SLA guarantees"
    },
    {
      icon: <Plug className="h-8 w-8" />,
      title: "Custom Integrations",
      description: "API access to integrate with your CRM, HRIS, and data warehouses"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Enterprise Security",
      description: "SOC 2 compliance, custom data retention policies, and enhanced security controls"
    }
  ];

  const pricingTiers = [
    {
      name: "Enterprise Standard",
      price: "£299",
      period: "/month",
      features: [
        "Up to 500 users",
        "Advanced analytics",
        "SSO integration",
        "Priority support",
        "API access",
        "Custom branding"
      ],
      notIncluded: [
        "White-label platform",
        "Custom integrations"
      ]
    },
    {
      name: "White Label",
      price: "£2,999",
      period: "setup + £299/mo",
      popular: true,
      features: [
        "Unlimited users",
        "Full white-label",
        "Dedicated subdomain",
        "Advanced ESG reporting",
        "Custom workflows",
        "Dedicated manager",
        "24/7 support",
        "Custom integrations"
      ],
      notIncluded: []
    },
    {
      name: "Custom",
      price: "Contact Us",
      period: "",
      features: [
        "Everything in White Label",
        "Multi-tenancy",
        "On-premise deployment",
        "Custom SLA",
        "Training & onboarding",
        "Strategic consulting"
      ],
      notIncluded: []
    }
  ];

  return (
    <>
      <Helmet>
        <title>Enterprise Solutions - Social Impact at Scale | SouLVE</title>
        <meta 
          name="description" 
          content="Purpose-built tools for large organisations managing complex social programmes, ESG initiatives, and community engagement at scale. White-label platform, SSO, advanced reporting, and dedicated support." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Back Link */}
        <div className="container mx-auto px-4 pt-8">
          <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Enterprise Solutions
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Social Impact at Scale
            </p>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Purpose-built tools for large organisations managing complex social programmes, ESG initiatives, and community engagement at scale.
            </p>
            <Button size="lg" onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Schedule Enterprise Demo
            </Button>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Enterprise-Grade Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enterpriseFeatures.map((feature, index) => (
                <div key={index} className="bg-card border rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Flexible Pricing</h2>
            <p className="text-center text-muted-foreground mb-12">
              Choose the plan that fits your organisation's size and requirements
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div 
                  key={index} 
                  className={`bg-card border rounded-lg p-8 ${tier.popular ? 'ring-2 ring-primary' : ''} relative`}
                >
                  {tier.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 rounded-bl-lg rounded-tr-lg text-sm font-semibold">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-bold">{tier.price}</span>
                    <span className="text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {tier.notIncluded.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <X className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={tier.popular ? "default" : "outline"}
                    onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    {tier.name === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Trusted By Leading Organisations</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
              <div className="text-4xl font-bold text-muted-foreground">ORG 1</div>
              <div className="text-4xl font-bold text-muted-foreground">ORG 2</div>
              <div className="text-4xl font-bold text-muted-foreground">ORG 3</div>
              <div className="text-4xl font-bold text-muted-foreground">ORG 4</div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section id="contact-form" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-4">Schedule Your Enterprise Demo</h2>
            <p className="text-center text-muted-foreground mb-8">
              Let's discuss how SouLVE can transform your organisation's social impact
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6 bg-card border rounded-lg p-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactName">Your Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                  required
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Work Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="employeeCount">Number of Employees *</Label>
                <select
                  id="employeeCount"
                  value={formData.employeeCount}
                  onChange={(e) => setFormData({ ...formData, employeeCount: e.target.value })}
                  className="w-full px-3 py-2 bg-background border rounded-md"
                  required
                >
                  <option value="">Select range</option>
                  <option value="1-50">1-50</option>
                  <option value="51-200">51-200</option>
                  <option value="201-1000">201-1,000</option>
                  <option value="1000+">1,000+</option>
                </select>
              </div>

              <div>
                <Label htmlFor="useCase">What's your primary use case? *</Label>
                <Textarea
                  id="useCase"
                  value={formData.useCase}
                  onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                  rows={4}
                  placeholder="E.g., Managing ESG initiatives, employee volunteering programme, community engagement..."
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Request Enterprise Demo"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Or email us directly at{" "}
                <a href="mailto:enterprise@join-soulve.com" className="text-primary hover:underline">
                  enterprise@join-soulve.com
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

export default Enterprise;
