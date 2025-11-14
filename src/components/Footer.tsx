import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Globe } from "lucide-react";
import { useIntersectionPrefetch, useHoverPrefetch } from "@/hooks/usePrefetchRoute";

// Smart Link component with hover prefetching
const PrefetchLink = ({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) => {
  const hoverProps = useHoverPrefetch(to);
  return (
    <Link to={to} className={className} {...hoverProps}>
      {children}
    </Link>
  );
};

const Footer = () => {
  // Prefetch all footer links when footer enters viewport (200px before visible)
  const footerRef = useIntersectionPrefetch([
    '/about', '/how-it-works', '/esg', '/careers', '/press', '/team', '/blog',
    '/discover', '/groups', '/campaigns', '/events', '/stories', '/helpers',
    '/help-center', '/faq', '/guidelines', '/trust-safety', '/impact', '/api',
    '/terms-of-service', '/privacy-policy', '/cookie-policy', '/report', '/accessibility',
    '/volunteer', '/partner', '/newsletter', '/resources',
    '/mobile-app', '/features', '/pricing', '/enterprise', '/security', '/status',
    '/for-charities', '/for-volunteers', '/for-businesses', '/for-donors', 
    '/for-philanthropists', '/for-governance', '/for-public', '/for-community-groups'
  ]);

  return (
    <footer ref={footerRef} className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Main Links Grid - Clean, no headers */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-4 gap-y-2 mb-6">
          {/* Column 1 */}
          <div className="space-y-1">
            <PrefetchLink to="/about" className="block text-xs text-muted-foreground hover:underline">About SouLVE</PrefetchLink>
            <PrefetchLink to="/how-it-works" className="block text-xs text-muted-foreground hover:underline">How It Works</PrefetchLink>
            <PrefetchLink to="/esg" className="block text-xs text-muted-foreground hover:underline">ESG & Impact</PrefetchLink>
            <PrefetchLink to="/careers" className="block text-xs text-muted-foreground hover:underline">Careers</PrefetchLink>
            <PrefetchLink to="/press" className="block text-xs text-muted-foreground hover:underline">Press & Media</PrefetchLink>
            <PrefetchLink to="/team" className="block text-xs text-muted-foreground hover:underline">Team</PrefetchLink>
            <PrefetchLink to="/blog" className="block text-xs text-muted-foreground hover:underline">Blog</PrefetchLink>
          </div>

          {/* Column 2 */}
          <div className="space-y-1">
            <PrefetchLink to="/discover" className="block text-xs text-muted-foreground hover:underline">Discover People</PrefetchLink>
            <PrefetchLink to="/groups" className="block text-xs text-muted-foreground hover:underline">Find Groups</PrefetchLink>
            <PrefetchLink to="/campaigns" className="block text-xs text-muted-foreground hover:underline">Join Campaigns</PrefetchLink>
            <PrefetchLink to="/events" className="block text-xs text-muted-foreground hover:underline">Create Events</PrefetchLink>
            <PrefetchLink to="/stories" className="block text-xs text-muted-foreground hover:underline">Impact Stories</PrefetchLink>
            <PrefetchLink to="/helpers" className="block text-xs text-muted-foreground hover:underline">Safe Space Helpers</PrefetchLink>
          </div>

          {/* Column 3 */}
          <div className="space-y-1">
            <PrefetchLink to="/help-center" className="block text-xs text-muted-foreground hover:underline">Help Centre</PrefetchLink>
            <PrefetchLink to="/faq" className="block text-xs text-muted-foreground hover:underline">FAQs</PrefetchLink>
            <PrefetchLink to="/guidelines" className="block text-xs text-muted-foreground hover:underline">Community Guidelines</PrefetchLink>
            <PrefetchLink to="/trust-safety" className="block text-xs text-muted-foreground hover:underline">Trust & Safety</PrefetchLink>
            <PrefetchLink to="/impact" className="block text-xs text-muted-foreground hover:underline">Impact Reports</PrefetchLink>
            <PrefetchLink to="/api" className="block text-xs text-muted-foreground hover:underline">Developer API</PrefetchLink>
          </div>

          {/* Column 4 */}
          <div className="space-y-1">
            <PrefetchLink to="/terms-of-service" className="block text-xs text-muted-foreground hover:underline">Terms of Service</PrefetchLink>
            <PrefetchLink to="/privacy-policy" className="block text-xs text-muted-foreground hover:underline">Privacy Policy</PrefetchLink>
            <PrefetchLink to="/cookie-policy" className="block text-xs text-muted-foreground hover:underline">Cookie Policy</PrefetchLink>
            <a href="mailto:info@join-soulve.com" className="block text-xs text-muted-foreground hover:underline">Contact Us</a>
            <PrefetchLink to="/report" className="block text-xs text-muted-foreground hover:underline">Report Issue</PrefetchLink>
            <PrefetchLink to="/accessibility" className="block text-xs text-muted-foreground hover:underline">Accessibility</PrefetchLink>
          </div>

          {/* Column 5 */}
          <div className="space-y-1">
            <PrefetchLink to="/volunteer" className="block text-xs text-muted-foreground hover:underline">Volunteer</PrefetchLink>
            <PrefetchLink to="/campaigns" className="block text-xs text-muted-foreground hover:underline">Donate</PrefetchLink>
            <PrefetchLink to="/partner" className="block text-xs text-muted-foreground hover:underline">Partner With Us</PrefetchLink>
            <PrefetchLink to="/newsletter" className="block text-xs text-muted-foreground hover:underline">Newsletter</PrefetchLink>
            <PrefetchLink to="/resources" className="block text-xs text-muted-foreground hover:underline">Resources</PrefetchLink>
            <Link to="/testimonials" className="block text-xs text-muted-foreground hover:underline">Testimonials</Link>
          </div>

          {/* Column 6 */}
          <div className="space-y-1">
            <PrefetchLink to="/mobile-app" className="block text-xs text-muted-foreground hover:underline">Mobile App</PrefetchLink>
            <PrefetchLink to="/features" className="block text-xs text-muted-foreground hover:underline">Features</PrefetchLink>
            <PrefetchLink to="/pricing" className="block text-xs text-muted-foreground hover:underline">Pricing</PrefetchLink>
            <PrefetchLink to="/enterprise" className="block text-xs text-muted-foreground hover:underline">Enterprise</PrefetchLink>
            <PrefetchLink to="/security" className="block text-xs text-muted-foreground hover:underline">Security</PrefetchLink>
            <PrefetchLink to="/status" className="block text-xs text-muted-foreground hover:underline">System Status</PrefetchLink>
          </div>

          {/* Column 7 - For Users */}
          <div className="space-y-1">
            <PrefetchLink to="/for-charities" className="block text-xs text-muted-foreground hover:underline">For Charities</PrefetchLink>
            <PrefetchLink to="/for-volunteers" className="block text-xs text-muted-foreground hover:underline">For Volunteers</PrefetchLink>
            <PrefetchLink to="/for-businesses" className="block text-xs text-muted-foreground hover:underline">For Businesses</PrefetchLink>
            <PrefetchLink to="/for-donors" className="block text-xs text-muted-foreground hover:underline">For Donors</PrefetchLink>
            <PrefetchLink to="/for-philanthropists" className="block text-xs text-muted-foreground hover:underline">For Philanthropists</PrefetchLink>
            <PrefetchLink to="/for-governance" className="block text-xs text-muted-foreground hover:underline">For Governance</PrefetchLink>
            <PrefetchLink to="/for-public" className="block text-xs text-muted-foreground hover:underline">For Public</PrefetchLink>
            <PrefetchLink to="/for-community-groups" className="block text-xs text-muted-foreground hover:underline">For Community Groups</PrefetchLink>
          </div>
        </div>

        {/* Bottom Bar - Single line with copyright, social, language */}
        <div className="border-t border-border pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; 2025 SouLVE. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <span className="text-xs">Follow us</span>
              <a 
                href="https://www.facebook.com/profile.php?id=61571924339797" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Visit our Facebook page"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/company/soulve-ltd/?viewAsMember=true" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Visit our LinkedIn page"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://www.instagram.com/soulve_community_app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-foreground transition-colors"
                aria-label="Visit our Instagram page"
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
