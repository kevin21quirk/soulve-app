
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Users, Heart, BarChart3, Search, HelpCircle, Settings } from "lucide-react";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import EnhancedAnalyticsDashboard from "./EnhancedAnalyticsDashboard";
import SmartSearchEngine from "./search/SmartSearchEngine";
import HelpCenter from "./HelpCenter";
import UserProfile from "./UserProfile";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Welcome to SouLVE</h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access the community dashboard and start connecting with others.
            </p>
            <Button onClick={() => navigate("/auth")} className="w-full">
              Sign In / Sign Up
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className="grid grid-cols-7 w-full bg-white/80 backdrop-blur-sm border shadow-sm">
          <TabsTrigger 
            value="feed" 
            className="flex items-center space-x-2 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-800"
          >
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Feed</span>
          </TabsTrigger>
          <TabsTrigger 
            value="connections" 
            className="flex items-center space-x-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800"
          >
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Network</span>
          </TabsTrigger>
          <TabsTrigger 
            value="messaging" 
            className="flex items-center space-x-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-800"
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Messages</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center space-x-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="hidden sm:inline">Impact</span>
          </TabsTrigger>
          <TabsTrigger 
            value="search" 
            className="flex items-center space-x-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Discover</span>
          </TabsTrigger>
          <TabsTrigger 
            value="help" 
            className="flex items-center space-x-2 data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-800"
          >
            <HelpCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Help</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profile" 
            className="flex items-center space-x-2 data-[state=active]:bg-gray-100 data-[state=active]:text-gray-800"
          >
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="feed" className="space-y-6">
            <EnhancedSocialFeed />
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <EnhancedConnections />
          </TabsContent>

          <TabsContent value="messaging" className="space-y-6">
            <EnhancedMessaging />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <EnhancedAnalyticsDashboard />
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <SmartSearchEngine />
          </TabsContent>

          <TabsContent value="help" className="space-y-6">
            <HelpCenter />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <UserProfile />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default DashboardTabs;
