
import React from "react";
import { useErrorHandler } from "@/contexts/ErrorContext";

const SocialFeed = React.memo(() => {
  const { reportError } = useErrorHandler();

  // Simple fallback content for now
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Social Feed</h2>
        <p className="text-gray-600">Your social feed will appear here.</p>
      </div>
    </div>
  );
});

SocialFeed.displayName = "SocialFeed";

export default SocialFeed;
