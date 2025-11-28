import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Users, 
  MapPin, 
  TrendingUp,
  Award,
  Star,
  Loader2,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  fetchSponsorableCampaigns, 
  createCampaignSponsorship, 
  trackCSRLead 
} from "@/services/csrService";

const CampaignPartnershipHub = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sponsoring, setSponsoring] = useState(false);
  const { toast } = useToast();
  const { organizationId } = useAuth();

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      const data = await fetchSponsorableCampaigns();
      setCampaigns(data);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSponsor = async (campaignId: string, tier: string, amount: number) => {
    if (!organizationId) {
      toast({
        title: "Organization Required",
        description: "You need to be part of an organization to sponsor campaigns",
        variant: "destructive",
      });
      return;
    }

    try {
      setSponsoring(true);
      await createCampaignSponsorship(
        organizationId,
        campaignId,
        tier as any,
        amount
      );
      toast({
        title: "Sponsorship Request Sent",
        description: "The campaign organiser will review your sponsorship offer.",
      });
      setSelectedCampaign(null);
    } catch (error) {
      console.error('Error creating sponsorship:', error);
      toast({
        title: "Error",
        description: "Failed to submit sponsorship request",
        variant: "destructive",
      });
    } finally {
      setSponsoring(false);
    }
  };

  const trackCampaignView = (campaignId: string) => {
    if (organizationId) {
      trackCSRLead(organizationId, 'view', undefined, campaignId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Campaign Partnerships</h3>
        <p className="text-muted-foreground">
          Sponsor community-led campaigns and build strategic partnerships that create measurable social impact
        </p>
      </div>

      {/* Campaigns */}
      <div className="space-y-6">
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </CardContent>
          </Card>
        ) : campaigns.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No active campaigns available for sponsorship</p>
            </CardContent>
          </Card>
        ) : (
          campaigns.map((campaign) => (
            <Card 
              key={campaign.id} 
              className="hover:shadow-lg transition-shadow"
              onClick={() => trackCampaignView(campaign.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-lg font-semibold text-foreground">{campaign.title}</h4>
                      <Badge variant="outline">{campaign.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {campaign.description}
                    </p>
                  </div>
                </div>

                {/* Campaign Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Goal</p>
                      <p className="font-semibold text-foreground">£{campaign.goal_amount?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Raised</p>
                      <p className="font-semibold text-green-600">£{campaign.current_amount?.toLocaleString() || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Supporters</p>
                      <p className="font-semibold text-foreground">{campaign.supporters_count || 0}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-semibold text-foreground text-sm">{campaign.location || 'Not specified'}</p>
                    </div>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">{Math.round(campaign.progress)}% funded</span>
                  </div>
                  <Progress value={campaign.progress} className="h-2" />
                </div>

                {/* Sponsorship Tiers */}
                {selectedCampaign === campaign.id ? (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <h5 className="font-semibold text-foreground mb-3">Sponsorship Opportunities</h5>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {[
                        { name: 'Bronze', amount: 5000, icon: <Award className="h-5 w-5 text-amber-600" /> },
                        { name: 'Silver', amount: 15000, icon: <Award className="h-5 w-5 text-gray-400" /> },
                        { name: 'Gold', amount: 25000, icon: <Award className="h-5 w-5 text-yellow-500" /> },
                        { name: 'Platinum', amount: 50000, icon: <Star className="h-5 w-5 text-purple-500" /> },
                      ].map((tier) => (
                        <Card key={tier.name} className="border-2 hover:border-primary transition-colors">
                          <CardContent className="p-4">
                            <div className="flex items-center gap-2 mb-2">
                              {tier.icon}
                              <h6 className="font-semibold text-foreground">{tier.name}</h6>
                            </div>
                            <p className="text-2xl font-bold text-foreground mb-3">
                              £{tier.amount.toLocaleString()}
                            </p>
                            <Button 
                              className="w-full" 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleSponsor(campaign.id, tier.name.toLowerCase(), tier.amount)}
                              disabled={sponsoring}
                            >
                              {sponsoring ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                `Select ${tier.name}`
                              )}
                            </Button>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => setSelectedCampaign(null)}
                      className="w-full"
                    >
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Close Sponsorship Options
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div>
                      <p className="text-sm font-medium text-foreground">Support this campaign</p>
                    </div>
                    <Button 
                      onClick={() => setSelectedCampaign(campaign.id)}
                      className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                    >
                      <ChevronDown className="h-4 w-4 mr-2" />
                      View Sponsorship Options
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CampaignPartnershipHub;
