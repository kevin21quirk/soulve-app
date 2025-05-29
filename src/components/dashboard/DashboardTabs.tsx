import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Target, 
  Rss, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  BarChart3, 
  User 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import SocialFeed from "./SocialFeed";
import SmartRecommendations from "./SmartRecommendations";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import EnhancedAnalyticsDashboard from "./EnhancedAnalyticsDashboard";
import GamificationPanel from "./GamificationPanel";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const navigate = useNavigate();

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-7 bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] p-1">
        <TabsTrigger value="feed" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <Rss className="h-4 w-4" />
          <span className="hidden sm:inline">Feed</span>
        </TabsTrigger>
        <TabsTrigger value="discover-connect" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">Discover & Connect</span>
        </TabsTrigger>
        <TabsTrigger value="messaging" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="help-center" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Help Center</span>
        </TabsTrigger>
        <TabsTrigger value="campaigns" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <Target className="h-4 w-4" />
          <span className="hidden sm:inline">Campaigns</span>
        </TabsTrigger>
        <TabsTrigger value="analytics-points" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Analytics & Points</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/80 hover:text-white hover:bg-white/10">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="mt-6">
        <SocialFeed />
      </TabsContent>

      <TabsContent value="discover-connect" className="mt-6">
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">Discover</TabsTrigger>
            <TabsTrigger value="connections">Connect</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations" className="mt-6">
            <SmartRecommendations />
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <EnhancedConnections />
          </TabsContent>
        </Tabs>
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
              className="bg-[#0ce4af] hover:bg-[#0ce4af]/90 text-gray-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              Open Campaign Builder
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#0ce4af]/10 to-[#0ce4af]/20 p-6 rounded-lg border border-[#0ce4af]/30">
              <Target className="h-8 w-8 text-[#0ce4af] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Fundraising Campaigns</h3>
              <p className="text-sm text-gray-700 mb-4">Raise funds for your cause with our powerful fundraising tools</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/campaign-builder')}
                className="border-[#0ce4af] text-[#0ce4af] hover:bg-[#0ce4af]/10"
              >
                Create Fundraiser
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-[#18a5fe]/10 to-[#18a5fe]/20 p-6 rounded-lg border border-[#18a5fe]/30">
              <Target className="h-8 w-8 text-[#18a5fe] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Volunteer Campaigns</h3>
              <p className="text-sm text-gray-700 mb-4">Recruit volunteers and organize community action</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/campaign-builder')}
                className="border-[#18a5fe] text-[#18a5fe] hover:bg-[#18a5fe]/10"
              >
                Find Volunteers
              </Button>
            </div>
            
            <div className="bg-gradient-to-br from-[#4c3dfb]/10 to-[#4c3dfb]/20 p-6 rounded-lg border border-[#4c3dfb]/30">
              <Target className="h-8 w-8 text-[#4c3dfb] mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Awareness Campaigns</h3>
              <p className="text-sm text-gray-700 mb-4">Spread awareness and educate your community</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/campaign-builder')}
                className="border-[#4c3dfb] text-[#4c3dfb] hover:bg-[#4c3dfb]/10"
              >
                Raise Awareness
              </Button>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border border-orange-200">
              <Target className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="font-semibold text-orange-900 mb-2">Social Cause Campaigns</h3>
              <p className="text-sm text-orange-700 mb-4">Drive social change and advocate for important causes</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/campaign-builder')}
                className="border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                Start Movement
              </Button>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="analytics-points" className="mt-6">
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <EnhancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="points" className="mt-6">
            <GamificationPanel />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="profile" className="mt-6">
        <UserProfile />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
