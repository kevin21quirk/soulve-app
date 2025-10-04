
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings, 
  BarChart3, 
  Share2, 
  Users, 
  Calendar,
  TrendingUp,
  Edit3,
  Pause,
  Play,
  Copy
} from "lucide-react";

interface CampaignManagementToolsProps {
  campaigns: any[];
  onCampaignsUpdate: () => void;
}

const CampaignManagementTools = ({ campaigns, onCampaignsUpdate }: CampaignManagementToolsProps) => {
  const [activeTab, setActiveTab] = useState("overview");

  const mockCampaigns = [
    {
      id: "1",
      title: "Community Garden Initiative",
      status: "active",
      progress: 65,
      raised: 3250,
      goal: 5000,
      supporters: 42,
      daysLeft: 18
    },
    {
      id: "2",
      title: "Local Education Support",
      status: "paused",
      progress: 45,
      raised: 2250,
      goal: 5000,
      supporters: 28,
      daysLeft: 35
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "paused": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campaign Management Tools</h2>
          <p className="text-gray-600 mt-1">Advanced tools to optimise and manage your campaigns</p>
        </div>
        <Button onClick={onCampaignsUpdate}>
          <TrendingUp className="h-4 w-4 mr-2" />
          Optimise All
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automation">Automation</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimisation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Active</p>
                    <p className="text-2xl font-bold">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Supporters</p>
                    <p className="text-2xl font-bold">70</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Raised</p>
                    <p className="text-2xl font-bold">£5,500</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            {mockCampaigns.map((campaign) => (
              <Card key={campaign.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{campaign.title}</h3>
                      <Badge className={getStatusColor(campaign.status)}>
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        {campaign.status === "active" ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>£{campaign.raised.toLocaleString()} raised</span>
                      <span>£{campaign.goal.toLocaleString()} goal</span>
                    </div>
                    <Progress value={campaign.progress} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p className="font-medium">{campaign.supporters}</p>
                      <p>supporters</p>
                    </div>
                    <div>
                      <p className="font-medium">{campaign.progress}%</p>
                      <p>of goal</p>
                    </div>
                    <div>
                      <p className="font-medium">{campaign.daysLeft}</p>
                      <p>days left</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="automation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Settings className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Automation Tools</h3>
                <p className="text-gray-600">Set up automated updates, social media posting, and donor communications.</p>
                <Button className="mt-4">
                  Configure Automation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Analytics</h3>
                <p className="text-gray-600">Deep insights into campaign performance, donor behaviour, and optimisation opportunities.</p>
                <Button className="mt-4">
                  View Full Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Optimisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Campaign Optimisation</h3>
                <p className="text-gray-600">Get AI-powered recommendations to improve your campaign performance.</p>
                <Button className="mt-4">
                  Start Optimisation
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CampaignManagementTools;
