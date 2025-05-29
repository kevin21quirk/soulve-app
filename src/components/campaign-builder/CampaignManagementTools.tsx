
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Copy, 
  Archive, 
  Play, 
  Pause, 
  Trash2, 
  Filter, 
  Search,
  MoreHorizontal,
  Download,
  Share2
} from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type Campaign = Database['public']['Tables']['campaigns']['Row'];

interface CampaignManagementToolsProps {
  campaigns: Campaign[];
  onCampaignsUpdate: () => void;
}

const CampaignManagementTools = ({ campaigns, onCampaignsUpdate }: CampaignManagementToolsProps) => {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [showBulkActions, setShowBulkActions] = useState(false);
  const { toast } = useToast();

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         campaign.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || campaign.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const sortedCampaigns = [...filteredCampaigns].sort((a, b) => {
    switch (sortBy) {
      case "title":
        return a.title.localeCompare(b.title);
      case "status":
        return a.status.localeCompare(b.status);
      case "goal_amount":
        return (b.goal_amount || 0) - (a.goal_amount || 0);
      case "current_amount":
        return (b.current_amount || 0) - (a.current_amount || 0);
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCampaigns(sortedCampaigns.map(c => c.id));
    } else {
      setSelectedCampaigns([]);
    }
  };

  const handleSelectCampaign = (campaignId: string, checked: boolean) => {
    if (checked) {
      setSelectedCampaigns([...selectedCampaigns, campaignId]);
    } else {
      setSelectedCampaigns(selectedCampaigns.filter(id => id !== campaignId));
    }
  };

  const handleBulkAction = async (action: string) => {
    try {
      console.log(`Performing bulk action: ${action} on campaigns:`, selectedCampaigns);
      
      switch (action) {
        case "activate":
          toast({
            title: "Campaigns Activated",
            description: `${selectedCampaigns.length} campaigns have been activated.`,
          });
          break;
        case "pause":
          toast({
            title: "Campaigns Paused",
            description: `${selectedCampaigns.length} campaigns have been paused.`,
          });
          break;
        case "archive":
          toast({
            title: "Campaigns Archived",
            description: `${selectedCampaigns.length} campaigns have been archived.`,
          });
          break;
        case "delete":
          toast({
            title: "Campaigns Deleted",
            description: `${selectedCampaigns.length} campaigns have been deleted.`,
            variant: "destructive",
          });
          break;
      }
      
      setSelectedCampaigns([]);
      onCampaignsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to perform bulk action. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDuplicateCampaign = async (campaign: Campaign) => {
    try {
      console.log("Duplicating campaign:", campaign.id);
      toast({
        title: "Campaign Duplicated",
        description: `"${campaign.title}" has been duplicated successfully.`,
      });
      onCampaignsUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to duplicate campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleExportData = () => {
    const csvData = sortedCampaigns.map(campaign => ({
      title: campaign.title,
      status: campaign.status,
      category: campaign.category,
      goal_amount: campaign.goal_amount,
      current_amount: campaign.current_amount,
      created_at: campaign.created_at,
    }));
    
    console.log("Exporting campaign data:", csvData);
    toast({
      title: "Export Started",
      description: "Your campaign data is being prepared for download.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "archived": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Bulk Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          {selectedCampaigns.length > 0 && (
            <Badge variant="secondary">
              {selectedCampaigns.length} selected
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          {selectedCampaigns.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => handleBulkAction("activate")}
              >
                <Play className="h-4 w-4 mr-2" />
                Activate
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("pause")}
              >
                <Pause className="h-4 w-4 mr-2" />
                Pause
              </Button>
              <Button
                variant="outline"
                onClick={() => handleBulkAction("archive")}
              >
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fundraising">Fundraising</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="awareness">Awareness</SelectItem>
                <SelectItem value="community">Community</SelectItem>
                <SelectItem value="petition">Petition</SelectItem>
                <SelectItem value="social_cause">Social Cause</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Date Created</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="goal_amount">Goal Amount</SelectItem>
                <SelectItem value="current_amount">Progress</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
                setCategoryFilter("all");
                setSortBy("created_at");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Campaign List with Management Options */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Campaigns ({sortedCampaigns.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={selectedCampaigns.length === sortedCampaigns.length && sortedCampaigns.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <span className="text-sm text-gray-600">Select All</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedCampaigns.map((campaign) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedCampaigns.includes(campaign.id)}
                    onCheckedChange={(checked) => handleSelectCampaign(campaign.id, checked as boolean)}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{campaign.title}</h4>
                    <p className="text-sm text-gray-600 truncate">
                      {campaign.description}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {campaign.category}
                      </span>
                      {campaign.goal_amount && (
                        <span className="text-xs text-gray-500">
                          ${campaign.current_amount || 0} / ${campaign.goal_amount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDuplicateCampaign(campaign)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4" />
                  </Button>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Campaign Actions</DialogTitle>
                        <DialogDescription>
                          Choose an action for "{campaign.title}"
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline">
                          <Play className="h-4 w-4 mr-2" />
                          Activate
                        </Button>
                        <Button variant="outline">
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </Button>
                        <Button variant="outline">
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </Button>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignManagementTools;
