
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, Users, MapPin, Calendar, TrendingUp, Plus } from "lucide-react";
import { Campaign } from "@/types/connections";

interface CampaignsSectionProps {
  campaigns: Campaign[];
  onJoinCampaign: (campaignId: string) => void;
  onLeaveCampaign: (campaignId: string) => void;
}

const CampaignsSection = ({ 
  campaigns, 
  onJoinCampaign, 
  onLeaveCampaign 
}: CampaignsSectionProps) => {
  const activeCampaigns = campaigns.filter(c => c.isParticipating);
  const suggestedCampaigns = campaigns.filter(c => !c.isParticipating);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Campaigns & Causes</h2>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Start Campaign
        </Button>
      </div>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Heart className="h-5 w-5 mr-2 text-red-500" />
            Your Active Campaigns ({activeCampaigns.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeCampaigns.map((campaign) => (
              <CampaignCard 
                key={campaign.id} 
                campaign={campaign} 
                onAction={onLeaveCampaign}
                actionLabel="Leave Campaign"
                variant="active"
              />
            ))}
          </div>
        </div>
      )}

      {/* Suggested Campaigns */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Discover Campaigns</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suggestedCampaigns.map((campaign) => (
            <CampaignCard 
              key={campaign.id} 
              campaign={campaign} 
              onAction={onJoinCampaign}
              actionLabel="Join Campaign"
              variant="suggested"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface CampaignCardProps {
  campaign: Campaign;
  onAction: (campaignId: string) => void;
  actionLabel: string;
  variant: "active" | "suggested";
}

const CampaignCard = ({ campaign, onAction, actionLabel, variant }: CampaignCardProps) => {
  const progressPercentage = campaign.goalAmount 
    ? (campaign.currentAmount || 0) / campaign.goalAmount * 100 
    : 0;

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-green-100 text-green-800 border-green-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "fundraising": return "💰";
      case "volunteer": return "🤝";
      case "awareness": return "📢";
      default: return "🏘️";
    }
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${variant === "active" ? "border-blue-200" : ""}`}>
      <div className="relative h-32 bg-gradient-to-r from-green-500 to-blue-500 rounded-t-lg">
        {campaign.coverImage && (
          <img 
            src={campaign.coverImage} 
            alt={campaign.title}
            className="w-full h-full object-cover rounded-t-lg"
          />
        )}
        <div className="absolute top-2 right-2">
          <Badge className={`text-xs ${getUrgencyColor(campaign.urgency)}`}>
            {campaign.urgency} priority
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-lg">{getCategoryIcon(campaign.category)}</span>
              <h4 className="font-semibold text-lg">{campaign.title}</h4>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2">{campaign.description}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Avatar className="h-6 w-6">
              <AvatarImage src={campaign.organizerAvatar} />
              <AvatarFallback className="text-xs">
                {campaign.organizer.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500">
              by {campaign.organizer}
            </span>
          </div>

          {campaign.goalAmount && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span className="font-medium">
                  ${campaign.currentAmount?.toLocaleString()} / ${campaign.goalAmount.toLocaleString()}
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{campaign.participantCount} joined</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-3 w-3" />
              <span>{campaign.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>Ends {campaign.endDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span className="capitalize">{campaign.category}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {campaign.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <Button 
            onClick={() => onAction(campaign.id)}
            className="w-full"
            variant={variant === "active" ? "outline" : "default"}
            size="sm"
          >
            {actionLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignsSection;
