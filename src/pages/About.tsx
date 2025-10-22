import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Users, Heart, Shield, TrendingUp, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <>
      <Helmet>
        <title>About SouLVE - Bridging the Human Gap Through Trust-Based Connections</title>
        <meta 
          name="description" 
          content="Learn how SouLVE is creating meaningful community connections that AI cannot replicate. Discover our mission, values, and the impact we're making in local communities." 
        />
        <meta property="og:title" content="About SouLVE - Building Trust-Based Communities" />
        <meta property="og:description" content="Discover how SouLVE bridges the human gap through authentic, trust-based community connections." />
        <link rel="canonical" href="https://join-soulve.com/about" />
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
              Bridging the Human Gap
            </h1>
              <p className="text-xl text-teal-100">
                AI can connect information, but only humans can connect hearts. 
                SouLVE creates the platform where authentic community relationships flourish.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Mission</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground">
                SouLVE was founded on a simple belief: that technology should bring people closer together, 
                not replace human connection. While AI excels at processing information, it cannot replicate 
                the trust, empathy, and understanding that comes from genuine human interaction.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                We're building a platform that leverages technology to facilitate meaningful connections 
                while keeping humanity at the center. Through verified trust scores, community-driven 
                support, and authentic relationships, we're creating neighborhoods where people help people.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community First</h3>
                <p className="text-muted-foreground">
                  Every feature is designed to strengthen community bonds and foster genuine relationships.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Shield className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  Building trust through verification, transparency, and robust safety measures.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Human Connection</h3>
                <p className="text-muted-foreground">
                  Technology enables, but humans connect. We prioritize authentic interactions.
                </p>
              </div>
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <TrendingUp className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Measurable Impact</h3>
                <p className="text-muted-foreground">
                  Tracking and celebrating every act of kindness and community support.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground">
                SouLVE was born from a simple observation: as our world becomes more digitally connected, 
                many communities are becoming less personally connected. Neighbors don't know each other, 
                local support networks are weakening, and trust between strangers is declining.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                While AI and automation solve many problems, they can't replace the fundamental human need 
                for genuine connection, trust, and community support. That's the gap we're bridging.
              </p>
              <p className="text-lg text-muted-foreground mt-4">
                Today, SouLVE connects individuals, organizations, and communities in meaningful ways that 
                create real-world impact. From helping neighbors find assistance to enabling businesses to 
                support their communities, we're rebuilding the social fabric that makes neighborhoods thrive.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Join the Movement</h2>
            <p className="text-xl text-teal-100 mb-8">
              Be part of building better communities through meaningful connections.
            </p>
            <Link 
              to="/auth"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              Join SouLVE
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default About;
