
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ArrowUp } from "lucide-react";
import { useSocialFeed } from "@/hooks/useSocialFeed";

interface FeedContainerProps {
  children: React.ReactNode;
}

const FeedContainer = ({ children }: FeedContainerProps) => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
    window.location.reload();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show scroll to top button when user scrolls down
  useState(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  });

  return (
    <div className="relative">
      {/* Refresh Button */}
      <div className="fixed top-20 right-6 z-50">
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing}
          size="sm"
          variant="outline"
          className="bg-white shadow-lg border-teal-200 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50 hover:border-teal-300"
        >
          <RefreshCw className={`h-4 w-4 mr-2 text-teal-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={scrollToTop}
            size="sm"
            className="rounded-full p-3 shadow-lg bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700"
          >
            <ArrowUp className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Feed Content */}
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
};

export default FeedContainer;
