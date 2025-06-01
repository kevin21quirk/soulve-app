
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SocialFeed from "./SocialFeed";
import ConnectionsTab from "./tabs/ConnectionsTab";
import MessagesTab from "./tabs/MessagesTab";
import CampaignsTab from "./tabs/CampaignsTab";
import ImpactTab from "./tabs/ImpactTab";
import DiscoverTab from "./tabs/DiscoverTab";
import { 
  Home, 
  Users, 
  MessageCircle, 
  Heart, 
  BarChart3, 
  Search,
  Bell,
  Settings
} from "lucide-react";

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, onTabChange }: DashboardTabsProps) => {
  const tabs = [
    { id: "feed", label: "Feed", icon: Home, component: SocialFeed },
    { id: "discover", label: "Discover", icon: Search, component: DiscoverTab },
    { id: "connections", label: "Connections", icon: Users, component: ConnectionsTab },
    { id: "campaigns", label: "Campaigns", icon: Heart, component: CampaignsTab },
    { id: "messages", label: "Messages", icon: MessageCircle, component: MessagesTab },
    { id: "impact", label: "Impact", icon: BarChart3, component: ImpactTab },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-6 lg:grid-cols-6">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="flex items-center space-x-2 data-[state=active]:bg-teal-100 data-[state=active]:text-teal-700"
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
