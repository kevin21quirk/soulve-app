import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { UserPlus, Shield, Users, Award, Heart, TrendingUp, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  return (
    <>
      <Helmet>
        <title>How SouLVE Works - Trust-Based Community Connection Platform</title>
        <meta 
          name="description" 
          content="Discover how SouLVE connects community members through verified trust scores, meaningful interactions, and authentic relationships. Learn about our step-by-step process." 
        />
        <meta property="og:title" content="How SouLVE Works - Community Connection Made Simple" />
        <link rel="canonical" href="https://join-soulve.com/how-it-works" />
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
              How SouLVE Works
            </h1>
              <p className="text-xl text-teal-100">
                Building trust, fostering connections, and measuring impact - one interaction at a time.
              </p>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Getting Started is Simple</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">1. Create Your Profile</h3>
                  <p className="text-muted-foreground text-lg">
                    Join the SouLVE community by creating your profile. Share your interests, skills, 
                    and what kind of support you can offer or need. The more complete your profile, 
                    the better we can match you with relevant opportunities.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">2. Build Your Trust Score</h3>
                  <p className="text-muted-foreground text-lg">
                    Your trust score grows as you verify your identity, complete your profile, and 
                    participate authentically in the community. A higher trust score unlocks more 
                    opportunities and builds confidence with other members.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">3. Connect & Engage</h3>
                  <p className="text-muted-foreground text-lg">
                    Browse local needs, offer help, join campaigns, or create posts requesting support. 
                    Our AI-powered recommendations surface opportunities that match your interests and 
                    capabilities, but the connections are always human-to-human.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">4. Make Real Impact</h3>
                  <p className="text-muted-foreground text-lg">
                    Whether you're volunteering time, sharing skills, or participating in campaigns, 
                    every action creates measurable impact. Help neighbors, support causes, and 
                    strengthen your local community.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">5. Earn Recognition</h3>
                  <p className="text-muted-foreground text-lg">
                    Collect badges, increase your impact score, and unlock special opportunities. 
                    Your contributions are recognized and celebrated, building a reputation that 
                    opens doors within the community.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">6. Track Your Journey</h3>
                  <p className="text-muted-foreground text-lg">
                    View your impact dashboard to see the lives you've touched, hours volunteered, 
                    and community value created. Watch your trust score grow as you build meaningful 
                    connections and make a difference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Smart Matching</h3>
                <p className="text-muted-foreground">
                  AI-powered recommendations connect you with opportunities that match your interests, 
                  skills, and availability.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Trust Verification</h3>
                <p className="text-muted-foreground">
                  Multiple verification levels ensure authentic connections and safe interactions 
                  throughout the platform.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Impact Tracking</h3>
                <p className="text-muted-foreground">
                  See the real-world value of your contributions with detailed impact metrics and 
                  community feedback.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Join SouLVE today and start building meaningful connections in your community.
            </p>
            <Link 
              to="/auth"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default HowItWorks;
