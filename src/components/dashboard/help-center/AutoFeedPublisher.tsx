
import { useEffect } from "react";
import { useAutoFeedIntegration } from "@/hooks/useAutoFeedIntegration";
import { HelpCenterPost } from "@/services/feedIntegrationService";

interface AutoFeedPublisherProps {
  helpPost?: HelpCenterPost;
  onPublished?: () => void;
}

const AutoFeedPublisher = ({ helpPost, onPublished }: AutoFeedPublisherProps) => {
  const { publishHelpCenterToFeed } = useAutoFeedIntegration();

  useEffect(() => {
    if (helpPost) {
      publishHelpCenterToFeed(helpPost);
      onPublished?.();
    }
  }, [helpPost, publishHelpCenterToFeed, onPublished]);

  return null; // This is a utility component that doesn't render anything
};

export default AutoFeedPublisher;
