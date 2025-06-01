
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CampaignData } from "@/types/campaigns";
import { mockCampaigns } from "@/data/mockCampaigns";

export const useCampaignsManager = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampaignData[]>(mockCampaigns);

  const handleJoinCampaign = (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, isParticipating: true, participantCount: campaign.participantCount + 1 }
          : campaign
      )
    );
    toast({
      title: "Joined campaign!",
      description: "You're now participating in this community campaign.",
    });
  };

  const handleLeaveCampaign = (campaignId: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === campaignId 
          ? { ...campaign, isParticipating: false, participantCount: Math.max(0, campaign.participantCount - 1) }
          : campaign
      )
    );
    toast({
      title: "Left campaign",
      description: "You're no longer participating in this campaign.",
    });
  };

  return {
    campaigns,
    handleJoinCampaign,
    handleLeaveCampaign,
  };
};
