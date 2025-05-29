
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CampaignList from "./CampaignList";

interface CampaignManageTabProps {
  onQuickUpdate: () => void;
}

const CampaignManageTab = ({ onQuickUpdate }: CampaignManageTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Campaigns</h2>
        <Button 
          onClick={onQuickUpdate}
          variant="outline"
          className="border-soulve-blue text-soulve-blue hover:bg-soulve-blue/10"
        >
          <Plus className="h-4 w-4 mr-2" />
          Quick Update
        </Button>
      </div>
      <CampaignList />
    </div>
  );
};

export default CampaignManageTab;
