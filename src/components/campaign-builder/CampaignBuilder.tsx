
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, BarChart3, Settings } from "lucide-react";
import EnhancedCampaignBuilder from "./EnhancedCampaignBuilder";
import CampaignManageTab from "./CampaignManageTab";
import CampaignAnalytics from "./CampaignAnalytics";

const CampaignBuilder = () => {
  const [activeTab, setActiveTab] = useState("create");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Campaign Center
            </h1>
            <p className="text-gray-600 mt-2">Create, manage, and analyze your fundraising campaigns</p>
          </div>
          <Badge variant="soulve" className="px-4 py-2">
            <Sparkles className="h-4 w-4 mr-2" />
            Enhanced Builder
          </Badge>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Create Campaign</span>
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Manage Campaigns</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <EnhancedCampaignBuilder />
          </TabsContent>

          <TabsContent value="manage">
            <CampaignManageTab />
          </TabsContent>

          <TabsContent value="analytics">
            <CampaignAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CampaignBuilder;
