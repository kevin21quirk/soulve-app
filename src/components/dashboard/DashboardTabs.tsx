
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialFeed from "./SocialFeed";
import RealDiscoverConnectTab from "./tabs/RealDiscoverConnectTab";
import MessagesTab from "./tabs/MessagesTab";
import EnhancedCampaignBuilder from "../campaign-builder/EnhancedCampaignBuilder";
import ImpactTab from "./tabs/ImpactTab";
import UserProfile from "./UserProfile";
import { 
  Home, 
  Users, 
  MessageCircle, 
  Target, 
  BarChart3, 
  User
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: "feed", label: "Feed", icon: Home, component: SocialFeed },
    { id: "discover", label: "Discover & Connect", icon: Users, component: RealDiscoverConnectTab },
    { id: "campaigns", label: "Campaigns", icon: Target, component: EnhancedCampaignBuilder },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "impact", label: "Trust & Impact", icon: BarChart3, component: ImpactTab },
    { id: "profile", label: "Profile", icon: User, component: UserProfile },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white"
          >
            <tab.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id} className="mt-6">
          <tab.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabs;
