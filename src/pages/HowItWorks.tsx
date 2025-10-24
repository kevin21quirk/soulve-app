import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { UserPlus, Shield, Users, Award, Heart, TrendingUp, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const HowItWorks = () => {
  return (
    <>
      <Helmet>
        <title>How SouLVE Works - Social Media for Social Good</title>
        <meta 
          name="description" 
          content="SouLVE is social media for social good. Post, share, and engage like you normally do—but create real community impact. Learn how it works." 
        />
        <meta property="og:title" content="How SouLVE Works - Social Media That Changes Lives" />
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
                SouLVE: Social Media That Changes Lives
              </h1>
              <p className="text-xl text-teal-100">
                Connect, share, and engage like you normally do—but every like, share, and post creates measurable social impact in your community.
              </p>
            </div>
          </div>
        </section>

        {/* Social Media Context Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted/30">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-6">It's Social Media, Reimagined</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                Post updates, share stories, build your feed—just like Instagram, Facebook, or Twitter. But here's the twist: Your engagement powers real change.
              </p>
              <div className="flex flex-wrap justify-center gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">📱</span>
                  </div>
                  <p className="font-semibold">Posts & Stories</p>
                  <p className="text-sm text-muted-foreground">Share your impact</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">❤️</span>
                  </div>
                  <p className="font-semibold">Likes That Matter</p>
                  <p className="text-sm text-muted-foreground">Support causes</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">👥</span>
                  </div>
                  <p className="font-semibold">Your Feed</p>
                  <p className="text-sm text-muted-foreground">Discover impact</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <span className="text-3xl">🌍</span>
                  </div>
                  <p className="font-semibold">Real Change</p>
                  <p className="text-sm text-muted-foreground">Measurable impact</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <UserPlus className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">1. Set Up Your Profile</h3>
                  <p className="text-muted-foreground text-lg">
                    Like any social network, create your profile, add photos, and share your interests. 
                    But unlike other platforms, your profile also shows causes you care about and skills you can share to make a difference.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">2. Follow & Connect</h3>
                  <p className="text-muted-foreground text-lg">
                    Follow friends, local causes, and community members. Your feed shows posts from people making a difference, 
                    campaigns you care about, and local needs—all curated to match your interests.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">3. Post, Share & Engage</h3>
                  <p className="text-muted-foreground text-lg">
                    Share your story, post updates, react to content—just like any social platform. 
                    But here, every like supports a cause, every share spreads awareness, and every comment builds community.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">4. Your Engagement Creates Impact</h3>
                  <p className="text-muted-foreground text-lg">
                    Unlike traditional social media where engagement just feeds algorithms, on SouLVE your activity translates to real-world impact: 
                    volunteer hours logged, donations made, problems solved.
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
                  <h3 className="text-2xl font-semibold mb-2">5. Build Your Impact Reputation</h3>
                  <p className="text-muted-foreground text-lg">
                    Just like followers and likes elsewhere, here you build an impact score. 
                    Earn recognition, badges, and trust that opens doors in your community.
                  </p>
                </div>
              </div>

              {/* Step 6 */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <Shield className="w-8 h-8 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-semibold mb-2">6. See Your Ripple Effect</h3>
                  <p className="text-muted-foreground text-lg">
                    Track how your posts, shares, and engagement created real change. 
                    Watch your dashboard grow as you make a difference through everyday social media habits.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Familiar Features, Purposeful Impact</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Smart Feed</h3>
                <p className="text-muted-foreground">
                  Your personalized feed surfaces causes you care about, people making a difference, 
                  and opportunities to help—powered by AI that understands your passions.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Verified Profiles</h3>
                <p className="text-muted-foreground">
                  Trust scores and verification badges ensure authentic connections. Know who you're 
                  engaging with through transparent reputation systems.
                </p>
              </div>
              <div className="bg-card p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3">Impact Analytics</h3>
                <p className="text-muted-foreground">
                  Unlike vanity metrics, see the real-world value you create: lives touched, 
                  hours volunteered, and community problems solved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What Makes SouLVE Different?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-8 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-muted-foreground">Traditional Social Media</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Engagement feeds advertisements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Likes = personal validation</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Shares = virality for profit</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Time spent = platform revenue</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Algorithm = engagement trap</span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 rounded-lg border-2 border-primary/20">
                <h3 className="text-xl font-semibold mb-4">SouLVE</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Engagement creates social impact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Likes = support for causes</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Shares = awareness that helps</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Time spent = community value</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-primary">✓</span>
                    <span>Algorithm = purpose matching</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-12 bg-primary/5 p-8 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">It's Still Social Media</h3>
              <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
                <div>
                  <p className="font-semibold text-primary mb-2">✓ Yes, you can still:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Post photos, videos, and updates</li>
                    <li>• Chat with friends and make new connections</li>
                    <li>• Browse your feed and discover content</li>
                    <li>• Use stories and all familiar features</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-2">➕ Plus:</p>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Every interaction creates measurable good</li>
                    <li>• Your time builds real community value</li>
                    <li>• Connect with purpose-driven people</li>
                    <li>• See the impact you're making</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Join the social media platform where your everyday engagement creates real-world change.
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
