
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SouLVELogo from "@/components/SouLVELogo";

const ProfileRegistrationHeader = () => {
  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </Link>
        <div className="flex items-center justify-center mb-6">
          <SouLVELogo size="small" />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Be the soul-ution</h1>
          <p className="text-xl text-teal-100">Join our community of changemakers and start making a difference today</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileRegistrationHeader;
