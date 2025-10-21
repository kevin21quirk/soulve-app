import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Links Grid - Clean, no headers */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-2 mb-6">
          {/* Column 1 */}
          <div className="space-y-1">
            <Link to="/about" className="block text-xs text-muted-foreground hover:underline">About SouLVE</Link>
            <Link to="/how-it-works" className="block text-xs text-muted-foreground hover:underline">How It Works</Link>
            <Link to="/careers" className="block text-xs text-muted-foreground hover:underline">Careers</Link>
            <Link to="/press" className="block text-xs text-muted-foreground hover:underline">Press & Media</Link>
            <Link to="/team" className="block text-xs text-muted-foreground hover:underline">Team</Link>
            <Link to="/blog" className="block text-xs text-muted-foreground hover:underline">Blog</Link>
          </div>

          {/* Column 2 */}
          <div className="space-y-1">
            <Link to="/discover" className="block text-xs text-muted-foreground hover:underline">Discover People</Link>
            <Link to="/groups" className="block text-xs text-muted-foreground hover:underline">Find Groups</Link>
            <Link to="/campaigns" className="block text-xs text-muted-foreground hover:underline">Join Campaigns</Link>
            <Link to="/events" className="block text-xs text-muted-foreground hover:underline">Create Events</Link>
            <Link to="/stories" className="block text-xs text-muted-foreground hover:underline">Impact Stories</Link>
            <Link to="/helpers" className="block text-xs text-muted-foreground hover:underline">Safe Space Helpers</Link>
          </div>

          {/* Column 3 */}
          <div className="space-y-1">
            <Link to="/faq" className="block text-xs text-muted-foreground hover:underline">Help Centre</Link>
            <Link to="/faq" className="block text-xs text-muted-foreground hover:underline">FAQs</Link>
            <Link to="/guidelines" className="block text-xs text-muted-foreground hover:underline">Community Guidelines</Link>
            <Link to="/trust-safety" className="block text-xs text-muted-foreground hover:underline">Trust & Safety</Link>
            <Link to="/impact" className="block text-xs text-muted-foreground hover:underline">Impact Reports</Link>
            <Link to="/api" className="block text-xs text-muted-foreground hover:underline">Developer API</Link>
          </div>

          {/* Column 4 */}
          <div className="space-y-1">
            <Link to="/terms-of-service" className="block text-xs text-muted-foreground hover:underline">Terms of Service</Link>
            <Link to="/privacy-policy" className="block text-xs text-muted-foreground hover:underline">Privacy Policy</Link>
            <Link to="/cookie-policy" className="block text-xs text-muted-foreground hover:underline">Cookie Policy</Link>
            <Link to="/contact" className="block text-xs text-muted-foreground hover:underline">Contact Us</Link>
            <Link to="/report" className="block text-xs text-muted-foreground hover:underline">Report Issue</Link>
            <Link to="/accessibility" className="block text-xs text-muted-foreground hover:underline">Accessibility</Link>
          </div>

          {/* Column 5 */}
          <div className="space-y-1">
            <Link to="/volunteer" className="block text-xs text-muted-foreground hover:underline">Volunteer</Link>
            <Link to="/donate" className="block text-xs text-muted-foreground hover:underline">Donate</Link>
            <Link to="/partner" className="block text-xs text-muted-foreground hover:underline">Partner With Us</Link>
            <Link to="/newsletter" className="block text-xs text-muted-foreground hover:underline">Newsletter</Link>
            <Link to="/resources" className="block text-xs text-muted-foreground hover:underline">Resources</Link>
            <Link to="/testimonials" className="block text-xs text-muted-foreground hover:underline">Testimonials</Link>
          </div>

          {/* Column 6 */}
          <div className="space-y-1">
            <Link to="/mobile-app" className="block text-xs text-muted-foreground hover:underline">Mobile App</Link>
            <Link to="/features" className="block text-xs text-muted-foreground hover:underline">Features</Link>
            <Link to="/pricing" className="block text-xs text-muted-foreground hover:underline">Pricing</Link>
            <Link to="/enterprise" className="block text-xs text-muted-foreground hover:underline">Enterprise</Link>
            <Link to="/security" className="block text-xs text-muted-foreground hover:underline">Security</Link>
            <Link to="/status" className="block text-xs text-muted-foreground hover:underline">System Status</Link>
          </div>
        </div>

        {/* Bottom Bar - Single line with copyright, social, language */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; 2024 SouLVE. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            {/* Social Icons - Small */}
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>

            {/* Language Selector */}
            <button className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Globe className="w-4 h-4" />
              <span>English (UK)</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
