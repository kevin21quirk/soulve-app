
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, DollarSign, Users, TrendingUp, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignStatsWidget = () => {
  const navigate = useNavigate();

  // Mock data - in real app this would come from API
  const stats = {
    activeCampaigns: 3,
    totalRaised: 26000,
    totalSupporters: 372,
    successRate: 73
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Your Campaigns</CardTitle>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/campaign-builder')}
          >
            <Plus className="h-4 w-4 mr-1" />
            Create
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gradient-to-br from-[#0ce4af]/10 to-[#0ce4af]/20 rounded-lg">
            <Target className="h-5 w-5 text-[#0ce4af] mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.activeCampaigns}</div>
            <div className="text-xs text-gray-600">Active</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
            <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="text-lg font-bold">£{stats.totalRaised.toLocaleString()}</div>
            <div className="text-xs text-gray-600">Raised</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.totalSupporters}</div>
            <div className="text-xs text-gray-600">Supporters</div>
          </div>
          
          <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
            <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" />
            <div className="text-lg font-bold">{stats.successRate}%</div>
            <div className="text-xs text-gray-600">Success</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignStatsWidget;
