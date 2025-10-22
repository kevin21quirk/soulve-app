import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Briefcase, Heart, Users, Rocket, ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const Careers = () => {
  return (
    <>
      <Helmet>
        <title>Careers at SouLVE - Build Technology That Brings Communities Together</title>
        <meta 
          name="description" 
          content="Join the SouLVE team and help bridge the human gap through technology. Explore career opportunities in building trust-based community platforms." 
        />
        <meta property="og:title" content="Careers at SouLVE - Join Our Mission" />
        <link rel="canonical" href="https://join-soulve.com/careers" />
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
              Join Our Mission
            </h1>
              <p className="text-xl text-teal-100">
                Help us build technology that brings communities together and creates meaningful human connections.
              </p>
            </div>
          </div>
        </section>

        {/* Why Join Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Join SouLVE?</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Meaningful Work</h3>
                  <p className="text-muted-foreground">
                    Every line of code, every design decision, and every feature you build has a direct 
                    impact on real people's lives and communities.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Collaborative Culture</h3>
                  <p className="text-muted-foreground">
                    Work with a passionate team that values collaboration, innovation, and the power 
                    of community connection.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Rocket className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
                  <p className="text-muted-foreground">
                    We're at an exciting stage of growth. Join us early and shape the future of 
                    community technology while advancing your career.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Competitive Benefits</h3>
                  <p className="text-muted-foreground">
                    We offer competitive compensation, flexible working arrangements, and comprehensive 
                    benefits to support your well-being.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions Section */}
        <section className="bg-muted/50 py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
            <div className="bg-card p-8 rounded-lg text-center">
              <Briefcase className="w-16 h-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">We're Growing!</h3>
              <p className="text-muted-foreground text-lg mb-6">
                We're currently building our team and will be posting open positions soon. 
                If you're passionate about using technology to strengthen communities, we'd love to hear from you.
              </p>
              <a 
                href="mailto:careers@join-soulve.com"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get In Touch
              </a>
            </div>
          </div>
        </section>

        {/* What We Look For Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">What We Look For</h2>
            <div className="prose prose-lg max-w-none">
              <ul className="space-y-4 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Passion for building products that make a real difference in people's lives</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Strong technical skills combined with empathy for users and communities</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Collaborative mindset and ability to work effectively in a team environment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Experience or interest in community building, social impact, or trust & safety</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Commitment to ethical technology development and user privacy</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-primary">✓</span>
                  <span>Self-motivated with excellent problem-solving abilities</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Interested in Joining Us?</h2>
            <p className="text-xl text-teal-100 mb-8">
              Even if we don't have an open position that matches your skillset, we'd love to connect.
            </p>
            <a 
              href="mailto:careers@join-soulve.com"
              className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-teal-50 transition-colors"
            >
              careers@join-soulve.com
            </a>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default Careers;
