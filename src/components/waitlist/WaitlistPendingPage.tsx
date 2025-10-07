
import { Clock, Mail, CheckCircle, Users, Heart } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SouLVELogo from "@/components/SouLVELogo";

const WaitlistPendingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="flex justify-center">
          <SouLVELogo size="large" clickable={false} />
        </div>

        {/* Hero Message */}
        <div className="text-center space-y-4">
          <div className="inline-block bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] text-white px-6 py-2 rounded-full text-sm font-semibold mb-4">
            🎉 Welcome to the Beta Testing Community!
          </div>
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] bg-clip-text text-transparent">
            You're In The Queue!
          </h2>
          <p className="text-lg text-gray-600 max-w-xl mx-auto">
            Thank you for your interest in shaping the future of SouLVE. Your application is being reviewed by our team.
          </p>
        </div>

        {/* Status Card */}
        <Card className="border-2 border-[#0ce4af]/20 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-[#0ce4af]/10 via-[#18a5fe]/10 to-[#4c3dfb]/10 rounded-full">
                <Clock className="h-6 w-6 text-[#18a5fe]" />
              </div>
              <div>
                <CardTitle className="text-xl">Status: Under Review</CardTitle>
                <CardDescription className="text-base">
                  Your application is being carefully reviewed by our team
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center space-x-2 p-4 bg-gradient-to-r from-[#0ce4af]/5 via-[#18a5fe]/5 to-[#4c3dfb]/5 rounded-lg">
              <Users className="h-5 w-5 text-[#0ce4af]" />
              <p className="text-sm text-gray-600 font-medium">Estimated review time: 1-3 business days</p>
            </div>
          </CardContent>
        </Card>

        {/* What Happens Next */}
        <Card className="border-2 border-[#18a5fe]/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <CheckCircle className="h-6 w-6 text-[#0ce4af]" />
              <span>What Happens Next?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#0ce4af] to-[#18a5fe] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Review Process</h4>
                <p className="text-sm text-gray-600">
                  Our team carefully reviews all applications to ensure a high-quality beta testing community with diverse perspectives
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#18a5fe] to-[#4c3dfb] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Email Notification</h4>
                <p className="text-sm text-gray-600">
                  You'll receive an email notification once your account has been approved with instructions to access the platform
                </p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#4c3dfb] to-[#0ce4af] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                3
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 text-lg mb-1">Start Testing!</h4>
                <p className="text-sm text-gray-600">
                  Once approved, you'll gain full access to SouLVE and can start exploring features, providing feedback, and shaping the platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="bg-gradient-to-br from-[#0ce4af]/5 via-[#18a5fe]/5 to-[#4c3dfb]/5 border-2 border-[#4c3dfb]/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-xl">
              <div className="p-2 bg-gradient-to-r from-[#0ce4af] via-[#18a5fe] to-[#4c3dfb] rounded-lg">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <span>Have Questions?</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-gray-600">
              We're here to help! If you have any questions about your application or the waitlist process:
            </p>
            <div className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow-sm">
              <Heart className="h-5 w-5 text-[#0ce4af]" />
              <a 
                href="mailto:support@soulve.com" 
                className="text-[#18a5fe] hover:text-[#4c3dfb] font-semibold transition-colors"
              >
                support@soulve.com
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 pt-4">
          <p>Thank you for being an early supporter of SouLVE! 🌟</p>
        </div>
      </div>
    </div>
  );
};

export default WaitlistPendingPage;
