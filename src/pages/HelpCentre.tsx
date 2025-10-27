import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { HandHeart, Users, Clock, AlertCircle, Shield, TrendingUp, ArrowLeft, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

const HelpCentre = () => {
  return (
    <>
      <Helmet>
        <title>Help Centre - Community Support & Safe Spaces | SouLVE</title>
        <meta 
          name="description" 
          content="Access SouLVE's Help Centre to request community support, volunteer your skills, connect with Safe Space helpers, and make a measurable difference in your local community." 
        />
        <meta property="og:title" content="Help Centre - Connect, Support, Make a Difference" />
        <meta property="og:description" content="Request help, volunteer skills, and track your community impact through SouLVE's Help Centre." />
        <link rel="canonical" href="https://join-soulve.com/help-center" />
      </Helmet>

      <main className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Community Help Centre
              </h1>
              <p className="text-xl text-teal-100">
                Connect, support, and make a real difference in your local community through our comprehensive help platform.
              </p>
            </div>
          </div>
        </section>

        {/* Overview Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What is the Help Centre?</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground">
                The Help Centre is your gateway to meaningful community support. Whether you need help with daily tasks, 
                want to volunteer your skills, or seek connection through Safe Spaces, this platform transforms 
                individual actions into collective impact.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                Unlike traditional support systems, the Help Centre combines trust-based connections, verified helpers, 
                and measurable impact tracking to create a sustainable ecosystem where everyone can both give and receive support.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <HandHeart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Request Support</h3>
                <p className="text-muted-foreground">
                  Create help requests for everyday needs—from grocery runs to tech support—and connect with verified community helpers.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Volunteer Skills</h3>
                <p className="text-muted-foreground">
                  Browse community needs, offer your time and expertise, and build meaningful connections while making a difference.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Impact</h3>
                <p className="text-muted-foreground">
                  See the real difference you're making with detailed analytics on hours volunteered, people helped, and community value created.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <AlertCircle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Urgent Needs</h3>
                <p className="text-muted-foreground">
                  Quickly identify time-sensitive requests that need immediate attention from your local community.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Safe Spaces</h3>
                <p className="text-muted-foreground">
                  Connect with trained Safe Space Helpers for confidential support, guidance, and a listening ear when you need it most.
                </p>
              </div>

              <div className="bg-card p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Join Campaigns</h3>
                <p className="text-muted-foreground">
                  Discover and support active causes and campaigns that align with your values and create lasting change.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    1
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Access the Help Centre</h3>
                  <p className="text-muted-foreground">
                    Log into your SouLVE account and navigate to the Help Centre from your dashboard. 
                    The platform is available 24/7 to create requests or browse opportunities.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    2
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Create or Respond</h3>
                  <p className="text-muted-foreground">
                    Need help? Create a detailed request specifying what you need and when. 
                    Want to help? Browse active requests and campaigns that match your skills and availability.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    3
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Connect Safely</h3>
                  <p className="text-muted-foreground">
                    All helpers are verified through our trust system. View profiles, check ratings, 
                    and communicate securely through the platform before meeting.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    4
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Make It Happen</h3>
                  <p className="text-muted-foreground">
                    Coordinate timing, complete the help request, and share your experience. 
                    Both parties can provide feedback to strengthen the community trust network.
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    5
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Track Your Impact</h3>
                  <p className="text-muted-foreground">
                    Watch your impact dashboard grow as you help others or receive support. 
                    Earn recognition badges and build your reputation as a trusted community member.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Community Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                <p className="text-muted-foreground">People Helped</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">50K+</div>
                <p className="text-muted-foreground">Hours Volunteered</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-muted-foreground">Active Campaigns</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">2K+</div>
                <p className="text-muted-foreground">Verified Helpers</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Join thousands of community members creating real impact through meaningful connections.
            </p>
            <Link to="/dashboard?tab=help-center">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-teal-50">
                Access Help Centre
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default HelpCentre;
