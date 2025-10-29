import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Construction, ArrowLeft, Mail } from "lucide-react";
import Footer from "./Footer";

interface ComingSoonPageProps {
  title: string;
  description: string;
  estimatedLaunch?: string;
}

const ComingSoonPage = ({ title, description, estimatedLaunch }: ComingSoonPageProps) => {
  return (
    <>
      <Helmet>
        <title>{title} - Coming Soon | SouLVE</title>
        <meta name="description" content={description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section with Gradient */}
        <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/" className="inline-flex items-center text-white hover:text-teal-200 mb-6 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 mb-8">
                <Construction className="h-10 w-10 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
              <p className="text-xl text-teal-100">{description}</p>
              {estimatedLaunch && (
                <p className="text-lg text-teal-200 mt-4">
                  Expected launch: {estimatedLaunch}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-2xl mx-auto">
            <p className="text-lg text-muted-foreground mb-8">
              We're working hard to bring this feature to you. In the meantime, feel free to explore other areas of SouLVE.
            </p>
            <Button asChild variant="outline" size="lg">
              <Link to="/contact">
                <Mail className="mr-2 h-4 w-4" />
                Contact Us for Updates
              </Link>
            </Button>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ComingSoonPage;
