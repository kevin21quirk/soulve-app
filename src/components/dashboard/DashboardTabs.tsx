
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialFeed from "./SocialFeed";
import SmartRecommendations from "./SmartRecommendations";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import EnhancedAnalyticsDashboard from "./EnhancedAnalyticsDashboard";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-8">
        <TabsTrigger value="feed">Feed</TabsTrigger>
        <TabsTrigger value="recommendations">Discover</TabsTrigger>
        <TabsTrigger value="connections">Connect</TabsTrigger>
        <TabsTrigger value="messaging">Messages</TabsTrigger>
        <TabsTrigger value="help-center">Help Center</TabsTrigger>
        <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="mt-6">
        <SocialFeed />
      </TabsContent>

      <TabsContent value="recommendations" className="mt-6">
        <SmartRecommendations />
      </TabsContent>

      <TabsContent value="connections" className="mt-6">
        <EnhancedConnections />
      </TabsContent>

      <TabsContent value="messaging" className="mt-6">
        <EnhancedMessaging />
      </TabsContent>

      <TabsContent value="help-center" className="mt-6">
        <HelpCenter />
      </TabsContent>

      <TabsContent value="campaigns" className="mt-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Campaign Center</h2>
              <p className="text-gray-600">Create and manage impactful campaigns</p>
            </div>
            <Button 
              onClick={() => navigate('/campaign-builder')}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Open Campaign Builder
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-6 rounded-lg border border-teal-200">
              <Target className="h-8 w-8 text-teal-600 mb-3" />
              <h3 className="font-semibold text-teal-900 mb-2">Fundraising Campaigns</h3>
              <p className="text-sm text-teal-700 mb-4">Raise funds for your cause with our powerful fundraising tools</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/campaign-builder')}
                className="border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                Create Fundraiser
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <Target className="h-8 w-8 text-blue-600 mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Volunteer Campaigns</h3>
              <p className="text-sm text-blue-700 mb-4">Recruit volunteers and organize community action</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/campaign-builder')}
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                Find Volunteers
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <Target className="h-8 w-8 text-purple-600 mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Awareness Campaigns</h3>
              <p className="text-sm text-purple-700 mb-4">Spread awareness and educate your community</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/campaign-builder')}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                Raise Awareness
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <UserProfile />
      </TabsContent>

      <TabsContent value="analytics" className="mt-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
