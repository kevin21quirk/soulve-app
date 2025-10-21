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

      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 p-8 w-fit mx-auto mb-8">
              <Construction className="h-16 w-16 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {title}
            </h1>
            
            <p className="text-lg text-muted-foreground mb-2">
              {description}
            </p>
            
            {estimatedLaunch && (
              <p className="text-sm text-muted-foreground mb-8">
                Expected launch: {estimatedLaunch}
              </p>
            )}
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild variant="default">
                <Link to="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Link>
              </Button>
              
              <Button asChild variant="outline">
                <a href="mailto:info@join-soulve.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Us
                </a>
              </Button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ComingSoonPage;
