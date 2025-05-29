
import React from "react";
import { useErrorHandler } from "@/contexts/ErrorContext";
import EnhancedFeedContainer from "./social-feed/EnhancedFeedContainer";

const SocialFeed = React.memo(() => {
  const { reportError } = useErrorHandler();

  try {
    return <EnhancedFeedContainer />;
  } catch (error) {
    reportError(error as Error, 'SocialFeed');
    
    // Fallback UI
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Social Feed</h2>
          <p className="text-gray-600">
            We're experiencing some technical difficulties. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }
});

SocialFeed.displayName = "SocialFeed";

export default SocialFeed;
