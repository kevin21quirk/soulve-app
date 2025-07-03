
import { Users, Clock, DollarSign, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ImpactStats {
  totalHelped: number;
  hoursVolunteered: number;
  moneyRaised: number;
  activeCampaigns: number;
}

interface HelpCenterHeroProps {
  onCreateHelpRequest: () => void;
}

const impactStats: ImpactStats = {
  totalHelped: 15420,
  hoursVolunteered: 8750,
  moneyRaised: 245000,
  activeCampaigns: 127
};

const HelpCenterHero = ({ onCreateHelpRequest }: HelpCenterHeroProps) => {
  return (
    <div className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] rounded-xl p-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-white">
            Make a Difference Today
          </h1>
          <p className="text-white/90 mb-4">
            Discover meaningful ways to support your community and causes you care about
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="text-white font-semibold">
                {impactStats.totalHelped.toLocaleString()} people helped
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="text-white font-semibold">
                {impactStats.hoursVolunteered.toLocaleString()} hours volunteered
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="text-white font-semibold">
                ${impactStats.moneyRaised.toLocaleString()} raised
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <Button 
            onClick={onCreateHelpRequest}
            variant="secondary" 
            size="lg" 
            className="mb-2 bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Help Request
          </Button>
          <p className="text-xs text-white/80">Start your own cause</p>
        </div>
      </div>
    </div>
  );
};

export default HelpCenterHero;
