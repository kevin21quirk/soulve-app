
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
          className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
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
