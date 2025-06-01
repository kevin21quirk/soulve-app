import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import SocialFeed from "./SocialFeed";
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
  User,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import HelpApprovalTab from './tabs/HelpApprovalTab';
import { useHelpCompletion } from '@/hooks/useHelpCompletion';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const { pendingRequests } = useHelpCompletion();
  const tabs = [
    { id: "feed", label: "Feed", icon: Home, component: SocialFeed },
    { id: "discover", label: "Discover & Connect", icon: Users, component: RealDiscoverConnectTab },
    { id: "campaigns", label: "Campaigns", icon: Target, component: EnhancedCampaignBuilder },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "impact", label: "Impact", icon: TrendingUp, component: InteractiveImpactDashboard },
    { id: "points", label: "Points & Trust", icon: Trophy, component: EnhancedAnalyticsPointsTab },
    { id: "profile", label: "Profile", icon: User, component: UserProfile },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TooltipProvider>
        <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <Tooltip key={tab.id}>
                <TooltipTrigger asChild>
                  <TabsTrigger
                    value={tab.id}
                    className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
                  >
                    <IconComponent className="h-4 w-4" />
                  </TabsTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{tab.label}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
          <TabsTrigger 
            value="help-approvals" 
            className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approvals
            {pendingRequests.length > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </TooltipProvider>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <tab.component />
        </TabsContent>
      ))}
      <TabsContent value="help-approvals">
        <HelpApprovalTab />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
