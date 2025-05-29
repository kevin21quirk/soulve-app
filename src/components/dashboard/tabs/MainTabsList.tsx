
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home, MessageSquare, User, Settings, Shield, Trophy } from "lucide-react";

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
      id: "verification",
      label: "Verification",
      icon: Shield,
      description: "Verify your identity and increase your trust score"
    },
    {
      id: "challenges",
      label: "Challenges & Events",
      icon: Trophy,
      description: "Join community challenges and events"
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      description: "Configure your account preferences"
    },
  ];

  return (
    <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
      {tabs.map((tab) => (
        <TabsTrigger
          key={tab.id}
          value={tab.id}
          onClick={() => onTabChange(tab.id)}
          className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground"
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default MainTabsList;
