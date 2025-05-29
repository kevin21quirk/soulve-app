
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, User, Settings, Users, Target, BarChart3 } from "lucide-react";

interface MainTabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainTabsList = ({ activeTab, onTabChange }: MainTabsListProps) => {
  const tabs = [
    {
      id: "feed",
      label: "Feed",
      icon: Home,
      description: "Stay updated with the latest community activity"
    },
    {
      id: "help",
      label: "Help Center",
      icon: MessageSquare,
      description: "Get help and support from the community"
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      description: "Manage your profile and settings"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configure your account preferences"
    },
    {
      id: "discover-connect",
      label: "Discover & Connect",
      icon: Users,
      description: "Discover new connections and expand your network"
    },
    {
      id: "messaging",
      label: "Messaging",
      icon: MessageSquare,
      description: "Chat with your connections and community"
    },
    {
      id: "campaigns",
      label: "Campaigns",
      icon: Target,
      description: "Create and manage your campaigns"
    },
    {
      id: "analytics-points",
      label: "Analytics & Points",
      icon: BarChart3,
      description: "View your analytics and points breakdown"
    },
  ];

  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-8">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default MainTabsList;
