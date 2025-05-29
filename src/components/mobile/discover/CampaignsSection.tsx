
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { useConnections } from "@/hooks/useConnections";

interface CampaignsSectionProps {
  activeFilter: string;
  onJoinCampaign: (campaignId: string) => void;
}

const CampaignsSection = ({ activeFilter, onJoinCampaign }: CampaignsSectionProps) => {
  const { campaigns } = useConnections();

  if (!(activeFilter === "all" || activeFilter === "campaigns")) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-lg">
          <Target className="h-5 w-5 text-red-500" />
          <span>Active Causes</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {campaigns.slice(0, 2).map((campaign) => (
          <div key={campaign.id} className="p-3 border rounded-lg">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{campaign.title}</h4>
                <p className="text-xs text-gray-600 mt-1">{campaign.description}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {campaign.participantCount} joined
                  </Badge>
                  <Badge 
                    variant={campaign.urgency === 'high' ? 'destructive' : 'secondary'} 
                    className="text-xs"
                  >
                    {campaign.urgency} priority
                  </Badge>
                </div>
              </div>
              <Button 
                size="sm" 
                variant={campaign.isParticipating ? "outline" : "gradient"}
                onClick={() => onJoinCampaign(campaign.id)}
              >
                {campaign.isParticipating ? "Joined" : "Join"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default CampaignsSection;
