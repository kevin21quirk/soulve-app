
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import soulveLogoCrop from "@/assets/soulve-logo-crop.png";

const ProfileRegistrationHeader = () => {
  const handleBackToHome = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-4">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={handleBackToHome}
          className="inline-flex items-center text-white hover:text-teal-200 mb-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Home
        </button>
        <div className="flex items-center justify-center mb-2">
          <img 
            src={soulveLogoCrop} 
            alt="SouLVE Logo - Social Feed to Social Need" 
            className="h-20 w-auto object-contain"
          />
        </div>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Be the soul-ution</h1>
          <p className="text-xl text-teal-100">Join our community of changemakers and start making a difference today</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileRegistrationHeader;
