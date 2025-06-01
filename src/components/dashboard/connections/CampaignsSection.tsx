
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Heart, Calendar, MapPin, Users, Target, Clock } from "lucide-react";
import { Campaign } from "@/types/campaigns";

interface CampaignsSectionProps {
  campaigns: Campaign[];
  onJoinCampaign: (campaignId: string) => void;
  onLeaveCampaign: (campaignId: string) => void;
}

const CampaignsSection = ({ campaigns, onJoinCampaign, onLeaveCampaign }: CampaignsSectionProps) => {
  const activeCampaigns = campaigns.filter(c => c.isParticipating);
  const availableCampaigns = campaigns.filter(c => !c.isParticipating);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderCampaignCard = (campaign: Campaign, isParticipating: boolean) => (
    <Card key={campaign.id} className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
            <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
          </div>
          <Badge className={`text-xs ${getUrgencyColor(campaign.urgency)}`}>
            {campaign.urgency}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <MapPin className="h-4 w-4" />
            <span>{campaign.location}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{campaign.timeframe}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{campaign.participantCount} joined</span>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progress</span>
            <span>{campaign.progress}%</span>
          </div>
          <Progress value={campaign.progress} className="h-2" />
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Target className="h-3 w-3" />
              <span>Goal: {campaign.goal}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{campaign.timeLeft}</span>
            </div>
          </div>
        </div>

        {/* Impact Preview */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-800 mb-1">Expected Impact</h4>
          <p className="text-xs text-blue-700">{campaign.impact}</p>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-xs">
            {campaign.category}
          </Badge>
          {campaign.tags.slice(0, 2).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            by {campaign.organizer}
          </div>
          {isParticipating ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onLeaveCampaign(campaign.id)}
            >
              <Heart className="h-4 w-4 mr-1 fill-current text-red-500" />
              Participating
            </Button>
          ) : (
            <Button
              variant="gradient"
              size="sm"
              onClick={() => onJoinCampaign(campaign.id)}
            >
              <Heart className="h-4 w-4 mr-1" />
              Join Campaign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            My Active Campaigns ({activeCampaigns.length})
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {activeCampaigns.map(campaign => renderCampaignCard(campaign, true))}
          </div>
        </div>
      )}

      {/* Available Campaigns */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Available Campaigns</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {availableCampaigns.map(campaign => renderCampaignCard(campaign, false))}
        </div>
      </div>
    </div>
  );
};

export default CampaignsSection;
