import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Search, Edit3, Share2, BarChart3, Pause, Play, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEnhancedCampaigns } from "@/hooks/useEnhancedCampaigns";
import { useToast } from "@/hooks/use-toast";
import CampaignEditDialog from "./CampaignEditDialog";
import { Campaign } from "@/hooks/campaigns/types";

const CampaignList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, deleteCampaign, updateCampaign, getUserCampaigns } = useEnhancedCampaigns();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [deletingCampaignId, setDeletingCampaignId] = useState<string | null>(null);

  useEffect(() => {
    const loadUserCampaigns = async () => {
      setIsLoadingCampaigns(true);
      const userCampaigns = await getUserCampaigns();
      setCampaigns(userCampaigns);
      setIsLoadingCampaigns(false);
    };
    
    loadUserCampaigns();
  }, [getUserCampaigns]);

  const handleToggleStatus = async (campaign: Campaign) => {
    const newStatus = campaign.status === "active" ? "paused" : "active";
    await updateCampaign(campaign.id, { status: newStatus });
    const userCampaigns = await getUserCampaigns();
    setCampaigns(userCampaigns);
  };

  const handleDelete = async () => {
    if (!deletingCampaignId) return;
    try {
      await deleteCampaign(deletingCampaignId);
      const userCampaigns = await getUserCampaigns();
      setCampaigns(userCampaigns);
      setDeletingCampaignId(null);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const handleShare = (campaign: Campaign) => {
    const url = `${window.location.origin}/campaigns/${campaign.id}`;
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Campaign link copied to clipboard",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (category: string) => {
    switch (category) {
      case "fundraising": return "💰";
      case "community": return "🏘️";
      case "environmental": return "🌱";
      case "education": return "📚";
      case "healthcare": return "⚕️";
      default: return "📋";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (campaign.description && campaign.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading || isLoadingCampaigns) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          {["all", "active", "paused", "completed", "draft"].map(status => (
            <Button
              key={status}
              variant={statusFilter === status ? "default" : "outline"}
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`capitalize transition-all duration-200 ${
                statusFilter === status
                  ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white border-transparent hover:from-[#0ce4af]/90 hover:to-[#18a5fe]/90"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent"
              }`}
            >
              {status}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {filteredCampaigns.map(campaign => {
          const progress = campaign.goal_amount 
            ? Math.round((campaign.current_amount / campaign.goal_amount) * 100)
            : 0;
          
          const daysLeft = campaign.end_date 
            ? Math.max(0, Math.ceil((new Date(campaign.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
            : 0;

          return (
            <Card key={campaign.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xl">{getTypeIcon(campaign.category)}</span>
                      <h3 className="font-semibold text-lg">{campaign.title}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description || "No description"}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Progress</p>
                        <div className="flex items-center space-x-2">
                          <Progress 
                            value={progress} 
                            className="flex-1" 
                          />
                          <span className="text-sm font-medium">{progress}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Raised</p>
                        <p className="font-semibold">£{campaign.current_amount.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">of £{campaign.goal_amount?.toLocaleString() || 0}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Views</p>
                        <p className="font-semibold">0</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Days Left</p>
                        <p className="font-semibold">{daysLeft}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setEditingCampaign(campaign)}
                        className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
                      >
                        <Edit3 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleShare(campaign)}
                        className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
                      >
                        <Share2 className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => navigate(`/campaigns/${campaign.id}/analytics`)}
                        className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
                      >
                        <BarChart3 className="h-3 w-3 mr-1" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleToggleStatus(campaign)}>
                        {campaign.status === "active" ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Pause Campaign
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Resume Campaign
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-red-600"
                        onClick={() => setDeletingCampaignId(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Campaign
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search criteria or filters."
              : "No campaigns yet. Create your first campaign to get started!"}
          </p>
        </Card>
      )}

      {editingCampaign && (
        <CampaignEditDialog
          campaign={editingCampaign}
          open={!!editingCampaign}
          onOpenChange={(open) => !open && setEditingCampaign(null)}
        />
      )}

      <AlertDialog open={!!deletingCampaignId} onOpenChange={() => setDeletingCampaignId(null)}>
        <AlertDialogContent allowDismiss>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CampaignList;
