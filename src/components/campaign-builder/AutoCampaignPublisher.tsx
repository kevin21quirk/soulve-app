
import { useEffect } from "react";
import { useAutoFeedIntegration } from "@/hooks/useAutoFeedIntegration";
import { CampaignUpdate } from "@/services/feedIntegrationService";

interface AutoCampaignPublisherProps {
  campaign?: CampaignUpdate;
  onPublished?: () => void;
}

const AutoCampaignPublisher = ({ campaign, onPublished }: AutoCampaignPublisherProps) => {
  const { publishCampaignToFeed } = useAutoFeedIntegration();

  useEffect(() => {
    if (campaign) {
      publishCampaignToFeed(campaign);
      onPublished?.();
    }
  }, [campaign, publishCampaignToFeed, onPublished]);

  return null; // This is a utility component that doesn't render anything
};

export default AutoCampaignPublisher;
