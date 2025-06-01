
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Search, Edit3, Share2, BarChart3, Pause, Play, Trash2 } from "lucide-react";
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
  type: string;
  status: "active" | "paused" | "completed" | "draft";
  progress: number;
  raised: number;
  goal: number;
  daysLeft: number;
  supporters: number;
  createdAt: string;
}

const mockCampaigns: Campaign[] = [
  {
    id: "1",
    title: "Supporting Dreams: Local Student Scholarship Fund",
    description: "Help us provide educational opportunities to deserving students who face financial barriers.",
    type: "fundraising",
    status: "active",
    progress: 65,
    raised: 6500,
    goal: 10000,
    daysLeft: 25,
    supporters: 48,
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    title: "Growing Together: Community Garden Project",
    description: "Join us in creating a green space where neighbors can grow fresh produce and build connections.",
    type: "community",
    status: "active",
    progress: 40,
    raised: 2000,
    goal: 5000,
    daysLeft: 45,
    supporters: 23,
    createdAt: "2024-02-01"
  },
  {
    id: "3",
    title: "Second Chances: Animal Rescue Initiative",
    description: "Every animal deserves love, care, and a forever home. Help us provide rescue services.",
    type: "fundraising",
    status: "paused",
    progress: 30,
    raised: 4500,
    goal: 15000,
    daysLeft: 120,
    supporters: 67,
    createdAt: "2024-01-20"
  }
];

const CampaignList = () => {
  const [campaigns] = useState<Campaign[]>(mockCampaigns);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fundraising": return "💰";
      case "volunteer": return "🤝";
      case "awareness": return "📢";
      case "community": return "🏘️";
      default: return "📋";
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
        {filteredCampaigns.map(campaign => (
          <Card key={campaign.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-xl">{getTypeIcon(campaign.type)}</span>
                    <h3 className="font-semibold text-lg">{campaign.title}</h3>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-2">{campaign.description}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-500">Progress</p>
                      <div className="flex items-center space-x-2">
                        <Progress 
                          value={campaign.progress} 
                          className="flex-1 [&>div]:bg-gradient-to-r [&>div]:from-[#0ce4af] [&>div]:to-[#18a5fe]" 
                        />
                        <span className="text-sm font-medium">{campaign.progress}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Raised</p>
                      <p className="font-semibold">${campaign.raised.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">of ${campaign.goal.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Supporters</p>
                      <p className="font-semibold">{campaign.supporters}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Days Left</p>
                      <p className="font-semibold">{campaign.daysLeft}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="bg-white text-gray-600 border-gray-200 hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white hover:border-transparent transition-all duration-200"
                    >
                      <Share2 className="h-3 w-3 mr-1" />
                      Share
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
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
                    <DropdownMenuItem>
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
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Campaign
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCampaigns.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600">Try adjusting your search criteria or create a new campaign.</p>
        </Card>
      )}
    </div>
  );
};

export default CampaignList;
