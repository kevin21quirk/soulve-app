import SEOHead from "@/components/seo/SEOHead";
import StructuredData from "@/components/seo/StructuredData";
import BreadcrumbNav from "@/components/seo/BreadcrumbNav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Mail, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "@/components/Footer";

const Press = () => {
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Press & Media", href: "/press" },
  ];

  const stats = [
    { label: "Active Users", value: "10,000+", description: "Growing community" },
    { label: "Campaigns Funded", value: "£500K+", description: "Total raised" },
    { label: "Social Impact", value: "5,000+", description: "Lives impacted" },
    { label: "Organizations", value: "200+", description: "Partner charities" },
  ];

  return (
    <>
      <SEOHead
        title="Press & Media Kit - SouLVE"
        description="SouLVE press resources, brand assets, company information, and media contact. Download logos, screenshots, and learn about our social impact platform."
        keywords={['press', 'media kit', 'brand assets', 'company info', 'press releases', 'media contact']}
        url="https://join-soulve.com/press"
      />
      
      <StructuredData
        type="Organization"
        data={{
          name: "SouLVE",
          description: "Social Impact Platform - Press & Media Resources",
          url: "https://join-soulve.com/press",
          logo: "https://join-soulve.com/og-image.png",
          sameAs: [
            "https://twitter.com/soulve",
            "https://linkedin.com/company/soulve",
          ],
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Hero Section with Gradient */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Press & Media Kit</h1>
              <p className="text-xl text-teal-100">
                Welcome to the SouLVE press center. Find everything you need to cover our story.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <div className="container mx-auto px-4 py-16">
          {/* About SouLVE */}
          <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">About SouLVE</h2>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg mb-4">
                    SouLVE is a next-generation social impact platform that connects individuals, 
                    organizations, and communities to create lasting positive change. Through innovative 
                    technology and a gamified approach to social good, we're making it easier than ever 
                    to contribute to causes that matter.
                  </p>
                  <p className="text-lg mb-4">
                    Our platform enables fundraising campaigns, volunteer coordination, ESG tracking for 
                    organizations, and a trusted community of helpers and supporters. With features like 
                    impact badges, trust scoring, and comprehensive analytics, SouLVE is redefining how 
                    social impact is created and measured.
                  </p>
                </CardContent>
              </Card>
            </section>

          {/* Key Statistics */}
          <section className="bg-muted/50 py-16 -mx-4 px-4 mb-16">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">Key Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, idx) => (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="text-4xl font-bold text-primary">
                          {stat.value}
                        </CardTitle>
                        <CardDescription className="text-lg font-semibold">
                          {stat.label}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{stat.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
          </section>

          {/* Brand Assets */}
          <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Brand Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Logo Package</CardTitle>
                    <CardDescription>
                      High-resolution logos in various formats (PNG, SVG, PDF)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Logos
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Screenshots</CardTitle>
                    <CardDescription>
                      Product screenshots and marketing images
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Screenshots
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Brand Guidelines</CardTitle>
                    <CardDescription>
                      Colors, typography, and usage guidelines
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Guidelines
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Fact Sheet</CardTitle>
                    <CardDescription>
                      Company information and key facts
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Download Fact Sheet
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

          {/* Press Releases */}
          <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Recent Press Releases</h2>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>SouLVE Launches Revolutionary Social Impact Platform</CardTitle>
                    <CardDescription>January 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      SouLVE announces the launch of its comprehensive social impact platform, 
                      combining fundraising, volunteering, and ESG tracking in one unified solution.
                    </p>
                    <Button variant="link" className="px-0">
                      Read more <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </section>

          {/* Media Contact */}
          <section className="mb-16">
              <h2 className="text-3xl font-bold mb-6">Media Contact</h2>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">Press Inquiries</h3>
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        press@soulve.com
                      </Button>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2">General Information</h3>
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        info@soulve.com
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-2">Partnership Opportunities</h3>
                      <Button variant="outline">
                        <Mail className="mr-2 h-4 w-4" />
                        partnerships@soulve.com
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </section>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Press;
