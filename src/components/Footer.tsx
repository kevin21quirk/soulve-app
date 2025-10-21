import { useState } from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SouLVELogo from "./SouLVELogo";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("newsletter_subscribers")
        .insert({ email });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already Subscribed",
            description: "You're already part of our community!",
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Welcome to the SouLVE Community!",
          description: "You'll be the first to know when we launch.",
        });
        setEmail("");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-grey-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="mb-12 pb-12 border-b border-grey-800">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Connected</h3>
            <p className="text-grey-400 mb-6">
              Get the latest updates, stories, and impact news delivered to your inbox.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-white/10 border-grey-700 text-white placeholder:text-grey-500"
                required
              />
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="md:col-span-2">
            <SouLVELogo />
            <p className="text-grey-400 text-sm mt-4">
              Bridging the human gap AI cannot reach through trust-based community connections.
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4 mt-6">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-400 hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-400 hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-400 hover:text-primary transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-grey-400 hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-grey-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About SouLVE</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How It Works</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colors">Blog & News</Link></li>
              <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
              <li><a href="mailto:info@join-soulve.com" className="hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-grey-400 text-sm">
              <li><Link to="/faq" className="hover:text-white transition-colors">Help Centre</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colours">FAQs</Link></li>
              <li><Link to="/trust-safety" className="hover:text-white transition-colours">Trust & Safety</Link></li>
              <li><Link to="/blog" className="hover:text-white transition-colours">Impact Stories</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-grey-400 text-sm">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colours">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="hover:text-white transition-colours">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="hover:text-white transition-colours">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-grey-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-grey-400 text-sm text-center md:text-left">
            &copy; 2024 SouLVE. Building better communities through meaningful connections.
          </p>
          <div className="flex items-center gap-2 text-grey-400 text-sm">
            <Mail className="w-4 h-4" />
            <a href="mailto:info@join-soulve.com" className="hover:text-white transition-colors">
              info@join-soulve.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
