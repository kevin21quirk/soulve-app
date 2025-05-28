
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  MessageSquare, 
  BarChart3, 
  Trophy,
  User,
  Heart,
  Rss
} from "lucide-react";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import EnhancedAnalyticsDashboard from "./EnhancedAnalyticsDashboard";
import GamificationPanel from "./GamificationPanel";
import UserProfile from "./UserProfile";
import HelpCenter from "./HelpCenter";

interface DashboardTabsProps {
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const DashboardTabs = ({ activeTab = "feed", onTabChange }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-7 mb-6">
        <TabsTrigger value="feed" className="flex items-center space-x-2">
          <Rss className="h-4 w-4" />
          <span className="hidden sm:inline">Social Feed</span>
        </TabsTrigger>
        <TabsTrigger value="connections" className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span className="hidden sm:inline">My Network</span>
        </TabsTrigger>
        <TabsTrigger value="help-center" className="flex items-center space-x-2">
          <Heart className="h-4 w-4" />
          <span className="hidden sm:inline">Help Center</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center space-x-2">
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">Messages</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center space-x-2">
          <BarChart3 className="h-4 w-4" />
          <span className="hidden sm:inline">Analytics</span>
        </TabsTrigger>
        <TabsTrigger value="gamification" className="flex items-center space-x-2">
          <Trophy className="h-4 w-4" />
          <span className="hidden sm:inline">Points</span>
        </TabsTrigger>
        <TabsTrigger value="profile" className="flex items-center space-x-2">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">Profile</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="space-y-6">
        <EnhancedSocialFeed />
      </TabsContent>

      <TabsContent value="connections" className="space-y-6">
        <EnhancedConnections />
      </TabsContent>

      <TabsContent value="help-center" className="space-y-6">
        <HelpCenter />
      </TabsContent>

      <TabsContent value="messages" className="space-y-6">
        <EnhancedMessaging />
      </TabsContent>

      <TabsContent value="analytics" className="space-y-6">
        <EnhancedAnalyticsDashboard />
      </TabsContent>

      <TabsContent value="gamification" className="space-y-6">
        <GamificationPanel />
      </TabsContent>

      <TabsContent value="profile" className="space-y-6">
        <UserProfile />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
