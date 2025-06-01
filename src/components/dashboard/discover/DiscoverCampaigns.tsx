
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, MapPin, Calendar, Users, Target, Zap } from "lucide-react";
import { useCampaigns, useJoinCampaign, useUserCampaignParticipation } from "@/services/campaignsService";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoverCampaignsProps {
  searchQuery: string;
}

const DiscoverCampaigns = ({ searchQuery }: DiscoverCampaignsProps) => {
  const { data: campaigns = [], isLoading } = useCampaigns();
  const { data: userParticipation = [] } = useUserCampaignParticipation();
  const joinCampaign = useJoinCampaign();

  const filteredCampaigns = campaigns.filter(campaign => {
    if (!searchQuery) return true;
    return campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           campaign.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           campaign.category.toLowerCase().includes(searchQuery.toLowerCase());
  }).map(campaign => ({
    ...campaign,
    isParticipating: userParticipation.includes(campaign.id)
  }));

  const handleJoinCampaign = (campaignId: string) => {
    joinCampaign.mutate(campaignId);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "emergency-relief": "bg-red-100 text-red-800",
      "education": "bg-blue-100 text-blue-800",
      "environment": "bg-green-100 text-green-800",
      "healthcare": "bg-purple-100 text-purple-800",
      "community-development": "bg-yellow-100 text-yellow-800",
      "disaster-relief": "bg-orange-100 text-orange-800",
      "social-justice": "bg-indigo-100 text-indigo-800",
      "animal-welfare": "bg-pink-100 text-pink-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const getUrgencyIcon = (urgency: string) => {
    if (urgency === "urgent" || urgency === "high") {
      return <Zap className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-red-500" />
            <span>Discover Campaigns</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border rounded-lg p-4">
              <div className="h-32 bg-gray-200 rounded mb-3"></div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <div className="flex space-x-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-red-500" />
          <span>Discover Campaigns ({filteredCampaigns.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No campaigns found matching your search.</p>
          </div>
        ) : (
          filteredCampaigns.map((campaign) => (
            <div key={campaign.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-r from-pink-500 to-red-600 relative">
                {campaign.featured_image ? (
                  <img 
                    src={campaign.featured_image} 
                    alt={campaign.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Heart className="h-8 w-8 text-white/50" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex space-x-1">
                  {getUrgencyIcon(campaign.urgency)}
                  <Badge variant="secondary" className="bg-white/90">
                    {campaign.urgency}
                  </Badge>
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{campaign.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{campaign.participant_count} participants</span>
                      </div>
                      {campaign.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3" />
                          <span>{campaign.location}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{campaign.timeLeft}</span>
                      </div>
                    </div>
                    
                    {campaign.goal_amount && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium">
                            {campaign.progress}% of ${campaign.goal_amount.toLocaleString()}
                          </span>
                        </div>
                        <Progress 
                          value={campaign.progress} 
                          className="h-2"
                        />
                        <p className="text-xs text-gray-500 mt-1">{campaign.impact}</p>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge className={getCategoryColor(campaign.category)}>
                        {campaign.category.replace('-', ' ')}
                      </Badge>
                      {campaign.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">
                        {campaign.organizer?.charAt(0) || 'O'}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">By {campaign.organizer || 'Anonymous'}</span>
                  </div>
                  
                  <Button
                    variant={campaign.isParticipating ? "outline" : "gradient"}
                    size="sm"
                    onClick={() => handleJoinCampaign(campaign.id)}
                    disabled={joinCampaign.isPending}
                    className="whitespace-nowrap"
                  >
                    <Target className="h-4 w-4 mr-1" />
                    {campaign.isParticipating ? 'Participating' : 'Join Campaign'}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default DiscoverCampaigns;
