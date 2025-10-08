import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>404 - Page Not Found | SouLVE</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to SouLVE to continue connecting and making impact." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[hsl(var(--soulve-teal))] mb-4">404</h1>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
            <p className="text-lg text-gray-600 mb-8">
              Oops! The page you're looking for seems to have wandered off. 
              Let's get you back on track to making an impact.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate("/")} 
              className="bg-[hsl(var(--soulve-teal))] hover:bg-[hsl(var(--soulve-teal))]/90"
            >
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Button>
            <Button 
              onClick={() => navigate("/dashboard")} 
              variant="outline"
            >
              <Search className="mr-2 h-4 w-4" />
              Go to Dashboard
            </Button>
          </div>

          <div className="mt-12 p-6 bg-white/50 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-gray-600">
              Need help? <a href="mailto:info@join-soulve.com" className="text-[hsl(var(--soulve-teal))] hover:underline">Contact our support team</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;