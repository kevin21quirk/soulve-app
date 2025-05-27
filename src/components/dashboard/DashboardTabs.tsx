
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Upload, UserPlus, Send, Brain, BarChart3 } from "lucide-react";
import SocialFeed from "./SocialFeed";
import ContentUpload from "./ContentUpload";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import SmartRecommendations from "./SmartRecommendations";
import GamificationPanel from "./GamificationPanel";
import AnalyticsDashboard from "./AnalyticsDashboard";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <TabsList className="grid w-full grid-cols-6 bg-white/80 backdrop-blur">
        <TabsTrigger value="feed" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <MessageSquare className="h-4 w-4" />
          <span>Feed</span>
        </TabsTrigger>
        <TabsTrigger value="upload" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <Upload className="h-4 w-4" />
          <span>Share Need</span>
        </TabsTrigger>
        <TabsTrigger value="connections" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <UserPlus className="h-4 w-4" />
          <span>Connections</span>
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <Send className="h-4 w-4" />
          <span>Messages</span>
        </TabsTrigger>
        <TabsTrigger value="insights" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <Brain className="h-4 w-4" />
          <span>AI Insights</span>
        </TabsTrigger>
        <TabsTrigger value="analytics" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="feed" className="animate-fade-in">
        <SocialFeed />
      </TabsContent>

      <TabsContent value="upload" className="animate-fade-in">
        <ContentUpload />
      </TabsContent>

      <TabsContent value="connections" className="animate-fade-in">
        <EnhancedConnections />
      </TabsContent>

      <TabsContent value="messages" className="animate-fade-in">
        <EnhancedMessaging />
      </TabsContent>

      <TabsContent value="insights" className="animate-fade-in">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <SmartRecommendations />
          </div>
          <div className="space-y-6">
            <GamificationPanel />
          </div>
        </div>
      </TabsContent>

      <TabsContent value="analytics" className="animate-fade-in">
        <AnalyticsDashboard />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
