
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { getUserCampaigns } from "@/services/campaignService";
import { CalendarDays, MapPin, Users, DollarSign, Eye, Share2, MoreHorizontal, Edit, Pause, Play, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Campaign {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  goal_type: string;
  goal_amount: number;
  current_amount: number;
  currency: string;
  end_date: string;
  location: string;
  urgency: string;
  total_views: number;
  total_shares: number;
  created_at: string;
}

const CampaignList = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const data = await getUserCampaigns();
      setCampaigns(data || []);
    } catch (error) {
      console.error('Error loading campaigns:', error);
      toast({
        title: "Error",
        description: "Failed to load campaigns. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (current: number, goal: number) => {
    return goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
  };

  const formatCurrency = (amount: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeFilter === 'all') return true;
    return campaign.status === activeFilter;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({campaigns.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({campaigns.filter(c => c.status === 'active').length})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({campaigns.filter(c => c.status === 'draft').length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({campaigns.filter(c => c.status === 'completed').length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredCampaigns.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="h-16 w-16" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No campaigns found</h3>
            <p className="text-gray-600 text-center mb-4">
              {activeFilter === 'all' 
                ? "You haven't created any campaigns yet. Start by creating your first campaign!"
                : `No ${activeFilter} campaigns found.`
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredCampaigns.map((campaign) => (
            <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <Badge className={getUrgencyColor(campaign.urgency)}>
                        {campaign.urgency} priority
                      </Badge>
                      <Badge variant="outline">
                        {campaign.category}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{campaign.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {campaign.description}
                    </CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {campaign.status === 'active' ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Section */}
                  {campaign.goal_type === 'monetary' && campaign.goal_amount > 0 && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">
                          {formatCurrency(campaign.current_amount, campaign.currency)} raised
                        </span>
                        <span className="text-gray-600">
                          of {formatCurrency(campaign.goal_amount, campaign.currency)} goal
                        </span>
                      </div>
                      <Progress 
                        value={calculateProgress(campaign.current_amount, campaign.goal_amount)} 
                        className="h-2"
                      />
                      <div className="text-sm text-gray-600">
                        {calculateProgress(campaign.current_amount, campaign.goal_amount).toFixed(1)}% complete
                      </div>
                    </div>
                  )}

                  {/* Campaign Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    {campaign.location && (
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        {campaign.location}
                      </div>
                    )}
                    {campaign.end_date && (
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        Ends {formatDate(campaign.end_date)}
                      </div>
                    )}
                    <div className="flex items-center text-gray-600">
                      <Eye className="h-4 w-4 mr-1" />
                      {campaign.total_views} views
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Share2 className="h-4 w-4 mr-1" />
                      {campaign.total_shares} shares
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm">
                      Analytics
                    </Button>
                    {campaign.status === 'draft' && (
                      <Button size="sm" className="bg-teal-600 hover:bg-teal-700">
                        Launch Campaign
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignList;
