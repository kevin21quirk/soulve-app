
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignsTab = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Center</h2>
          <p className="text-gray-600">Create and manage impactful campaigns</p>
        </div>
        <Button 
          onClick={() => navigate('/campaign-builder')}
          variant="gradient"
        >
          <Plus className="h-4 w-4 mr-2" />
          Open Campaign Builder
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-[#0ce4af]/10 to-[#0ce4af]/20 p-6 rounded-lg border border-[#0ce4af]/30">
          <Target className="h-8 w-8 text-[#0ce4af] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Fundraising Campaigns</h3>
          <p className="text-sm text-gray-700 mb-4">Raise funds for your cause with our powerful fundraising tools</p>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => navigate('/campaign-builder')}
            className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10"
          >
            Create Fundraiser
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-[#18a5fe]/10 to-[#18a5fe]/20 p-6 rounded-lg border border-[#18a5fe]/30">
          <Target className="h-8 w-8 text-[#18a5fe] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Volunteer Campaigns</h3>
          <p className="text-sm text-gray-700 mb-4">Recruit volunteers and organize community action</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/campaign-builder')}
            className="border-[#18a5fe] text-[#18a5fe] hover:bg-[#18a5fe]/10"
          >
            Find Volunteers
          </Button>
        </div>
        
        <div className="bg-gradient-to-br from-[#4c3dfb]/10 to-[#4c3dfb]/20 p-6 rounded-lg border border-[#4c3dfb]/30">
          <Target className="h-8 w-8 text-[#4c3dfb] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-2">Awareness Campaigns</h3>
          <p className="text-sm text-gray-700 mb-4">Spread awareness and educate your community</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/campaign-builder')}
            className="border-[#4c3dfb] text-[#4c3dfb] hover:bg-[#4c3dfb]/10"
          >
            Raise Awareness
          </Button>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
          <Target className="h-8 w-8 text-orange-600 mb-3" />
          <h3 className="font-semibold text-orange-900 mb-2">Social Cause Campaigns</h3>
          <p className="text-sm text-orange-700 mb-4">Drive social change and advocate for important causes</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/campaign-builder')}
            className="border-orange-300 text-orange-700 hover:bg-orange-50"
          >
            Start Movement
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsTab;
