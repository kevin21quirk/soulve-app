
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import RealDiscoverConnectTab from "./tabs/RealDiscoverConnectTab";
import MessagesTab from "./tabs/MessagesTab";
import EnhancedCampaignBuilder from "../campaign-builder/EnhancedCampaignBuilder";
import EnhancedAnalyticsPointsTab from "./tabs/EnhancedAnalyticsPointsTab";
import UserProfile from "./UserProfile";
import InteractiveImpactDashboard from "../impact/InteractiveImpactDashboard";
import { 
  Home, 
  Users, 
  MessageCircle, 
  Target, 
  TrendingUp,
  Trophy, 
  User
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: "feed", label: "Feed", icon: Home, component: EnhancedSocialFeed },
    { id: "discover", label: "Discover & Connect", icon: Users, component: RealDiscoverConnectTab },
    { id: "campaigns", label: "Campaigns & Help", icon: Target, component: EnhancedCampaignBuilder },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "impact", label: "Impact", icon: TrendingUp, component: InteractiveImpactDashboard },
    { id: "points", label: "Points & Trust", icon: Trophy, component: EnhancedAnalyticsPointsTab },
    { id: "profile", label: "Profile", icon: User, component: UserProfile },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TooltipProvider>
        <TabsList className="grid w-full grid-cols-7 h-14 p-1">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.id}
                    className="flex items-center justify-center h-12 px-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
                  >
                    <IconComponent className="h-6 w-6" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </TabsList>
      </TooltipProvider>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <tab.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabs;
