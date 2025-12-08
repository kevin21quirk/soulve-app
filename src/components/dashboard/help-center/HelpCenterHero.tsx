import { Users, Clock, PoundSterling, Plus, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCommunityStats } from "@/hooks/useHelpCenterData";

interface HelpCenterHeroProps {
  onCreateHelpRequest: () => void;
}

const HelpCenterHero = ({ onCreateHelpRequest }: HelpCenterHeroProps) => {
  const { data: stats, isLoading } = useCommunityStats();

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
            {isLoading ? (
              <>
                <Skeleton className="h-5 w-32 bg-white/20" />
                <Skeleton className="h-5 w-36 bg-white/20" />
                <Skeleton className="h-5 w-28 bg-white/20" />
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span className="text-white font-semibold">
                    {(stats?.totalPeopleHelped || 0).toLocaleString()} people helped
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span className="text-white font-semibold">
                    {(stats?.totalHoursVolunteered || 0).toLocaleString()} hours volunteered
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <PoundSterling className="h-4 w-4" />
                  <span className="text-white font-semibold">
                    £{(stats?.totalMoneyRaised || 0).toLocaleString()} raised
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="h-4 w-4" />
                  <span className="text-white font-semibold">
                    {stats?.activeCampaigns || 0} active campaigns
                  </span>
                </div>
              </>
            )}
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
