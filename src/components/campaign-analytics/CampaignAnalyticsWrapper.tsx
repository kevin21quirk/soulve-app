
import React from "react";
import { useParams } from "react-router-dom";
import EnhancedCampaignAnalytics from "./EnhancedCampaignAnalytics";
import { DonationService } from "@/services/donationService";

const CampaignAnalyticsWrapper = () => {
  const { campaignId } = useParams<{ campaignId: string }>();
  
  // You could also get campaign details from your existing campaign service
  const mockCampaignData = {
    title: "Community Garden Project",
    goalAmount: 25000,
    currentAmount: 12450,
    daysRemaining: 23,
    status: "active"
  };

  if (!campaignId) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Campaign ID not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <EnhancedCampaignAnalytics
        campaignId={campaignId}
        campaignTitle={mockCampaignData.title}
        goalAmount={mockCampaignData.goalAmount}
        currentAmount={mockCampaignData.currentAmount}
        daysRemaining={mockCampaignData.daysRemaining}
      />
    </div>
  );
};

export default CampaignAnalyticsWrapper;
