
import SouLVELogo from "./SouLVELogo";

const Footer = () => {
  return (
    <footer className="bg-grey-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-centre space-x-2 mb-4">
              <SouLVELogo size="small" />
            </div>
            <p className="text-grey-400 text-sm">
              Bridging the human gap AI cannot reach through trust-based community connections.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-grey-400">
              <li><a href="#" className="hover:text-white transition-colours">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colours">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colours">Impact Stories</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Community</h4>
            <ul className="space-y-2 text-grey-400">
              <li><a href="#" className="hover:text-white transition-colours">For Individuals</a></li>
              <li><a href="#" className="hover:text-white transition-colours">For Businesses</a></li>
              <li><a href="#" className="hover:text-white transition-colours">For Organisations</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-grey-400">
              <li><a href="#" className="hover:text-white transition-colours">About SouLVE</a></li>
              <li><a href="mailto:info@join-soulve.com" className="hover:text-white transition-colours">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colours">Help Centre</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-grey-800 mt-8 pt-8 text-centre text-grey-400">
          <p>&copy; 2024 SouLVE. Building better communities through meaningful connections.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
