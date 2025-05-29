
import { useCallback } from "react";
import { useSocialFeed } from "./useSocialFeed";
import { autoPublishToFeed, HelpCenterPost, CampaignUpdate } from "@/services/feedIntegrationService";
import { useToast } from "./use-toast";

export const useAutoFeedIntegration = () => {
  const { handlePostCreated } = useSocialFeed();
  const { toast } = useToast();

  const publishHelpCenterToFeed = useCallback((helpPost: HelpCenterPost) => {
    const feedPost = autoPublishToFeed(helpPost, 'help-center', handlePostCreated);
    
    toast({
      title: "Published to Feed",
      description: `"${helpPost.title}" has been automatically shared in the community feed.`,
    });
    
    return feedPost;
  }, [handlePostCreated, toast]);

  const publishCampaignToFeed = useCallback((campaign: CampaignUpdate) => {
    const feedPost = autoPublishToFeed(campaign, 'campaign', handlePostCreated);
    
    toast({
      title: "Campaign Shared",
      description: `"${campaign.title}" has been automatically shared in the community feed.`,
    });
    
    return feedPost;
  }, [handlePostCreated, toast]);

  return {
    publishHelpCenterToFeed,
    publishCampaignToFeed,
  };
};
