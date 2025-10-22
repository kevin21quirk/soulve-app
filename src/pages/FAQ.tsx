import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Footer from "@/components/Footer";

const FAQ = () => {
  return (
    <>
      <Helmet>
        <title>FAQ - Frequently Asked Questions About SouLVE Community Platform</title>
        <meta 
          name="description" 
          content="Find answers to common questions about SouLVE, including trust scores, safety measures, getting started, and how to make the most of community connections." 
        />
        <meta property="og:title" content="FAQ - Your Questions About SouLVE Answered" />
        <link rel="canonical" href="https://join-soulve.com/faq" />
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
              Frequently Asked Questions
            </h1>
              <p className="text-xl text-teal-100">
                Everything you need to know about SouLVE and how it works.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq-section" className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4 scroll-smooth">
              <AccordionItem value="item-1" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What is SouLVE?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  SouLVE is a trust-based community platform that connects people who need help with 
                  those who can provide it. We bridge the gap between technology and human connection, 
                  creating authentic relationships within local communities.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How does the trust score work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Your trust score is calculated based on multiple factors including identity verification, 
                  profile completeness, community feedback, and your history of interactions. It starts at 50 
                  and can increase up to 100 as you verify your identity and participate authentically in 
                  the community.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Is SouLVE free to use?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! SouLVE is free for individual community members. We offer premium features for 
                  organizations and businesses looking to amplify their community impact and CSR initiatives.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do you ensure safety on the platform?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  We take safety seriously with multiple verification levels, trust scores, community reporting 
                  tools, and a dedicated safeguarding team. For sensitive situations, we offer Safe Space Helpers 
                  who are DBS-checked and specially trained professionals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can organizations join SouLVE?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Absolutely! Charities, nonprofits, social enterprises, and businesses can create organization 
                  profiles to connect with community members, run campaigns, track ESG initiatives, and demonstrate 
                  their social impact.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What kind of help can I request or offer?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can request or offer practical help (moving, repairs, errands), emotional support, 
                  professional skills (CV help, mentoring), volunteer opportunities, donations, and more. 
                  If it strengthens community connections, it belongs on SouLVE.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-7" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do impact points work?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Impact points are earned through community participation - helping others, volunteering, 
                  completing requests, and contributing to campaigns. Points reflect both your time invested 
                  and the market value of services provided. They're displayed on your profile and unlock badges 
                  and recognition.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-8" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What are badges and how do I earn them?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Badges recognize achievements and milestones within the community. They're earned by completing 
                  specific actions like helping multiple people, volunteering hours, or participating in campaigns. 
                  Some badges are limited edition and tied to special events.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-9" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How do I get started?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Sign up with your email, complete your profile with your interests and skills, verify your 
                  identity to build your trust score, and start exploring opportunities to help or request support 
                  in your community.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-10" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  Can I use SouLVE if I'm not tech-savvy?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Yes! We've designed SouLVE to be intuitive and user-friendly. If you can send an email, 
                  you can use SouLVE. Plus, our community is here to help if you have questions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-11" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  What if something goes wrong with a connection?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  You can report any concerns directly through the platform. Our team reviews all reports promptly 
                  and takes appropriate action. For urgent safety concerns, we have immediate escalation procedures.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-12" className="border rounded-lg px-6">
                <AccordionTrigger className="text-left">
                  How does SouLVE make money?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  SouLVE offers premium features to organizations including enhanced campaign tools, ESG reporting, 
                  advanced analytics, and dedicated support. Individual community members always have free access 
                  to core features.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Contact Section */}
            <div className="mt-12 p-8 bg-muted/50 rounded-lg text-center">
              <h3 className="text-2xl font-semibold mb-4">Still Have Questions?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find the answer you're looking for? We're here to help.
              </p>
              <Link 
                to="/register"
                className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default FAQ;
