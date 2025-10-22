import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Accessibility, Keyboard, Ear, Eye, Gauge, Type, ImageIcon, ExternalLink } from "lucide-react";

const AccessibilityStatement = () => {
  const features = [
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Navigate the entire platform using only your keyboard. All interactive elements are accessible via Tab, Enter, and arrow keys with visible focus indicators.",
    },
    {
      icon: Ear,
      title: "Screen Reader Support",
      description: "Full compatibility with JAWS, NVDA, VoiceOver, and TalkBack. ARIA labels, landmarks, and semantic HTML throughout for seamless navigation.",
    },
    {
      icon: Eye,
      title: "High Contrast Mode",
      description: "Automatic detection and support for high contrast system preferences with enhanced visual clarity and colour differentiation.",
    },
    {
      icon: Gauge,
      title: "Reduced Motion",
      description: "Respects prefers-reduced-motion settings. Animations can be disabled for users with vestibular disorders or motion sensitivity.",
    },
    {
      icon: Type,
      title: "Text Scaling",
      description: "Content remains readable and fully functional at up to 200% zoom. Font sizes, spacing, and layouts adjust responsively.",
    },
    {
      icon: ImageIcon,
      title: "Alternative Text",
      description: "All images include descriptive alt text. Complex graphics and charts have long descriptions available for screen reader users.",
    },
  ];

  const assistiveTech = [
    "JAWS (Job Access With Speech)",
    "NVDA (NonVisual Desktop Access)",
    "Apple VoiceOver (macOS, iOS)",
    "Google TalkBack (Android)",
    "Dragon NaturallySpeaking",
    "ZoomText Screen Magnification",
  ];

  return (
    <>
      <Helmet>
        <title>Accessibility Statement | SouLVE</title>
        <meta
          name="description"
          content="SouLVE is committed to ensuring digital accessibility for all users. Learn about our WCAG 2.1 Level AA compliance, accessibility features, and how to report issues."
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <main className="pb-16">
          {/* Back Link */}
          <div className="container mx-auto px-4 pt-8">
            <Link to="/" className="inline-flex items-center text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>

          {/* Hero Section */}
          <section className="container mx-auto px-4 py-16 md:py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-8">
              <Accessibility className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-foreground">
              Accessibility Statement
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              SouLVE is committed to ensuring digital accessibility for all people, including those with disabilities. 
              We are continually improving the user experience for everyone and applying relevant accessibility standards.
            </p>
          </section>

          {/* Commitment Statement */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <Card className="border-border/50">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold mb-6">Our Commitment</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg">
                    We believe that everyone deserves equal access to social impact opportunities and community support, 
                    regardless of their abilities or the technology they use.
                  </p>
                  <p className="text-lg">
                    SouLVE aims to conform to <strong>WCAG 2.1 Level AA</strong> standards wherever possible. 
                    We follow inclusive design principles and continuously work to remove accessibility barriers.
                  </p>
                  <p className="text-lg">
                    Accessibility is not a project—it's an ongoing commitment. We regularly audit our platform, 
                    incorporate user feedback, and update our features to ensure everyone can participate fully.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Accessibility Features */}
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Accessibility Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                  <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                        <feature.icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Conformance Status */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Conformance Status</h2>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <p className="text-lg text-muted-foreground mb-4">
                  <strong className="text-foreground">Partially conformant</strong> with WCAG 2.1 Level AA
                </p>
                <p className="text-muted-foreground mb-4">
                  This means that some parts of the content do not fully conform to the accessibility standard. 
                  We are actively working to address known limitations and improve compliance.
                </p>
                <div className="bg-muted/50 p-4 rounded-lg mt-6">
                  <h3 className="font-semibold mb-2">Assessment Approach:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• External accessibility consultancy review (Q4 2025)</li>
                    <li>• Automated testing with axe DevTools and Lighthouse</li>
                    <li>• Manual testing with screen readers and keyboard navigation</li>
                    <li>• User testing with people with disabilities</li>
                  </ul>
                  <p className="text-xs text-muted-foreground mt-4">
                    <strong>Last Updated:</strong> December 2025 | <strong>Next Review:</strong> June 2026
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Assistive Technologies */}
          <section className="bg-primary/5 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-6">
                Supported Assistive Technologies
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                SouLVE is designed to work with the following assistive technologies:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {assistiveTech.map((tech, index) => (
                  <Card key={index} className="border-border/50">
                    <CardContent className="p-4 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium">{tech}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Known Limitations */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <h2 className="text-3xl font-bold mb-6">Known Limitations</h2>
            <Card className="border-border/50">
              <CardContent className="p-8">
                <p className="text-muted-foreground mb-4">
                  We are transparent about areas where we're still improving:
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Campaign image uploads:</strong> Some user-generated content may lack proper alt text. 
                    We're implementing alt text prompts and AI-assisted descriptions. <em>Target: Q2 2026</em></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Real-time messaging:</strong> Screen reader announcements for new messages need refinement. 
                    <em>Target: Q1 2026</em></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">•</span>
                    <span><strong>Complex data visualisations:</strong> Some charts in impact reports may be difficult to interpret with screen readers. 
                    We're adding data tables and text summaries. <em>Target: Q2 2026</em></span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Technical Specifications */}
          <section className="bg-muted/30 py-16">
            <div className="container mx-auto px-4 max-w-4xl">
              <h2 className="text-3xl font-bold text-center mb-12">
                Technical Specifications
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Supported Browsers</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Chrome (latest 2 versions)</li>
                      <li>• Firefox (latest 2 versions)</li>
                      <li>• Safari (latest 2 versions)</li>
                      <li>• Edge (latest 2 versions)</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-border/50">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Technologies Used</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• React 18 with TypeScript</li>
                      <li>• Semantic HTML5</li>
                      <li>• ARIA attributes and landmarks</li>
                      <li>• CSS custom properties for theming</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>

          {/* Feedback & Contact */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-8 text-center">
                <h2 className="text-3xl font-bold mb-4">
                  We Welcome Your Feedback
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  If you encounter any accessibility barriers on SouLVE, please let us know. 
                  Your feedback helps us improve the experience for everyone.
                </p>
                <div className="space-y-3 mb-6">
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Email:</strong>{" "}
                    <a href="mailto:accessibility@join-soulve.com" className="text-primary hover:underline">
                      accessibility@join-soulve.com
                    </a>
                  </p>
                  <p className="text-muted-foreground">
                    <strong className="text-foreground">Response Time:</strong> We aim to respond within 5 business days
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" asChild>
                    <Link to="/contact">Report Accessibility Issue</Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <a 
                      href="https://www.w3.org/WAI/WCAG21/quickref/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      WCAG Guidelines <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Legal Statement */}
          <section className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="text-center text-sm text-muted-foreground space-y-2">
              <p>
                This accessibility statement applies to the SouLVE platform at{" "}
                <a href="https://join-soulve.com" className="text-primary hover:underline">
                  join-soulve.com
                </a>
              </p>
              <p>
                We are committed to meeting our obligations under the Equality Act 2010 (UK) and related accessibility regulations.
              </p>
            </div>
          </section>
        </main>
      </div>
    </>
  );
};

export default AccessibilityStatement;
